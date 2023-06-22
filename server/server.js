const spotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const { CLIENT_ID, CLIENT_SECRET } = require("./config");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Limit to 2 requests per minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2,
});

// Listen for a login request and send back an access token
app.post("/login", limiter, (req, res) => {
  const code = req.body.code;
  const spotifyApi = new spotifyWebApi({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: "http://localhost:5173",
  });

  spotifyApi.authorizationCodeGrant(code).then((data) => {
    res.json({
      accessToken: data.body.access_token,
    });
  });
});

app.listen(5174);
