import UseAuth from "./UseAuth";
import SpotifyWebApi from "spotify-web-api-node";
import * as Helpers from "../functions/TrackHelper.jsx";
import { useEffect, useState } from "react";
import { CLIENT_ID, CLIENT_SECRET } from "../config.jsx";

const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: "http://localhost:5173",
});

const Dashboard = ({ code }) => {
  const accessToken = UseAuth(code);
  const [trackOrder, setTrackOrder] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(0);
  const [topTracks, setTopTracks] = useState([]);
  const [trackMap, setTrackMap] = useState({});

  // Create a list of 10 pairs of random numbers between 0 and 19
  // Users will choose between the paired tracks
  useEffect(() => {
    const trackIndices = Array.from({ length: 20 }, (_, index) => index);
    const ordering = [];
    for (let i = 0; i < 10; i++) {
      const randomIndex1 = Math.floor(Math.random() * trackIndices.length);
      const randomTrack1 = trackIndices.splice(randomIndex1, 1)[0];
      const randomIndex2 = Math.floor(Math.random() * trackIndices.length);
      const randomTrack2 = trackIndices.splice(randomIndex2, 1)[0];
      ordering.push([randomTrack1, randomTrack2]);
    }
    setTrackOrder(ordering);
  }, []);

  // Get the user's top tracks
  useEffect(() => {
    if (!accessToken) {
      return;
    }
    spotifyApi.setAccessToken(accessToken);

    spotifyApi.getMyTopTracks().then(
      (data) => {
        setTopTracks(data.body.items);
      },
      (err) => {
        console.log("Problem occurred retrieving top tracks", err);
      }
    );
  }, [accessToken]);

  // Get the audio features for each of the user's top tracks
  useEffect(() => {
    if (topTracks.length === 0) {
      return;
    }

    let _trackMap = {};
    for (let i = 0; i < topTracks.length; i++) {
      spotifyApi.getAudioFeaturesForTrack(topTracks[i].id).then((data) => {
        _trackMap[i] = [topTracks[i], data.body];
      });
    }
    setTrackMap(_trackMap);
  }, [topTracks]);

  const clickButton = () => {
    if (trackMap.length === 0) {
      return;
    }
    if (currentOrder > trackOrder.length - 1) {
      return;
    }

    const track1 = trackMap[trackOrder[currentOrder][0]];
    const track2 = trackMap[trackOrder[currentOrder][1]];
    console.log(Helpers.trackGetImage(track1));
    setCurrentOrder(currentOrder + 1);
  };

  return (
    <div id="dashboard">
      <button onClick={clickButton}>Click me</button>
    </div>
  );
};

export default Dashboard;
