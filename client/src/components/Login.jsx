import QueryString from "query-string";
import { CLIENT_ID } from "../config";

const redirectURI = "http://localhost:5173";
const authURL = "https://accounts.spotify.com/authorize?";
const scope = "user-read-private user-read-email user-top-read";

// URL to redirect user for authorization
const url =
  authURL +
  QueryString.stringify({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: redirectURI,
    scope: scope,
  });

const Login = () => {
  return <a href={url}>Login with Spotify</a>;
};

export default Login;
