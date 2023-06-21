import QueryString from "query-string";
import { CLIENT_ID } from "../config";
import { useRef } from "react";

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
  const loginRef = useRef(null);

  // Rotate the hue of the background based on mouse position
  const rotateHue = (e) => {
    if (loginRef.current === null) {
      return;
    }

    const posX = e.clientX / window.innerWidth - 0.5;
    const posY = e.clientY / window.innerHeight - 0.5;
    const radialDistance = Math.abs(posX) + Math.abs(posY);
    loginRef.current.style.setProperty("--hue", `${radialDistance * 90}deg`);
  };

  return (
    <div
      id="login-screen"
      onMouseMove={(e) => {
        rotateHue(e);
      }}
      ref={loginRef}
    >
      <h1>Spotify Palette</h1>
      <h2>Generate a color palette from your Spotify listening history</h2>
      <div id="login-links">
        <a href={url}>Login with Spotify</a>
        <a
          href={"https://github.com/briannuggets/SpotifyPalette"}
          target="_blank"
        >
          View Code
        </a>
      </div>
      <p>Code by Brian Nguyen</p>
    </div>
  );
};

export default Login;
