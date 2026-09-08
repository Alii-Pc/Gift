export interface Reason {
  id: string;
  title: string;
  description: string;
}

export interface GameQuestion {
  id: string;
  question: string;
  answers: string[];
  correctAnswerIndex: number;
}

export interface SongConfig {
  id: string;
  title: string;
  artist: string;
  audioSrc?: string;      // Local MP3 (e.g. "/assets/song1.mp3") or direct audio URL
  youtubeUrl?: string;    // Optional YouTube link (e.g. "https://www.youtube.com/watch?v=...")
  coverArt?: string;      // Album cover image path or URL
}

export interface AmbientTuneConfig {
  title: string;
  audioSrc: string;       // e.g. "/assets/ambient.mp3"
}

export interface MemoryPhoto {
  id: string;
  url: string;
  caption: string;
  subtext?: string;
}

export const siteConfig = {
  birthdayPerson: "Laiba",
  
  letterMessage: "I wanted to create something special for you. Something that could hold a fraction of the beauty you bring into my life every single day. Take your time, enjoy the journey, and know that every pixel was placed with love.",
  
  // Ambient background tune played softly across the entire website
  ambientTune: {
    title: "Soft Starlight Melody",
    audioSrc: "/assets/ambient.mp3", // Place your ambient music in public/assets/ambient.mp3
  } as AmbientTuneConfig,

  // 3 Featured Songs for the Songs Chapter
  songs: [
    {
      id: "song-1",
      title: "Tareef",
      artist: "Special One ",
      audioSrc: "/assets/song1.mp3",
      youtubeUrl: "",
      coverArt: "/assets/cover1.jpg",
    },
    {
      id: "song-2",
      title: "Describe you ",
      artist: "Special One ",
      audioSrc: "/assets/song2.mp3",
      youtubeUrl: "",
      coverArt: "/assets/cover2.jpg",
    },
    {
      id: "song-3",
      title: "11.11 Wish",
      artist: "Special One ",
      audioSrc: "/assets/song3.mp3",
      youtubeUrl: "",
      coverArt: "/assets/cover3.jpg",
    },
  ] as SongConfig[],

  // Backward-compatible getter for first song
  get song(): SongConfig {
    return this.songs[0];
  },
  
  reasons: [
    {
      id: "r1",
      title: "Your Smile",
      description: "It lights up even my darkest days and makes everything feel right."
    },
    {
      id: "r2",
      title: "Your Kindness",
      description: "The way you take care of me is genuinely inspiring to witness."
    },
    {
      id: "r3",
      title: "Your Laugh",
      description: "The most beautiful sound I've ever heard. It's contagious."
    },
    {
      id: "r4",
      title: "The Way You Make Ordinary Days Special",
      description: "Just sitting next to you turns a mundane Tuesday into an adventure."
    }
  ] as Reason[],

  gameQuestions: [
    {
      id: "q1",
      question: "What is one thing that always makes you smile?",
      answers: ["Our Conversation", "Unexpected surprises", "Something else"],
      correctAnswerIndex: 0
    },
    {
      id: "q2",
      question: "Which memory would you choose to relive?",
      answers: ["The way i treat you", "The day we met", "Our late night conversation"],
      correctAnswerIndex: 1
    },
    {
      id: "q3",
      question: "What do you think is waiting for you at the end?",
      answers: [ "A gift", "A message", "All of the above"],
      correctAnswerIndex: 2
    }
  ] as GameQuestion[],

  secretCode: "0919", // The user can change this
  
  secretMessage: "I love you more than words can express. Thank you for being you.",

  photos: [
    {
      id: "p1",
      url: "/assets/photo1.jpg",
      caption: "Elegance",
      subtext: "Brightens up even the gloomiest days ",
    },
    {
      id: "p2",
      url: "/assets/photo2.jpg",
      caption: "Your Attitude",
      subtext: "your attitude gives me proud",
    },
    {
      id: "p3",
      url: "/assets/photo3.jpg",
      caption: "Your Style",
      subtext: "The moments where time stood still",
    },
    {
      id: "p4",
      url: "/assets/photo4.jpg",
      caption: "Sweet Little Moment",
      subtext: "Every road with you is an adventure",
    },
    {
      id: "p5",
      url: "/assets/photo5.jpg",
      caption: "Beautiful Smile",
      subtext: "The simple things that mean the most",
    },
    {
      id: "p6",
      url: "/assets/photo6.jpg",
      caption: "Looking Ahead",
      subtext: "To countless more memories together",
    },
  ] as MemoryPhoto[],

  finalMessage: `Happy Birthday Laiba
  
I hope this little experience reminds you
how special you are.

Thank you for being part of my life.

Here's to more memories,
more laughter,
and many more beautiful moments together.
`
};
