import React from "react";
import { useEffect, useState } from "react";
import { generatePalette } from "../functions/AnalysisHelper";

const Results = ({ results }) => {
  const [colors, setColors] = useState(null);
  useEffect(() => {
    const palette = generatePalette(results[0]);
    console.log(results);
    setColors(palette);
  }, [results]);

  return (
    <div id="results">
      <div id="palette">
        <div className="palette-top">
          <div className="palette-top-left">
            <div
              style={
                colors ? { backgroundColor: colors[0], "--delay": "0s" } : null
              }
              className="color"
            />
            <div
              style={
                colors
                  ? { backgroundColor: colors[1], "--delay": "0.2s" }
                  : null
              }
              className="color"
            />
          </div>
          <div
            style={
              colors ? { backgroundColor: colors[2], "--delay": "0.4s" } : null
            }
            className="color"
          />
        </div>
        <div className="palette-bottom">
          <div
            style={
              colors ? { backgroundColor: colors[3], "--delay": "0.6s" } : null
            }
            className="color"
          />
          <div
            style={
              colors ? { backgroundColor: colors[4], "--delay": "0.8s" } : null
            }
            className="color"
          />
        </div>
      </div>
      <div id="description">
        <h1>Your palette: {results[1]}</h1>
        <h2>{results[2]}</h2>
      </div>
    </div>
  );
};

export default Results;
