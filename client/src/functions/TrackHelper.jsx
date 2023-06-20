export const trackGetName = (track) => {
  return track[0].name;
};

export const trackGetArtist = (track) => {
  return track[0].artists[0].name;
};

export const trackGetImage = (track) => {
  return track[0].album.images[0].url;
};

export const trackGetUri = (track) => {
  return track[0].uri;
};

export const trackGetPreview = (track) => {
  return track[0].preview_url;
};

export const processTrack = (track, current) => {
  const updatedAnalysis = [...current];
  updatedAnalysis[0] += track[1].danceability;
  updatedAnalysis[1] += track[1].energy;
  updatedAnalysis[2] += track[1].valence;
  updatedAnalysis[3] += track[1].tempo;
  return updatedAnalysis;
};

export const finalizeAnalysis = (analysis) => {
  const average = analysis.map((value) => {
    return value / 10;
  });
  average[4] = 1;
  return average;
};
