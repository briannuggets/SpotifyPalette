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
