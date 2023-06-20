import UseAuth from "./UseAuth";
import SpotifyWebApi from "spotify-web-api-node";
import { useEffect, useState, useRef } from "react";
import { CLIENT_ID, CLIENT_SECRET } from "../config.jsx";
import Card from "./Card";
import Player from "./Player";
import * as Helpers from "../functions/TrackHelper.jsx";

const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: "http://localhost:5173",
});

const Dashboard = ({ code }) => {
  const accessToken = UseAuth(code);

  const [trackOrder, setTrackOrder] = useState([]); // List of track pairs
  const [currentOrder, setCurrentOrder] = useState(0); // Current track pair
  const [topTracks, setTopTracks] = useState([]); // User's top tracks
  const [trackMap, setTrackMap] = useState({}); // Map of track index to track data and audio features

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

  // Load the user's top tracks
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

  // Load the audio features for each of the user's top tracks
  const [loadedTracks, setLoadedTracks] = useState(0);
  useEffect(() => {
    if (topTracks.length === 0) {
      return;
    }

    let _trackMap = {};
    for (let i = 0; i < topTracks.length; i++) {
      spotifyApi
        .getAudioFeaturesForTrack(topTracks[i].id)
        .then((data) => {
          _trackMap[i] = [topTracks[i], data.body];
        })
        .then(() => {
          setLoadedTracks((prevLoadedTracks) => prevLoadedTracks + 1);
        });
    }
    setTrackMap(_trackMap);
  }, [topTracks]);

  // Track selection and processing
  const [firstTrack, setFirstTrack] = useState(null);
  const [secondTrack, setSecondTrack] = useState(null);
  const firstCardRef = useRef();
  const secondCardRef = useRef();
  const selectTrack = (track) => {
    // Process the selected track
    if (track !== null) {
      console.log(Helpers.trackGetName(track));
      // On the last track, animate the cards off-screen
      if (currentOrder > trackOrder.length - 1) {
        if (firstCardRef.current !== null || secondCardRef.current !== null) {
          firstCardRef.current.animate(
            { transform: "translateX(-100%)" },
            {
              duration: 800,
              fill: "forwards",
              easing: "cubic-bezier(0.5, 0, 0.75, 0)",
            }
          );
          secondCardRef.current.animate(
            { transform: "translateX(100%)" },
            {
              duration: 800,
              fill: "forwards",
              easing: "cubic-bezier(0.5, 0, 0.75, 0)",
            }
          );
        }
        return;
      }
    }

    // Set the next pair of tracks to compare
    setFirstTrack(trackMap[trackOrder[currentOrder][0]]);
    setSecondTrack(trackMap[trackOrder[currentOrder][1]]);
    setCurrentOrder(currentOrder + 1);
  };

  // Set the first pair of tracks after all tracks have loaded
  useEffect(() => {
    if (loadedTracks === 20) {
      selectTrack(null);
      // Enable pointer events on the cards
      if (firstCardRef.current && secondCardRef.current) {
        firstCardRef.current.classList.add("active");
        secondCardRef.current.classList.add("active");
      }
    }
  }, [loadedTracks]);

  // Play the currently hovered track
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const playTrack = (uri) => {
    setCurrentlyPlaying(uri);
  };

  const backgroundImages = [useRef(), useRef()];

  return (
    <>
      <img
        alt="First background image"
        className="background-image active"
        ref={backgroundImages[0]}
      />
      <img
        alt="Second background image"
        className="background-image"
        ref={backgroundImages[1]}
      />
      <div id="dashboard">
        <Card
          track={firstTrack}
          playTrack={playTrack}
          selectTrack={selectTrack}
          containerRef={firstCardRef}
          background={backgroundImages}
        />
        <Card
          track={secondTrack}
          playTrack={playTrack}
          selectTrack={selectTrack}
          containerRef={secondCardRef}
          background={backgroundImages}
        />
      </div>
      <Player accessToken={accessToken} trackUri={currentlyPlaying} />
    </>
  );
};

export default Dashboard;
