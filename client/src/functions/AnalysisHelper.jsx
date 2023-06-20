// Estimates the genre of a song based on its audio features
const genres = [
  [0.6, 0.6, 0.5, 115, "Pop"],
  [0.3, 0.7, 0.3, 140, "Rock"],
  [0.6, 0.6, 0.2, 100, "Rap"],
  [0.7, 0.7, 0.7, 130, "Dance"],
  [0.3, 0.3, 0.2, 80, "Soul"],
  [0.3, 0.3, 0.2, 90, "Country"],
  [0.2, 0.2, 0.2, 95, "Jazz"],
  [0.6, 0.4, 0.6, 80, "Reggae"],
  [0.1, 0.8, 0.1, 150, "Metal"],
  [0.7, 0.7, 0.7, 105, "Funk"],
  [0.8, 0.8, 0.7, 125, "Disco"],
  [0.6, 0.8, 0.3, 175, "Punk"],
  [0.3, 0.3, 0.2, 80, "Blues"],
  [0.3, 0.5, 0.6, 90, "Gospel"],
  [0.4, 0.4, 0.3, 120, "Indie"],
  [0.3, 0.4, 0.5, 120, "Classical"],
];

// Map of genre to color, name, and description
const genreToColor = new Map([
  [
    "Pop",
    [
      "hsla(0, 100%, 63%, 1)",
      "Fiery Blaze",
      "You have an affinity for music that is filled with captivating melodies and catchy rhythms. Your taste gravitates towards tunes that effortlessly blend irresistible hooks, vibrant beats, and uplifting vibes. Whether it's the infectious chorus or the toe-tapping rhythm, you appreciate the melodic nature of songs that bring joy and leave you humming along.",
    ],
  ],
  [
    "Rock",
    [
      "hsla(14, 100%, 63%, 1)",
      "Ember Glow",
      "You have an undeniable passion for energetic and powerful tunes. Your preferences gravitate towards melodies with an electrifying pulse and raw intensity that can make your heart race and your spirit soar. ",
    ],
  ],
  [
    "Rap",
    [
      "hsla(134, 100%, 63%, 1)",
      "Mystic Verdant",
      "Your taste gravitates towards tracks that intertwine poetry with pulsating beats, delivering powerful narratives that resonate with authenticity and cultural experiences. You appreciate the art of crafting vivid tales, whether it's the introspective introspection or the gritty realities conveyed through clever wordplay.",
    ],
  ],
  [
    "Dance",
    [
      "hsla(179, 100%, 63%, 1)",
      "Enchanting Tide",
      "You find your groove in a realm of pulsating beats and infectious rhythms. You are captivated by tunes that transport you to a euphoric realm, where the world fades away and all that remains is the irresistible allure of the music. You seek out tracks that effortlessly blend futuristic sounds and hypnotic harmonies.",
    ],
  ],
  [
    "Soul",
    [
      "hsla(214, 100%, 63%, 1)",
      "Dreamy Horizon",
      "You are captivated by the timeless melodies that resonate deep within your being, evoking a profound sense of emotion and connection. Your musical preferences revolve around songs that possess an undeniable authenticity, where heartfelt vocals intertwine with rich and melodic instrumentation.",
    ],
  ],
  [
    "Blues",
    [
      "hsla(257, 100%, 63%, 1)",
      "Majestic Twilight",
      "You are captivated by the soul-stirring melodies that echo with a profound sense of longing and introspection. Your musical preferences gravitate towards songs that weave tales of life's trials and tribulations, capturing the essence of raw emotions and the human experience. ",
    ],
  ],
  [
    "Jazz",
    [
      "hsla(50, 100%, 76%, 1)",
      "Sun-kissed Lemonade",
      "Your playlist is a treasure trove of melodies that swing with an irresistible charm, evoking a sense of nostalgia and timeless elegance. Through the captivating melodies and intricate improvisations, you embark on a musical journey filled with surprises.",
    ],
  ],
  [
    "Reggae",
    [
      "hsla(85, 100%, 76%, 1)",
      "Whispering Breeze",
      "You are captivated by the irresistible rhythms and infectious melodies that transport you to a world of laid-back vibes and positive energy. Your musical preferences gravitate towards songs that emanate a sense of warmth, unity, and cultural richness. ",
    ],
  ],
  [
    "Metal",
    [
      "hsla(253, 100%, 76%, 1)",
      "Serene Orchid",
      "You are drawn to the exhilarating world of music that ignites a fire within your very core. Through the explosive melodies and relentless rhythms, you find solace and inspiration, forging a connection to the untamed spirit that resides within you.",
    ],
  ],
  [
    "Funk",
    [
      "hsla(305, 100%, 87%, 1)",
      "Mellow Blush",
      "You are captivated by tracks that seamlessly blend lively instrumentals with irresistibly catchy melodies, creating a sonic tapestry that invites you to groove and let loose. Your playlist is a treasure trove of tunes that exude joy, exuberance, and a celebration of life's vibrant spirit. ",
    ],
  ],
  [
    "Disco",
    [
      "hsla(246, 59%, 27%, 1)",
      "Nightfall Indigo",
      "You are irresistibly drawn to the timeless melodies that transport you to an era of infectious grooves and shimmering lights. Your musical preferences revolve around songs that effortlessly ignite a sense of joy and liberation within you. ",
    ],
  ],
  [
    "Punk",
    [
      "hsla(275, 90%, 76%, 1)",
      "Enigmatic Amythyst",
      "You are fiercely drawn to the rebellious realm of music that defies conventions and embraces unapologetic authenticity. Your musical preferences gravitate towards songs that pack an explosive punch, fuelled by raw energy and a relentless drive.",
    ],
  ],
  [
    "Country",
    [
      "hsla(27, 90%, 40%, 1)",
      "Rustic Spice",
      "Your musical heart beats to the sound of wide-open spaces, heartfelt stories, and the timeless melodies that paint a vivid picture of life's joys and struggles. You find solace in the familiar twang of guitars and the soothing harmony of voices that resonate with the simple pleasures of the human journey.",
    ],
  ],
  [
    "Gospel",
    [
      "hsla(113, 58%, 14%, 1)",
      "Enchanted Forest",
      "The music you gravitate towards carries an undeniable sense of reverence and fills your heart with joy and inspiration. It's the kind of music that effortlessly connects you to something greater, reminding you of the divine presence in every aspect of life.",
    ],
  ],
  [
    "Indie",
    [
      "hsla(112, 47%, 28%, 1)",
      "Verdant Oasis",
      "The songs that resonate with you carry an unmistakable sense of individuality, capturing the essence of untamed creativity and pushing the boundaries of traditional soundscapes. You delight in the discovery of hidden gems, the under-the-radar artists who weave together sonic tapestries that are both captivating and thought-provoking.",
    ],
  ],
  [
    "Classical",
    [
      "hsla(207, 46%, 81%, 1)",
      "Ethereal Mist",
      "You have a refined taste in music that resonates with timeless melodies and intricate harmonies. Your preference leans towards compositions that evoke a sense of elegance, grace, and emotional depth.",
    ],
  ],
]);

// Function to calculate Euclidean distance between two arrays excluding the last element
function calculateEuclideanDistance(arr1, arr2) {
  let sum = 0;
  for (let i = 0; i < arr1.length - 1; i++) {
    sum += Math.pow(arr1[i] - arr2[i], 2);
  }

  return Math.sqrt(sum);
}

// Function to find the most similar row
function findMostSimilarRow(givenArray) {
  let mostSimilarRow = null;
  let smallestDistance = Infinity;

  for (let i = 0; i < genres.length; i++) {
    const row = genres[i];
    const distance = calculateEuclideanDistance(givenArray, row);

    if (distance < smallestDistance) {
      smallestDistance = distance;
      mostSimilarRow = row;
    }
  }

  return mostSimilarRow;
}

export function retrieveAnalysis(analysis) {
  const mostSimilarRow = findMostSimilarRow(analysis);
  return genreToColor.get(mostSimilarRow[4]);
}

export function generatePalette(color) {
  const regex = /hsla\((\d+),\s*(\d+)%,\s*(\d+)%,\s*([\d.]+)\)/;
  const matches = color.match(regex);

  if (matches) {
    const [, h, s, l] = matches;

    // Calculate analogous colors
    const analogous1 = `hsla(${(h - 10) % 360}, ${s}%, ${l}%, 1)`;
    const analogous2 = `hsla(${(h - 5) % 360}, ${s}%, ${l}%, 1)`;
    const analogous3 = `hsla(${(h - 15) % 360}, ${s}%, ${l}%, 1)`;
    const analogous4 = `hsla(${(h - 20) % 360}, ${s}%, ${l}%, 1)`;

    return [analogous1, analogous2, color, analogous3, analogous4];
  }
  return null;
}
