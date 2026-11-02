/**
 * ====================================================================
 * 🎂 BIRTHDAY ARCADE CONFIGURATION
 * Aakash & Sanjay's Birthday Surprise
 * ====================================================================
 * You can customize the entire experience from this single file!
 * Update names, dates, quiz questions, photo paths, and messages here.
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MovieQuestion {
  id: string;
  movieTitle: string;
  clues: string[];
  emojiClue: string;
  options: string[];
  correctIndex: number;
  funFact: string;
}

export interface BirthdayConfig {
  // 1. Personal Details
  personName: string;
  nickname: string;
  dob: string; // YYYY-MM-DD
  lockPassword: string; // 03112005
  signers: string[]; // ["Aakash", "Sanjay"]

  // 2. Personal Assets (Relative to the public folder)
  photoUrl: string;          // Main photo displayed in the Final Birthday Surprise
  characterFaceUrl: string;  // Head/face image mounted on character in games
  sleepingPhotoUrl: string;  // Sleeping photo used in Sleep Mode & reactions
  eatingPhotoUrl: string;    // Food-eating photo used in Catch the Food & reactions
  birthdaySongUrl: string;   // MP3 or WAV audio track (Built-in synthesizer used if file not found)
  songTitle: string;         // Display title for the music player
  songArtist: string;        // Display artist/dedication for the music player

  // 3. Opening Welcome Screen
  openingTitle: string;
  openingSubtitle: string;

  // 4. Final Birthday Message
  surpriseHeading: string;
  surpriseSubheading: string;
  birthdayLetter: {
    message: string;
    signature: string;
  };

  // 5. Visual Theme
  theme: {
    primaryColor: string;     // Warm champagne gold
    crimsonAccent: string;    // Crimson red gaming accent
    secondaryColor: string;   // Neon violet
    accentColor: string;      // Cyan
    darkBg: string;           // Midnight dark canvas
  };

  // 6. Target Score for Flap Level 1
  flapGoalScore: number;

  // 6. Gaming Quiz Questions
  gamingQuiz: QuizQuestion[];

  // 7. Funny and Personal Quiz Questions (Aakash & Sanjay edition)
  personalQuiz: QuizQuestion[];

  // 8. Movie Lover Challenge Questions
  movieQuiz: MovieQuestion[];
}

export const BIRTHDAY_CONFIG: BirthdayConfig = {
  // 1. Personal Details
  personName: "Ashu",
  nickname: "Bro",
  dob: "2005-11-03", // November 3, 2005
  lockPassword: "03112005",
  signers: ["Aakash", "Sanjay"],

  // 2. Personal Assets
  photoUrl: "/images/birthday-person.png",
  characterFaceUrl: "/images/character-face.png",
  sleepingPhotoUrl: "/images/sleeping-photo.png",
  eatingPhotoUrl: "/images/eating-photo.png",
  birthdaySongUrl: "/audio/birthday-song.mp3",
  songTitle: "Birthday Anthem (Bro Edition)",
  songArtist: "Dedicated by Aakash & Sanjay",

  // 3. Opening Welcome Screen
  openingTitle: "Your Birthday Adventure Starts Here!",
  openingSubtitle: "One birthday. A whole lot of chaos. One unforgettable surprise.",

  // 4. Final Birthday Message
  surpriseHeading: "Happy Birthday, Bro! 🎂",
  surpriseSubheading: "Another year older, another level unlocked.",
  birthdayLetter: {
    message: `Happy Birthday!

Another year older, another level unlocked.

Wishing you more happiness, more adventures, more success, and countless unforgettable memories.

Keep chasing your dreams, keep being yourself, and never lose that crazy energy.

Here's to another year of friendship, laughter, and legendary moments.

Happy Birthday, bro!`,
    signature: "— Aakash & Sanjay",
  },

  // 5. Visual Theme
  theme: {
    primaryColor: "#FFD700",    // Champagne Gold
    crimsonAccent: "#DC2626",   // Crimson Red Gaming
    secondaryColor: "#E040FB",  // Neon Violet
    accentColor: "#00E5FF",     // Cyan
    darkBg: "#0B0C14",
  },
  flapGoalScore: 10,

  // 6. Gaming Quiz (GTA, Spider-Man, Free Fire, General Gaming)
  gamingQuiz: [
    {
      id: "g1",
      question: "In GTA San Andreas, what is the legendary cheat code for maximum health, armor, and $250,000?",
      options: ["HESOYAM", "BAGUVIX", "AEZAKMI", "ROCKETMAN"],
      correctIndex: 0,
      explanation: "HESOYAM is the legendary code etched into every true gamer's memory!",
    },
    {
      id: "g2",
      question: "In Spider-Man lore, what famous quote did Uncle Ben give to Peter Parker?",
      options: [
        "With great power comes great responsibility",
        "Never give up, never back down",
        "Speed is everything",
        "Webs don't shoot themselves",
      ],
      correctIndex: 0,
      explanation: "'With great power comes great responsibility' — iconic and unforgettable.",
    },
    {
      id: "g3",
      question: "In Free Fire, which popular DJ character has the active healing ability 'Drop the Beat'?",
      options: ["Alok", "K (Captain Booyah)", "Chrono", "Hayato"],
      correctIndex: 0,
      explanation: "DJ Alok and his 5m aura that boosts movement speed and restores HP!",
    },
    {
      id: "g4",
      question: "What is the primary currency earned by surviving and scoring Booyah in battle royales like Free Fire?",
      options: ["Rank Points & Gold", "V-Bucks", "Minecoins", "Robux"],
      correctIndex: 0,
      explanation: "Rank Points push you straight to Grandmaster tier!",
    },
    {
      id: "g5",
      question: "In GTA V, which three protagonists make up the chaotic trio?",
      options: [
        "Michael, Franklin, and Trevor",
        "CJ, Tommy Vercetti, and Claude",
        "Arthur Morgan, John Marston, and Dutch",
        "Niko Bellic, Roman, and Little Jacob",
      ],
      correctIndex: 0,
      explanation: "Michael, Franklin, and Trevor — pure cinematic chaos!",
    },
  ],

  // 7. Funny & Personal Quiz (Aakash & Sanjay Edition)
  personalQuiz: [
    {
      id: "p1",
      question: "When Aakash, Sanjay, and the birthday boy plan to meet up at 5:00 PM, what time does he actually arrive?",
      options: [
        "5:45 PM with 'Bro I'm 2 mins away!'",
        "4:55 PM sharp (Never in history)",
        "Next day morning",
        "Still waiting for his battery to charge",
      ],
      correctIndex: 0,
      explanation: "Classic! The legendary 'Bro I just turned the corner' when he hasn't even left his bed!",
    },
    {
      id: "p2",
      question: "If there is only ONE last slice of pizza or piece of biryani left, what happens?",
      options: [
        "He distracts Aakash & Sanjay and swallows it whole",
        "He politely offers it to Sanjay",
        "He donates it to charity",
        "He puts it in the fridge for tomorrow",
      ],
      correctIndex: 0,
      explanation: "Food ninja mode activated! The plate is clean before anyone blinks.",
    },
    {
      id: "p3",
      question: "What is his official reaction when he gets eliminated in the first 2 minutes of a squad match?",
      options: [
        "'Bro huge ping lag! My joystick stopped working!'",
        "'My bad guys, good shot by the enemy'",
        "Uninstalls the game immediately",
        "Goes to sleep peacefully",
      ],
      correctIndex: 0,
      explanation: "It's NEVER his fault — it's 999ms ping, a phone glitch, or cosmic interference!",
    },
    {
      id: "p4",
      question: "Which of the following describes his ultimate superpower in college?",
      options: [
        "Sleeping 14 hours straight through 8 alarms",
        "Completing assignments 2 weeks in advance",
        "Waking up at 5:00 AM for jogging",
        "Reading terms & conditions completely",
      ],
      correctIndex: 0,
      explanation: "He could sleep through an earthquake, a thunderstorm, and 12 phone calls!",
    },
    {
      id: "p5",
      question: "Who are the two most loyal, legendary, and handsome friends in his life?",
      options: [
        "Aakash & Sanjay (100% indisputable fact)",
        "Aakash & Sanjay (Also this)",
        "Both A and B",
        "All of the above!",
      ],
      correctIndex: 3,
      explanation: "No doubt about it! Certified by international friendship standards.",
    },
  ],

  // 8. Movie Lover Challenge
  movieQuiz: [
    {
      id: "m1",
      movieTitle: "Interstellar",
      emojiClue: "⏳ 🚀 🪐 🌽 📚",
      clues: [
        "A team of astronauts travel through a wormhole near Saturn.",
        "'Love is the one thing that transcends time and space.'",
        "TARS and a dusty bookshelf in a 5th-dimensional tesseract.",
      ],
      options: ["Interstellar", "Gravity", "The Martian", "Inception"],
      correctIndex: 0,
      funFact: "Directed by Christopher Nolan with that legendary Hans Zimmer organ soundtrack!",
    },
    {
      id: "m2",
      movieTitle: "The Dark Knight",
      emojiClue: "🦇 🃏 🏙️ 🤡 💰",
      clues: [
        "'Why so serious?'",
        "A pencil magic trick inside a mob meeting.",
        "Harvey Dent, Gordon, and Gotham's caped protector.",
      ],
      options: ["The Dark Knight", "The Batman", "Joker", "Batman Begins"],
      correctIndex: 0,
      funFact: "Heath Ledger's performance as the Joker won a posthumous Academy Award!",
    },
    {
      id: "m3",
      movieTitle: "Avengers: Endgame",
      emojiClue: "🧤 💎 ⚡ 🛡️ ⏳",
      clues: [
        "'I love you 3000.'",
        "A time-heist to gather six infinity stones.",
        "'Avengers... Assemble!'",
      ],
      options: ["Avengers: Endgame", "Avengers: Infinity War", "Captain America: Civil War", "Thor: Ragnarok"],
      correctIndex: 0,
      funFact: "The ultimate climax of the 22-movie Infinity Saga!",
    },
    {
      id: "m4",
      movieTitle: "Spider-Man: No Way Home",
      emojiClue: "🕷️ 🕸️ 🌀 🧪 ⚡",
      clues: [
        "Doctor Strange's memory spell goes wrong.",
        "Three generations of web-slingers unite on the Statue of Liberty.",
        "'Peter, I'm so sorry.'",
      ],
      options: ["Spider-Man: No Way Home", "Into the Spider-Verse", "Spider-Man 3", "The Amazing Spider-Man 2"],
      correctIndex: 0,
      funFact: "Brought Tobey Maguire, Andrew Garfield, and Tom Holland together on screen!",
    },
    {
      id: "m5",
      movieTitle: "Inception",
      emojiClue: "🌀 💤 🚂 🏢 🎲",
      clues: [
        "A thief who steals corporate secrets through dream-sharing technology.",
        "A spinning brass totem that might never fall.",
        "A city street folding in half in Paris.",
      ],
      options: ["Inception", "Shutter Island", "Tenet", "The Matrix"],
      correctIndex: 0,
      funFact: "Does the spinning top drop at the end? The debate continues forever!",
    },
  ],
};
