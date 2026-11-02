# 🎂 Birthday Arcade — Interactive Birthday Surprise

A premium, cinematic, interactive birthday adventure built with **React**, **TypeScript**, **Phaser 3**, **GSAP**, and **Web Audio**.

---

## 🌟 The Experience Journey

1. **Cinematic Opening Screen**: Atmospheric particle canvas, gold typography, non-intrusive audio toggle, and glowing Play button.
2. **Game 1 — Birthday Flap Adventure (Phaser 3)**: A custom Flappy Bird-style game featuring the birthday person's face mounted on an animated hero body flying through birthday candle towers. Unlocks the arcade at Score 10!
3. **The Birthday Arcade**: Dedicated arcade hub with a visible progress indicator ($X/5$ games completed) and 5 playable mini-games:
   - 🪂 **Birthday Flap**: Replay the opening challenge.
   - 🎁 **Catch the Gifts**: Slide the birthday basket using touch, mouse, or arrow keys to catch treats and avoid prank bombs.
   - 🧠 **Memory Match**: 3D card-flipping game with 8 sweet birthday icon pairs and star ratings.
   - ⚡ **Birthday Reflexes**: Reaction test measuring millisecond reflexes with personalized birthday ranks.
   - 🎈 **Balloon Pop Frenzy**: Fast-paced 30-second balloon popping challenge with realistic pop sounds and golden balloon bonuses.
4. **Final Birthday Surprise**: Full-screen luxury birthday card with:
   - Ornate golden medallion photo frame
   - Interactive birthday cake with candles you can blow out
   - Touching personalized letter scroll
   - Confetti fireworks
   - Custom audio player component

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production (Vercel ready)
```bash
npm run build
```

---

## 🎨 How to Personalize for the Birthday Person

All personalization settings are centralized in **[`src/config/birthdayConfig.ts`](./src/config/birthdayConfig.ts)**:

```typescript
export const BIRTHDAY_CONFIG: BirthdayConfig = {
  // 1. Birthday Person's Name
  personName: "Ashu",
  nickname: "Rockstar",

  // 2. Personal Assets (drop files in public/images/ and public/audio/)
  photoUrl: "/images/birthday-person.png",     // Main photo in Final Surprise
  characterFaceUrl: "/images/character-face.png", // Face for the Flap hero
  birthdaySongUrl: "/audio/birthday-song.mp3",   // Custom MP3 or WAV track
  songTitle: "Birthday Celebration Anthem",
  songArtist: "Dedicated to Ashu with Love",

  // 3. Opening Screen
  openingTitle: "A Special Day Awaits...",
  openingSubtitle: "Your birthday adventure starts here.",

  // 4. Personalized Birthday Message
  surpriseHeading: "Happy Birthday, Ashu! 🎂",
  surpriseSubheading: "Today is all about celebrating the incredible person you are.",
  birthdayLetter: {
    salutation: "Dearest Ashu,",
    paragraphs: [
      "Another trip around the sun, and another chapter of awesome memories...",
      "May this year bring you boundless joy, wild success, and true happiness...",
      "Keep shining brightly and inspiring everyone around you!"
    ],
    closing: "With all my love and biggest hugs,",
    signature: "Your Favorite Person ❤️"
  },

  // 5. Visual Colors & Target
  flapGoalScore: 10,
};
```

### Adding Your Assets:
- **Photo**: Place their photo in `public/images/birthday-person.png` (or `.jpg`/`.webp`).
- **Character Face**: Place a transparent PNG or WebP face crop in `public/images/character-face.png`.
- **Birthday Song**: Place an MP3 or WAV in `public/audio/birthday-song.mp3`. *(If no audio file is provided, the website automatically plays a procedural music-box synthesizer rendition of the Happy Birthday melody!)*

---

## 📱 Devices & Controls
- **Mobile Phones & Tablets**: Full responsive touch controls (tap to flap, drag basket, tap cards, tap balloons).
- **Desktop**: Mouse clicks, Spacebar jump, Arrow keys for basket.
- **Audio**: Respects modern browser autoplay restrictions; sound effects and music activate cleanly on user interaction.
