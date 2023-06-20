import { useRef, useEffect, useState } from "react";
import * as Helpers from "../functions/TrackHelper.jsx";

const Card = ({ track, playTrack, selectTrack, containerRef }) => {
  const [playTimeout, setPlayTimeout] = useState(null);

  // Card hover effect
  const cardRef = useRef(null);
  const cardHover = (e) => {
    if (cardRef.current === null || containerRef.current === null) {
      return;
    }
    // Prevent excessive calls to playTrack when switching between cards
    if (track) {
      setPlayTimeout(
        setTimeout(() => {
          // Play the track after a delay
          playTrack(Helpers.trackGetUri(track));
        }, 600)
      );
    }

    // Initial rotation of the card
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const offsetY = (e.clientY - (rect.top + rect.height / 2)) / -rect.height;
    cardRef.current.animate(
      {
        transform: `rotateX(${offsetY * 60}deg) rotateY(${offsetX * 60}deg)`,
      },
      { duration: 800, fill: "forwards", easing: "ease-in" }
    );

    // Rotate the card based on mouse position
    containerRef.current.onmousemove = (e) => {
      if (cardRef.current === null) {
        return;
      }
      const offsetX = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const offsetY = (e.clientY - (rect.top + rect.height / 2)) / -rect.height;
      cardRef.current.animate(
        {
          transform: `rotateX(${offsetY * 60}deg) rotateY(${offsetX * 60}deg)`,
        },
        { duration: 800, fill: "forwards", easing: "ease-in" }
      );
    };
  };
  const cardLeave = () => {
    if (cardRef.current === null || containerRef.current === null) {
      return;
    }
    // Stop playing the track
    if (playTimeout) {
      clearTimeout(playTimeout);
      setPlayTimeout(null);
    }
    playTrack(null);

    // Reset the card rotation
    containerRef.current.onmousemove = null;
    cardRef.current.animate(
      {
        transform: "rotateX(0deg) rotateY(0deg)",
      },
      { duration: 800, fill: "forwards", easing: "ease-out" }
    );
  };

  // Track information
  const [trackName, setTrackName] = useState("");
  const [trackArtist, setTrackArtist] = useState("");
  const [trackImage, setTrackImage] = useState("");
  useEffect(() => {
    if (!track) {
      return;
    }
    setTrackName(Helpers.trackGetName(track));
    setTrackArtist(Helpers.trackGetArtist(track));
    setTrackImage(Helpers.trackGetImage(track));
  }, [track]);

  // Trigger mouseleave event after clicking on a card
  const resetMusic = () => {
    if (containerRef.current === null) {
      return;
    }
    containerRef.current.style.pointerEvents = "none";
    setTimeout(() => {
      containerRef.current.style.pointerEvents = "auto";
    }, 100);
  };

  return (
    <div
      className="card-container"
      onMouseEnter={(e) => {
        cardHover(e);
      }}
      onMouseLeave={cardLeave}
      ref={containerRef}
      onClick={() => {
        if (track === null) {
          return;
        }
        selectTrack(track);
        resetMusic();
      }}
    >
      <div className="card" ref={cardRef}>
        <img alt={`${trackName} album cover`} src={trackImage} />
        <span>{trackName}</span>
        <span>{trackArtist}</span>
      </div>
    </div>
  );
};

export default Card;
