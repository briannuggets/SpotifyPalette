export const trackGetName = (track) => {
  return track[0].name;
};

export const trackGetArtist = (track) => {
  return track[0].artists[0].name;
};

export const trackGetAlbum = (track) => {
  return track[0].album.name;
};

export const trackGetImage = (track) => {
  return track[0].album.images[0].url;
};
