import { useState, useEffect } from "react";
import axios from "axios";

const UseAuth = (code) => {
  const [accessToken, setAccessToken] = useState();

  // Use axios to make a POST request to the server
  useEffect(() => {
    axios
      .post("http://localhost:5174/login", { code })
      .then((res) => {
        setAccessToken(res.data.accessToken);
      })
      .catch(() => {
        window.location = "/";
      });
  }, [code]);

  return accessToken;
};

export default UseAuth;
