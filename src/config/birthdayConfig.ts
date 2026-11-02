/**
 * ====================================================================
 * 🎂 BIRTHDAY ARCADE CONFIGURATION
 * ====================================================================
 * You can customize the entire experience from this single file!
 * Update names, messages, photo paths, songs, and colors here.
 * Place your custom images in `public/images/` and audio in `public/audio/`.
 */

export interface BirthdayConfig {
  // 1. Personal Details
  personName: string;
  nickname?: string;
  age?: number; // Optional age if you want to display it
  
  // 2. Personal Assets (Relative to the public folder)
  // Simply drop your files in public/images or public/audio and update these filenames
  photoUrl: string;          // Main photo displayed in the Final Birthday Surprise
  characterFaceUrl: string;  // Transparent PNG/WebP face mounted on the Flappy player character
  birthdaySongUrl: string;   // MP3 or WAV audio track (Built-in synthesizer is used if file not found)
  songTitle: string;         // Display title for the music player
  songArtist: string;        // Display artist/dedication for the music player

  // 3. Opening Welcome Screen
  openingTitle: string;
  openingSubtitle: string;
  hintText: string;

  // 4. Final Birthday Message
  surpriseHeading: string;
  surpriseSubheading: string;
  birthdayLetter: {
    salutation: string;
    paragraphs: string[];
    closing: string;
    signature: string;
  };

  // 5. Visual Theme
  theme: {
    primaryColor: string;     // Warm champagne gold
    secondaryColor: string;   // Deep celebratory violet/magenta
    accentColor: string;      // Electric birthday cyan/amber
    darkBg: string;           // Midnight dark canvas
    surfaceColor: string;     // Glass card background
  };

  // 6. Gameplay Targets
  flapGoalScore: number;      // Score needed to unlock Level 1 & Arcade (default: 10)
}

export const BIRTHDAY_CONFIG: BirthdayConfig = {
  // 1. Personal Details
  personName: "Ashu",
  nickname: "Rockstar",
  age: undefined, // Leave undefined or set e.g. 25

  // 2. Personal Assets
  // Drop your actual files in public/images/ and public/audio/
  photoUrl: "/images/birthday-person.png",
  characterFaceUrl: "/images/character-face.png",
  birthdaySongUrl: "/audio/birthday-song.mp3",
  songTitle: "Birthday Celebration Anthem",
  songArtist: "Dedicated to Ashu with Love",

  // 3. Opening Welcome Screen
  openingTitle: "A Special Day Awaits...",
  openingSubtitle: "Your birthday adventure starts here.",
  hintText: "Complete games to uncover a secret surprise waiting at the end ✨",

  // 4. Final Birthday Message
  surpriseHeading: "Happy Birthday, Ashu! 🎂",
  surpriseSubheading: "Today is all about celebrating the incredible person you are.",
  birthdayLetter: {
    salutation: "Dearest Ashu,",
    paragraphs: [
      "Another trip around the sun, and another chapter of awesome memories, big laughs, and unforgettable moments!",
      "May this year bring you boundless joy, wild success in everything you chase, genuine happiness, and all the love you effortlessly share with the world.",
      "Keep shining brightly, dreaming boldly, and inspiring everyone around you just by being your wonderful self. You truly deserve the sweetest celebration today!",
    ],
    closing: "With all my love and biggest hugs,",
    signature: "Your Favorite Person ❤️"
  },

  // 5. Visual Theme
  theme: {
    primaryColor: "#FFD700",      // Gold
    secondaryColor: "#E040FB",    // Neon Pink/Purple
    accentColor: "#00E5FF",       // Electric Cyan
    darkBg: "#0B0C14",            // Midnight
    surfaceColor: "rgba(22, 24, 38, 0.75)", // Translucent card
  },

  // 6. Gameplay Targets
  flapGoalScore: 10,
};
