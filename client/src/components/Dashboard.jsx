import UseAuth from "./UseAuth";
import SpotifyWebApi from "spotify-web-api-node";
import { useEffect, useState, useRef } from "react";
import { CLIENT_ID, CLIENT_SECRET } from "../config.jsx";
import Card from "./Card";
import * as Helpers from "../functions/TrackHelper.jsx";
import { retrieveAnalysis } from "../functions/AnalysisHelper";
import Results from "./Results";

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
  const [analysis, setAnalysis] = useState([0, 0, 0, 0, 0]); // [danceability, energy, valence, tempo, complete flag]
  const selectTrack = (track) => {
    // Process the selected track
    if (track !== null) {
      setAnalysis(Helpers.processTrack(track, analysis));
      // On the last track, animate the cards off-screen before hiding them
      if (currentOrder > trackOrder.length - 1) {
        if (firstCardRef.current !== null || secondCardRef.current !== null) {
          setTimeout(() => {
            firstCardRef.current.style.display = "none";
            secondCardRef.current.style.display = "none";
          }, 400);
        }
        setAnalysis(Helpers.finalizeAnalysis(analysis));
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

  // Analyze final results
  const [results, setResults] = useState(null);
  useEffect(() => {
    if (analysis[4] === 1) {
      const compare = [...analysis];
      compare.pop();
      const results = retrieveAnalysis(compare);
      setResults(results);
    }
  }, [analysis]);

  // Set the first pair of tracks after all tracks have loaded
  useEffect(() => {
    if (loadedTracks) {
      selectTrack(null);
      // Enable pointer events on the cards
      if (firstCardRef.current && secondCardRef.current) {
        firstCardRef.current.classList.add("active");
        secondCardRef.current.classList.add("active");
        musicReset();
      }
    }
  }, [loadedTracks]);

  // Play the currently hovered track
  const audioRef = useRef();
  const playTrack = (url) => {
    if (audioRef.current === null) {
      return;
    }
    if (url === null) {
      audioRef.current.volume = 0;
      return;
    }

    audioRef.current.volume = 0.3;
    audioRef.current.src = url;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
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
        <h1 className="prompt">Which do you like better?</h1>
      </div>
      {results ? <Results results={results} /> : null}
      <audio ref={audioRef} />
    </>
  );
};

export default Dashboard;
