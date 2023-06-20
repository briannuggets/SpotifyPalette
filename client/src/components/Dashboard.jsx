import UseAuth from "./UseAuth";
import SpotifyWebApi from "spotify-web-api-node";
import { useEffect, useState, useRef } from "react";
import { CLIENT_ID, CLIENT_SECRET } from "../config.jsx";
import Card from "./Card";
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
  const [loadedTracks, setLoadedTracks] = useState(false);
  useEffect(() => {
    if (topTracks.length === 0) {
      return;
    }

    let _trackMap = {};
    const trackIds = [];
    for (let i = 0; i < topTracks.length; i++) {
      trackIds.push(topTracks[i].id);
    }
    spotifyApi
      .getAudioFeaturesForTracks(trackIds)
      .then((data) => {
        for (let i = 0; i < data.body.audio_features.length; i++) {
          _trackMap[i] = [topTracks[i], data.body.audio_features[i]];
        }
      })
      .then(() => {
        setLoadedTracks(true);
      });
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
    setTimeout(() => {
      setFirstTrack(trackMap[trackOrder[currentOrder][0]]);
      setSecondTrack(trackMap[trackOrder[currentOrder][1]]);
    }, 200);
    setCurrentOrder(currentOrder + 1);
  };

  // Set the first pair of tracks after all tracks have loaded
  useEffect(() => {
    if (loadedTracks) {
      selectTrack(null);
      // Enable pointer events on the cards
      if (firstCardRef.current && secondCardRef.current) {
        firstCardRef.current.classList.add("active");
        secondCardRef.current.classList.add("active");
      }
    }
  }, [loadedTracks]);

  // Play the currently hovered track
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false);
  const audioRef = useRef();
  const playTrack = (url) => {
    if (audioRef.current === null) {
      return;
    }
    if (url === null) {
      audioRef.current.pause();
      setCurrentlyPlaying(false);
      return;
    }

    audioRef.current.volume = 0.3;
    if (currentlyPlaying) {
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.play();
    } else {
      audioRef.current.src = url;
      audioRef.current.play();
      setCurrentlyPlaying(true);
    }
  };

  // Trigger mouseleave event on cards to play the next track
  const musicReset = () => {
    if (firstCardRef.current === null || secondCardRef.current === null) {
      return;
    }
    firstCardRef.current.classList.add("hidden");
    secondCardRef.current.classList.add("hidden");
    setTimeout(() => {
      firstCardRef.current.style.display = "none";
      secondCardRef.current.style.display = "none";
      firstCardRef.current.classList.add("reveal");
      secondCardRef.current.classList.add("reveal");
    }, 200);
    setTimeout(() => {
      firstCardRef.current.style.display = "flex";
      secondCardRef.current.style.display = "flex";
      firstCardRef.current.classList.remove("hidden");
      secondCardRef.current.classList.remove("hidden");
    }, 300);
    setTimeout(() => {
      firstCardRef.current.classList.remove("reveal");
      secondCardRef.current.classList.remove("reveal");
    }, 500);
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
          musicReset={musicReset}
        />
        <Card
          track={secondTrack}
          playTrack={playTrack}
          selectTrack={selectTrack}
          containerRef={secondCardRef}
          background={backgroundImages}
          musicReset={musicReset}
        />
      </div>
      <audio ref={audioRef} />
    </>
  );
};

export default Dashboard;
