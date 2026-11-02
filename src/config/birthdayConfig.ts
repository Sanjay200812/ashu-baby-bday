/**
 * ====================================================================
 * 🎂 SOUTH DEV // BIRTHDAY SYSTEM BREACH CONFIGURATION
 * Created by Aakash & Sanjay for Ashu (South Dev)
 * ====================================================================
 * Red & Black Hacker Theme with Birthday Vibe
 * 100% Casual Tenglish, Friendly Roasting, Short 1-2 Line Texts
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tenglishRoast: string;
  correctRoast: string;
  optionRoasts: string[]; // Roast reaction for EVERY individual option
}

export interface MovieQuestion {
  id: string;
  movieTitle: string;
  clues: string[];
  emojiClue: string;
  options: string[];
  correctIndex: number;
  funFact: string;
  tenglishRoast: string;
  correctRoast: string;
  optionRoasts: string[]; // Roast reaction for EVERY individual option
}

export interface GiftItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  roast: string;
}

export interface DataFragment {
  id: number;
  title: string;
  encryptedCode: string;
  decryptedMessage: string;
  sourceGame: string;
}

export interface BirthdayConfig {
  personName: string;
  codename: string;
  dob: string;
  lockPassword: string; // 03112005
  signers: string[];

  // Personal Assets
  photoUrl: string;
  bgCardUrl: string; // New bg-card image
  bgVideoUrl: string; // Background looping cyber video
  characterFaceUrl: string;
  sleepingPhotoUrl: string;
  sleepingPhotoUrl2: string;
  eatingPhotoUrl: string;
  specialVideoUrl: string;
  loseClipUrl: string;

  // Audio Tracks: bg-song.mp3 for site, bg-music.mp3 ONLY for first game
  siteBgSongUrl: string;
  gameBgMusicUrl: string;
  birthdaySongUrl: string;

  ashuuSkillsImageUrl: string;
  foodiePhotos: string[];

  songTitle: string;
  songArtist: string;

  // Hacker Breach Strings (in Tenglish)
  openingTitle: string;
  openingSubtitle: string;
  breachWarning: string;
  breachMessage: string;

  // Final Birthday Transmission (in Tenglish)
  surpriseHeading: string;
  surpriseSubheading: string;
  birthdayLetter: {
    message: string;
    signature: string;
  };

  theme: {
    neonRed: string;
    neonGold: string;
    alertRed: string;
    darkBg: string;
  };

  flapGoalScore: number;
  dataFragments: DataFragment[];
  gamingQuiz: QuizQuestion[];
  movieQuiz: MovieQuestion[];
  availableGifts: GiftItem[];
  ashuuSkillsProfile: {
    agency: string;
    founder: string;
    skills: { name: string; icon: string; category: string }[];
    motto: string;
    credit: string;
    pillars: string[];
  };
  personalQuiz: QuizQuestion[];
}

export const BIRTHDAY_CONFIG: BirthdayConfig = {
  personName: "Ashu",
  codename: "SOUTH DEV",
  dob: "2005-11-03", // November 3, 2005
  lockPassword: "50021130", // Date in reverse: 5002-11-30 -> 50021130
  signers: ["Aakash", "Sanjay"],

  photoUrl: "/images/birthday-person.png",
  bgCardUrl: "/images/bg-card.png", // New birthday card background
  bgVideoUrl: "/videos/bg-video.mp4", // Background looping cyber video
  characterFaceUrl: "/images/character-face.png",
  sleepingPhotoUrl: "/images/sleeping-photo-1.png",
  sleepingPhotoUrl2: "/images/sleeping-photo-2.png",
  eatingPhotoUrl: "/images/eating-photo.png",
  specialVideoUrl: "/videos/special-video.mp4",
  loseClipUrl: "/videos/lose-clip.mp4",

  // Audio: bg-song.mp3 for site, bg-music.mp3 ONLY for first game
  siteBgSongUrl: "/audio/bg-song.mp3",
  gameBgMusicUrl: "/audio/bg-music.mp3",
  birthdaySongUrl: "/audio/bg-song.mp3",

  ashuuSkillsImageUrl: "/images/ashuu-skills.png",

  songTitle: "South Dev Cyber Anthem (bg-song.mp3)",
  songArtist: "Injected by Aakash & Sanjay",

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
      { name: "Developer", icon: "</>", category: "Full-Stack Code" },
      { name: "Food Gang", icon: "🍴", category: "Biryani & Feast Protocol" },
    ],
    motto: "Build. Play. Eat. Repeat.",
    credit: "By Sanju #co-founder",
    pillars: ["TECH", "GAMES", "MOVIES", "FOOD", "LIFE"],
  },

  personalQuiz: [],

  // Gifts options - Ashu selects exactly 1 gift
  availableGifts: [
    {
      id: "gf_set",
      title: "GF Set 👩‍❤️‍👨",
      icon: "💝",
      description: "Pre-installed loyalty, zero tantrums package!",
      roast: "Ammo! GF set kavala Ashuu? Modata single life nunchi logout avvali bro! Aakash & Sanjay approval verify cheyali! 😂💔",
    },
    {
      id: "gta6",
      title: "GTA 6 Pre-Order 🚗",
      icon: "🎮",
      description: "Direct entry to Vice City on launch day!",
      roast: "GTA 6 release ayye lopu nuvvu inko 500 sarlu GTA 5 lo Trevor tho blast aipothav! Rockstar Games ki request pettam le! 🕹️💥",
    },
    {
      id: "ps5",
      title: "PS5 Pro Edition ⚡",
      icon: "👾",
      description: "Ultra-fast ray tracing & 120 FPS gaming rig!",
      roast: "PS5 Pro kavala? Free Fire aadataniki PS5 enduku ra South Dev! TV screen meedha Gloo Wall vestava enti! 🎮🤣",
    },
    {
      id: "doomsday_ticket",
      title: "Doomsday Ticket — Sponsor 🎟️",
      icon: "🔥",
      description: "VIP front-row access to the ultimate apocalypse event!",
      roast: "Doomsday ticket sponsor chesam bro! Akkada kooda Biryani and Free Fire aadukuntav emo! 💀🚀",
    },
    {
      id: "biryani_pass",
      title: "Unlimited Biryani Pass 🍗",
      icon: "🍛",
      description: "Lifetime free Biryani & Extra Raitha pass!",
      roast: "Eppudu chusina Biryani meedhane dhyanam! Paradise cashier ki direct nee photo pampinchaam! 🤤🍽️",
    },
    {
      id: "cyber_rig",
      title: "RTX 5090 Coding Rig 💻",
      icon: "🖥️",
      description: "Monster specs to rule CodeXa Agency!",
      roast: "RTX 5090 tho CodeXa Agency servers run chesthava? Bugs solve cheyataniki graphics card enduku bro! 💻🔥",
    },
    {
      id: "meeru_unnaru_chalu",
      title: "Meeru unnaru chalu ❤️",
      icon: "🫂",
      description: "Brothers for life: Aakash, Sanjay & Ashu syndicate forever!",
      roast: "Aha! Em dialogue ra South Dev! Emotional touching gift select chesav! Nuvvu unte maaku chalu bro! 🥺❤️🔥",
    },
  ],

  // Short 1-2 line Tenglish texts
  openingTitle: "WARNING 69 // SYSTEM BREACH",
  openingSubtitle: "South Dev personal system hack aipoindi. Aakash & Sanjay special surprise ready chesaru!",
  breachWarning: "WARNING 69 // SYSTEM BREACH DETECTED",
  breachMessage: "Codexa Agency intrusion active! Ashuu system motham control lo undi.",

  surpriseHeading: "HAPPY BIRTHDAY ASHUU! 🎂",
  surpriseSubheading: "Final Level Cleared // Love from Aakash & Sanjay",

  birthdayLetter: {
    message: `Happy Birthday ra Ashu!

Inko year aipoindi, inko level upgrade aindi. Life lo eppudu happy ga, healthy ga undali.

Gaming lo kottu, Coding lo chimpu, Food lo thaggedhe le! 

Nee dreams anni nijam avvali, life lo full success ravali ani korukuntunnam.

Always bro code forever! Have the happiest birthday South Dev!`,
    signature: "— Aakash & Sanjay",
  },

  theme: {
    neonRed: "#ff2a4b",
    neonGold: "#ffb703",
    alertRed: "#ff2a4b",
    darkBg: "#050508",
  },

  flapGoalScore: 12,

  dataFragments: [
    {
      id: 1,
      title: "FRAGMENT_1",
      encryptedCode: "0x7F4B9_SOUTH_CODE",
      decryptedMessage: "Bro code verified: Aakash & Sanjay always with you.",
      sourceGame: "Birthday Flap",
    },
    {
      id: 2,
      title: "FRAGMENT_2",
      encryptedCode: "0x89C1D_FOOD_FEAST",
      decryptedMessage: "Unlimited Biryani and food protocol approved!",
      sourceGame: "Food Feast",
    },
    {
      id: 3,
      title: "FRAGMENT_3",
      encryptedCode: "0x33A2E_SLEEP_SURVIVAL",
      decryptedMessage: "Wake up hero! Another level awaits.",
      sourceGame: "Sleep Mode",
    },
    {
      id: 4,
      title: "FRAGMENT_4",
      encryptedCode: "0x51E90_GAMING_BOOYAH",
      decryptedMessage: "Booyah unlocked: Every match is yours.",
      sourceGame: "Gaming Quiz",
    },
    {
      id: 5,
      title: "FRAGMENT_5",
      encryptedCode: "0x99F01_CINEMA_LORE",
      decryptedMessage: "Cinema fan number 1: South Dev!",
      sourceGame: "Telugu Movie Quiz",
    },
  ],

  // Free Fire & GTA 5 - 3 Easy Questions with VARIED correct index (1, 3, 2)
  // Some correct answers: South Dev, Ashu, and real answer (Gloo Wall)
  gamingQuiz: [
    {
      id: "g1",
      question: "Free Fire squad lo 1 HP unna kooda clutch kotti Booyah kotte pro player evaru?",
      options: [
        "DJ Alok",
        "South Dev",
        "Chrono",
        "Kelly",
      ],
      correctIndex: 1, // Correct: South Dev (index 1)
      explanation: "South Dev — Free Fire lobby lo one and only clutch king!",
      correctRoast: "Abbo! South Dev pro gamer ani correct ga cheppav! Kaani match lo first nuvve knock aithav bro! 😂🔥",
      tenglishRoast: "Chi deenamma! South Dev clutch skills marchipoyava? Aakash & Sanjay navvuthunnaru! 💀",
      optionRoasts: [
        "DJ Alok heal chesthadu kaani clutch kottaledu bro! South Dev is real king! 🎧",
        "Abbo! South Dev pro gamer ani correct ga cheppav! Kaani match lo first nuvve knock aithav bro! 😂🔥",
        "Chrono shield vesina enemy bullet taguluddi bro, South Dev thopu! 🛡️",
        "Kelly run chesthadi anthe, clutch kottedi mana South Dev! 🏃‍♂️",
      ],
    },
    {
      id: "g2",
      question: "GTA 5 lo Los Santos city lo tank tholukocchi police ki 5-star wanted theppinche real gangster evaru?",
      options: [
        "Trevor Philips",
        "Michael De Santa",
        "Franklin Clinton",
        "Ashu",
      ],
      correctIndex: 3, // Correct: Ashu (index 3)
      explanation: "Ashu — Los Santos police ki night show chupinche real gangster!",
      correctRoast: "Correct! Ashu car drive chesthe traffic rules anni reverse aipothai! 🚗💥",
      tenglishRoast: "Los Santos most wanted criminal mana Ashuu ney marchipoyava bro? 🤦‍♂️",
      optionRoasts: [
        "Trevor psycho ey, kaani Ashuu drive chesina car chusthe Trevor kooda bayapadathadu! 🚗💨",
        "Michael retired bro, Los Santos streets lo Ashuu thopu! 🏡",
        "Franklin dogs ni train chesthadu, Ashuu tank drive chesthadu! 🐕",
        "Correct! Ashu car drive chesthe traffic rules anni reverse aipothai! Los Santos King! 🚗💥",
      ],
    },
    {
      id: "g3",
      question: "Free Fire match lo bullet spray nunchi instant cover & defense kosam em vestharu?",
      options: [
        "Sleeping Bed",
        "Pushpa Thaggedhe Le pose",
        "Gloo Wall",
        "Medkit in open area",
      ],
      correctIndex: 2, // Correct: Gloo Wall (index 2)
      explanation: "Gloo Wall protects from enemy bullet spray instantly!",
      correctRoast: "Gloo Wall telsu kaani enemy sound vinagane open ground lo crouch aipothav ga bro! 🛡️🤣",
      tenglishRoast: "Arey Gloo Wall kooda teleenodu Pro Gamer anta! Match lo direct out! 💀",
      optionRoasts: [
        "Free Fire zone lo bed vesthe Booyah radhu direct knockout osthadi! 🛏️💤",
        "Thaggedhe le pose vesthe bullet direct headshot aipothadi bro! 🪓😂",
        "Gloo Wall telsu kaani enemy sound vinagane open ground lo crouch aipothav ga bro! 🛡️🤣",
        "Open ground lo medkit vesthunte sniper tho lepestharu Ashuu! 💀🤦‍♂️",
      ],
    },
  ],

  // Telugu Movies: Dude, Magadheera, Spider-Man: Brand New Day - VARIED correct index (1, 0, 3)
  // Short 1-2 lines, mixing real answers + funny Ashu/South Dev options + roasts on EVERY option
  movieQuiz: [
    {
      id: "m1",
      movieTitle: "Dude",
      emojiClue: "🕶️ 🎬 🤝 💥 🍿",
      clues: [
        "Mythri Movie Makers fresh youth entertainer.",
        "Pradeep Ranganathan & Mamitha Baiju sensational comedy combo.",
      ],
      options: [
        "Ashu (Lover Boy)",
        "Pradeep Ranganathan",
        "Vijay Deverakonda",
        "South Dev",
      ],
      correctIndex: 1, // Correct: Pradeep Ranganathan (index 1)
      funFact: "Pradeep Ranganathan & Mamitha Baiju trending sensation!",
      correctRoast: "Dude lo Pradeep laaga college lo nuvvu kooda hero anukuntunnav ga! 🎬🕶️",
      tenglishRoast: "Dude movie hero marchipoyava? Cinema gang lo nunchi ninnu suspend chesthunnam! 🤦‍♂️",
      optionRoasts: [
        "Ashuu sunglasses pedithe hero anukuntunnav ga, kaani screen meedha ledu bro! 😎😂",
        "Dude lo Pradeep laaga college lo nuvvu kooda hero anukuntunnav ga! 🎬🕶️",
        "Vijay Deverakonda kaadu bro, Dude lo vere hero! 🍷",
        "South Dev coding lo hero, Dude lo Pradeep hero bro! 💻",
      ],
    },
    {
      id: "m2",
      movieTitle: "Magadheera",
      emojiClue: "⚔️ 🐎 👑 🛡️ 🔥",
      clues: [
        "SS Rajamouli legendary reincarnation blockbuster.",
        "'100 mandhini okesari rammannu' iconic warrior scene.",
      ],
      options: [
        "Kala Bhairava",
        "Ranadev Billa",
        "South Dev after Biryani",
        "Sher Khan",
      ],
      correctIndex: 0, // Correct: Kala Bhairava (index 0)
      funFact: "Kala Bhairava 100 soldiers fight sequence created Indian cinema history!",
      correctRoast: "Bhairava 100 soldiers ni kottadu... Nuvvu canteen lo 100 parotalu kottagalavu! ⚔️🍗",
      tenglishRoast: "Magadheera Kala Bhairava marchipoyava Ashuu? Rajamouli garu chusthe direct shock! 😱",
      optionRoasts: [
        "Bhairava 100 soldiers ni kottadu... Nuvvu canteen lo 100 parotalu kottagalavu! ⚔️🍗",
        "Ranadev Billa villain bro, hero kaadu! 🏹",
        "South Dev Biryani thinnaka 100 nimishalu padukuntadu kaani fight cheyadu! 🍛😴",
        "Sher Khan friend aipothadu, fight chesindi Bhairava tho! 🐎",
      ],
    },
    {
      id: "m3",
      movieTitle: "Spider-Man: Brand New Day",
      emojiClue: "🕷️ 🕸️ 🏙️ 🧬 💥",
      clues: [
        "New York buildings meedha swing avthu villains ni hack chese masked web hero.",
        "Brand New Day era lo South Dev cyber powers tho swing chesthadu!",
      ],
      options: [
        "Peter Parker",
        "Ned Leeds",
        "Green Goblin",
        "South Dev (Web Hacker)",
      ],
      correctIndex: 3, // Correct: South Dev (Web Hacker) (index 3)
      funFact: "South Dev with cyber web swinging powers rules the cyber city!",
      correctRoast: "Spider-Man brand new day lo South Dev cyber superhero avatar approved! 🕷️🕸️🔥",
      tenglishRoast: "Arey mana South Dev Web Hacker ani gurthu pattaledha bro? 🤦‍♂️",
      optionRoasts: [
        "Peter Parker normal Spider-Man, kaani Brand New Day cyber world lo South Dev thopu! 🕸️",
        "Ned guy-in-the-chair bro, superhero kaadu! 🪑",
        "Green Goblin glider meedha unte, South Dev web meedha untadu! 🎃",
        "Spider-Man brand new day lo South Dev cyber superhero avatar approved! 🕷️🕸️🔥",
      ],
    },
  ],
};
