/**
 * ====================================================================
 * 🎂 SOUTH DEV // BIRTHDAY SYSTEM BREACH CONFIGURATION
 * Created by Aakash & Sanjay for Ashu (South Dev)
 * ====================================================================
 * Pure cyberpunk terminal customization file.
 * All quiz questions, secret terminal commands, and birthday messages are here!
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

export interface DataFragment {
  id: number;
  title: string;
  encryptedCode: string;
  decryptedMessage: string;
  sourceGame: string;
}

export interface BirthdayConfig {
  // 1. Target Identity
  personName: string;
  codename: string;
  dob: string; // YYYY-MM-DD
  lockPassword: string; // 03112005
  signers: string[]; // ["Aakash", "Sanjay"]

  // 2. Personal Assets (in public/images/, public/videos/, and public/audio/)
  photoUrl: string;
  characterFaceUrl: string;
  sleepingPhotoUrl: string;
  sleepingPhotoUrl2?: string;
  eatingPhotoUrl: string;
  specialVideoUrl: string;
  loseClipUrl: string;
  gameBgMusicUrl: string;
  ashuuSkillsImageUrl: string;
  foodiePhotos: string[];
  ashuuSkillsProfile: {
    agency: string;
    founder: string;
    skills: { name: string; icon: string; category: string }[];
    motto: string;
    credit: string;
    pillars: string[];
  };
  birthdaySongUrl: string;
  songTitle: string;
  songArtist: string;

  // 3. Stage One: System Breach Boot Script
  openingTitle: string;
  openingSubtitle: string;
  bootLogs: string[];
  breachWarning: string;
  breachMessage: string;

  // 4. Final Birthday Transmission
  surpriseHeading: string;
  surpriseSubheading: string;
  birthdayLetter: {
    message: string;
    signature: string;
  };

  // 5. Visual Palette
  theme: {
    neonGreen: string;
    neonCyan: string;
    alertRed: string;
    darkBg: string;
  };

  // 6. Gameplay Targets
  flapGoalScore: number;

  // 7. Secret Data Fragments (Collect in games to decipher secret transmission)
  dataFragments: DataFragment[];

  // 8. Quizzes
  gamingQuiz: QuizQuestion[];
  personalQuiz: QuizQuestion[];
  movieQuiz: MovieQuestion[];
}

export const BIRTHDAY_CONFIG: BirthdayConfig = {
  // 1. Target Identity
  personName: "Ashu",
  codename: "SOUTH DEV",
  dob: "2005-11-03", // November 3, 2005
  lockPassword: "03112005",
  signers: ["Aakash", "Sanjay"],

  // 2. Personal Assets
  photoUrl: "/images/birthday-person.png",
  characterFaceUrl: "/images/character-face.jpeg",
  sleepingPhotoUrl: "/images/sleeping-photo-1.jpeg",
  sleepingPhotoUrl2: "/images/sleeping-photo-2.jpeg",
  eatingPhotoUrl: "/images/eating-photo.jpeg",
  specialVideoUrl: "/videos/special-video.mp4",
  loseClipUrl: "/videos/lose-clip.mp4",
  gameBgMusicUrl: "/audio/bg-music.mp3",
  ashuuSkillsImageUrl: "/images/ashuu-skills.png",
  foodiePhotos: [
    "/images/foodie/1.jpeg",
    "/images/foodie/2.jpeg",
    "/images/foodie/3.jpeg",
    "/images/foodie/4.jpeg",
    "/images/foodie/5.jpeg",
    "/images/foodie/6.jpeg",
    "/images/foodie/7.jpeg",
  ],
  ashuuSkillsProfile: {
    agency: "CodeXa Agency",
    founder: "Ashuuu",
    skills: [
      { name: "Hacker", icon: "💻", category: "Security & Systems" },
      { name: "Pro Player", icon: "🎮", category: "Battle Royale & Gaming" },
      { name: "Lover Boy", icon: "💔", category: "Emotional Intel" },
      { name: "Depression Guy", icon: "☹️", category: "Night Owl Vibe" },
      { name: "Developer", icon: "</>", category: "Full-Stack Code" },
      { name: "Food Gang", icon: "🍴", category: "Biryani & Feast Protocol" },
      { name: "Movie Gang", icon: "🎬", category: "Cinema & Lore Master" },
    ],
    motto: "Build. Play. Eat. Repeat.",
    credit: "By Sanju #co-founder",
    pillars: ["TECH", "GAMES", "MOVIES", "FOOD", "LIFE"],
  },
  birthdaySongUrl: "/audio/birthday-song.mp3",
  songTitle: "South Dev Cyber Anthem v20.05",
  songArtist: "Composed & Injected by Aakash & Sanjay",

  // 3. Stage One: System Breach Boot Script
  openingTitle: "Your Birthday Adventure Starts Here!",
  openingSubtitle: "One birthday. A whole lot of chaos. One unforgettable surprise.",
  bootLogs: [
    "INITIALIZING SOUTH DEV SYSTEM...",
    "ESTABLISHING SECURE CONNECTION...",
    "UNAUTHORIZED BIRTHDAY SIGNAL DETECTED",
    "TARGET IDENTIFIED: ASHU",
    "CODENAME: SOUTH DEV",
    "BYPASSING SECURITY FIREWALL [100%]...",
    "INJECTING CELEBRATION PAYLOAD...",
    "BIRTHDAY SURPRISE PROTOCOL ACTIVATED",
  ],
  breachWarning: "WARNING: SYSTEM HAS BEEN TAKEN OVER",
  breachMessage: "Someone has a birthday surprise for you.",

  // 4. Final Birthday Transmission
  surpriseHeading: "SYSTEM OVERRIDE: HAPPY BIRTHDAY, SOUTH DEV! 🎂",
  surpriseSubheading: "Final Security Decryption Complete // Signed by Aakash & Sanjay",
  birthdayLetter: {
    message: `Happy Birthday, Ashu!

Another year older. Another level unlocked.

Keep building, keep dreaming, keep gaming, and keep being the legend you are.

Wishing you more success, more adventures, more laughter, and countless unforgettable memories.

Here's to another year of crazy moments, legendary gameplay, and everything you're working towards.

Happy Birthday, South Dev!`,
    signature: "— Aakash & Sanjay",
  },

  // 5. Visual Palette
  theme: {
    neonGreen: "#00ff66",
    neonCyan: "#00e5ff",
    alertRed: "#ff3344",
    darkBg: "#05070a",
  },

  // 6. Flap Target Score: 12 Successful Passes to Unlock Birthday Website
  flapGoalScore: 12,

  // 7. Secret Data Fragments
  dataFragments: [
    {
      id: 1,
      title: "FRAGMENT_ALPHA",
      encryptedCode: "0x7F4B9_SOUTH_CODE",
      decryptedMessage: "Bro code verified: Aakash & Sanjay have your back 24/7.",
      sourceGame: "Birthday Flap",
    },
    {
      id: 2,
      title: "FRAGMENT_BETA",
      encryptedCode: "0x89C1D_GTA_DRIFT",
      decryptedMessage: "Speed limiter removed: You are destined for giant breakthroughs this year.",
      sourceGame: "GTA Digital Escape",
    },
    {
      id: 3,
      title: "FRAGMENT_GAMMA",
      encryptedCode: "0x33A2E_SPIDER_WEB",
      decryptedMessage: "With great coding comes great responsibility: South Dev keeps leveling up.",
      sourceGame: "Web Protocol",
    },
    {
      id: 4,
      title: "FRAGMENT_DELTA",
      encryptedCode: "0x51E90_SURVIVAL_ZONE",
      decryptedMessage: "Booyah guaranteed: Every challenge in life is just another lobby to dominate.",
      sourceGame: "Free Fire Survival",
    },
    {
      id: 5,
      title: "FRAGMENT_OMEGA",
      encryptedCode: "0x99F01_MIDNIGHT_FEAST",
      decryptedMessage: "No diet allowed today: Unlimited biryani and cake protocol initialized!",
      sourceGame: "Food.exe",
    },
  ],

  // 8. Gaming Knowledge Database
  gamingQuiz: [
    {
      id: "g1",
      question: "In GTA San Andreas, what is the legendary cheat code for full health, armor, and $250,000?",
      options: ["HESOYAM", "BAGUVIX", "AEZAKMI", "ROCKETMAN"],
      correctIndex: 0,
      explanation: "HESOYAM is burned into every South Dev hacker's memory!",
    },
    {
      id: "g2",
      question: "In Spider-Man lore, what famous line defines Peter Parker's heroic path?",
      options: [
        "With great power comes great responsibility",
        "Never give up, never back down",
        "Speed is everything",
        "Webs don't shoot themselves",
      ],
      correctIndex: 0,
      explanation: "The ultimate superhero principle: With great power comes great responsibility.",
    },
    {
      id: "g3",
      question: "In Free Fire, which DJ character uses the active healing aura 'Drop the Beat'?",
      options: ["Alok", "K (Captain Booyah)", "Chrono", "Hayato"],
      correctIndex: 0,
      explanation: "DJ Alok — the undisputed battle royale squad savior!",
    },
    {
      id: "g4",
      question: "In cyber-gaming terminology, what does 'FPS' stand for?",
      options: [
        "Frames Per Second / First-Person Shooter",
        "Fast Packet Stream",
        "Frequency Power System",
        "File Processing Server",
      ],
      correctIndex: 0,
      explanation: "Frames Per Second for smoothness, First-Person Shooter for gameplay!",
    },
    {
      id: "g5",
      question: "In GTA V, which chaotic trio forms the criminal masterminds of Los Santos?",
      options: [
        "Michael, Franklin, and Trevor",
        "CJ, Tommy Vercetti, and Claude",
        "Arthur Morgan, John Marston, and Dutch",
        "Niko Bellic, Roman, and Little Jacob",
      ],
      correctIndex: 0,
      explanation: "Michael, Franklin, and Trevor — pure digital pandemonium!",
    },
  ],

  // 9. Personal Data Interrogation (Aakash & Sanjay edition)
  personalQuiz: [
    {
      id: "p1",
      question: "When Aakash and Sanjay plan a meetup at 5:00 PM, what is South Dev's expected arrival time?",
      options: [
        "5:45 PM with 'Bro I'm 2 mins away!'",
        "4:55 PM sharp (Never in recorded history)",
        "Next day morning",
        "Still buffering in bed",
      ],
      correctIndex: 0,
      explanation: "Classic! The legendary 'Bro I just turned the corner' while still brushing his teeth!",
    },
    {
      id: "p2",
      question: "If there is exactly ONE last slice of pizza or piece of biryani left on the table, what happens?",
      options: [
        "South Dev distracts Aakash & Sanjay and swallows it whole",
        "He politely offers it to Sanjay",
        "He donates it to charity",
        "He puts it in the fridge for tomorrow",
      ],
      correctIndex: 0,
      explanation: "Food ninja protocol activated! The plate is licked clean before anyone blinks.",
    },
    {
      id: "p3",
      question: "What is South Dev's official diagnosis when he dies in the first 2 minutes of a squad match?",
      options: [
        "'Bro 999ms ping spike! My screen froze!'",
        "'My bad guys, enemy played well'",
        "Uninstalls the game immediately",
        "Goes to sleep peacefully",
      ],
      correctIndex: 0,
      explanation: "It's NEVER his fault — it's always cosmic WiFi interference or an optical glitch!",
    },
    {
      id: "p4",
      question: "What is Ashu's true superhuman superpower in college?",
      options: [
        "Sleeping 14 hours straight through 8 alarms",
        "Completing assignments 2 weeks in advance",
        "Waking up at 5:00 AM for morning jogs",
        "Reading terms & conditions completely",
      ],
      correctIndex: 0,
      explanation: "He could sleep through an alien invasion, an earthquake, and 14 missed calls!",
    },
    {
      id: "p5",
      question: "Who are the two most loyal, legendary, and handsome hackers in his life?",
      options: [
        "Aakash & Sanjay (100% indisputable fact)",
        "Aakash & Sanjay (Also this)",
        "Both A and B",
        "All of the above!",
      ],
      correctIndex: 3,
      explanation: "Confirmed by global brotherly consensus: Aakash & Sanjay for life!",
    },
  ],

  // 10. Movie Knowledge Decryption
  movieQuiz: [
    {
      id: "m1",
      movieTitle: "Interstellar",
      emojiClue: "⏳ 🚀 🪐 🌽 📚",
      clues: [
        "A team of astronauts travel through a wormhole near Saturn.",
        "'Love is the one thing that transcends time and space.'",
        "TARS robot and a 5th-dimensional tesseract bookshelf.",
      ],
      options: ["Interstellar", "Gravity", "The Martian", "Inception"],
      correctIndex: 0,
      funFact: "Directed by Christopher Nolan with that legendary Hans Zimmer organ score!",
    },
    {
      id: "m2",
      movieTitle: "The Dark Knight",
      emojiClue: "🦇 🃏 🏙️ 🤡 💰",
      clues: [
        "'Why so serious?'",
        "A pencil magic trick inside a mob summit.",
        "Harvey Dent, Commissioner Gordon, and Gotham's caped hero.",
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
        "A quantum time-heist to gather six infinity stones.",
        "'Avengers... Assemble!'",
      ],
      options: ["Avengers: Endgame", "Avengers: Infinity War", "Captain America: Civil War", "Thor: Ragnarok"],
      correctIndex: 0,
      funFact: "The epic culmination of the 22-film Infinity Saga!",
    },
    {
      id: "m4",
      movieTitle: "Spider-Man: No Way Home",
      emojiClue: "🕷️ 🕸️ 🌀 🧪 ⚡",
      clues: [
        "Doctor Strange's memory wipe spell fractures reality.",
        "Three generations of web-slingers unite on the Statue of Liberty.",
        "'Peter, I'm so sorry.'",
      ],
      options: ["Spider-Man: No Way Home", "Into the Spider-Verse", "Spider-Man 3", "The Amazing Spider-Man 2"],
      correctIndex: 0,
      funFact: "Brought Tobey Maguire, Andrew Garfield, and Tom Holland together in one frame!",
    },
    {
      id: "m5",
      movieTitle: "Inception",
      emojiClue: "🌀 💤 🚂 🏢 🎲",
      clues: [
        "A thief who extracts corporate secrets by entering dreams.",
        "A spinning brass totem that might never topple over.",
        "A city street in Paris folding vertically in half.",
      ],
      options: ["Inception", "Shutter Island", "Tenet", "The Matrix"],
      correctIndex: 0,
      funFact: "Does the spinning top wobble and fall at the end? The debate continues forever!",
    },
  ],
};
