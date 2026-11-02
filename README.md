# 🎂 Birthday Arcade — Aakash & Sanjay's Birthday Surprise

A complete, personalized, interactive birthday experience custom-built for your close college mate by **Aakash & Sanjay**. Built using **React**, **TypeScript**, **Phaser 3**, **GSAP**, and the **Web Audio API**.

---

## 🌟 The Complete Experience Flow

### 1. Birthday Lock Screen
- **Fixed Date of Birth**: November 3, 2005 (`2005-11-03`).
- **Passcode**: `03112005` (Numeric on-screen keypad + keyboard input with error feedback).
- **Dynamic Age**: Calculated dynamically from his birth date.
- **Live Countdown**: Animated countdown showing days, hours, minutes, and seconds until his next birthday.

### 2. Opening Screen
- **Main Title**: *"Your Birthday Adventure Starts Here!"*
- **Subtitle**: *"One birthday. A whole lot of chaos. One unforgettable surprise."*
- **Aesthetic**: Dark gaming interface with crimson accents, glowing particles, and pulsing Play button.
- **Audio Control**: Persistent top-right music toggle with zero autoplay until user interaction.

### 3. Game One — Birthday Flap Adventure
- Custom Flappy Bird-style game with his face mounted on a flying superhero body.
- Parallax starfield, clouds, and birthday candle towers with flickering flames.
- Reach **Score 10** (*"Level 1 Complete!"*) to unlock the Birthday Arcade!

### 4. Birthday Arcade (6 Playable Games)
1. 🚗 **GTA Chaos Run**: 3-lane endless runner dodging sports cars, jumping orange barriers, sliding under overhead signs, and collecting cash.
2. 🕷️ **Spider Web Swing**: 2D web-slinging physics platformer swinging between neon skyscrapers to reach the finish line.
3. 🪖 **Battle Royale Survival (Free Fire style)**: Top-down combat arena with a shrinking blue zone, airdrops, medkits, airstrike red zones, and a **"BOOYAH!"** victory celebration.
4. 🍕 **Catch the Food**: Fast-paced food catching game using his **eating photo** with funny reactive speech bubbles (*"Diet starts tomorrow!"*, *"Biryani is life!"*).
5. 😴 **Sleep Mode Challenge**: Hilarious reaction game fighting off the drowsiness meter using his **sleeping photo** in the game-over animation (*"Out cold! 14-hour nap mode engaged"*).
6. 🪂 **Birthday Flap Adventure**: Replay the opening challenge.

### 5. Gaming Quiz
- Multiple-choice trivia covering **GTA** (cheat codes, characters), **Spider-Man**, and **Free Fire**.
- Instant feedback with fact explanations, scoring, and rank badges (*"👑 ESPORTS PRO / LEVEL 100 GAMER"*).

### 6. Funny Questions & Personal Quiz (Aakash & Sanjay Edition)
- Friendly inside jokes, late arrival roasts (*"Bro I'm 2 mins away!"*), gaming excuses, and brotherly friendship ratings.

### 7. Movie Lover Experience
- Guess iconic films from emoji clues (e.g. `⏳ 🚀 🪐 🌽 📚` for *Interstellar*), quotes, and trivia.

### 8. Final Birthday Surprise
- **Card Signed by**: **Aakash & Sanjay** ❤️
- **Default Message**:
  > *"Happy Birthday!  
  > Another year older, another level unlocked.  
  > Wishing you more happiness, more adventures, more success, and countless unforgettable memories.  
  > Keep chasing your dreams, keep being yourself, and never lose that crazy energy.  
  > Here's to another year of friendship, laughter, and legendary moments.  
  > Happy Birthday, bro!  
  > — Aakash & Sanjay"*
- **Interactive Cake**: 3 candles with realistic flickering flames you can blow out or relight with breath sound effects and confetti fireworks.
- **Reusable Audio Player**: Scrubbable progress bar, volume control, mute button, and built-in music-box synth fallback.
- **Full Replay**: Instant reset button to experience the adventure again.

---

## 🎨 Personalization & Assets

All settings are centralized in **[`src/config/birthdayConfig.ts`](./src/config/birthdayConfig.ts)**:

```typescript
export const BIRTHDAY_CONFIG: BirthdayConfig = {
  personName: "Ashu",
  dob: "2005-11-03",
  lockPassword: "03112005",
  signers: ["Aakash", "Sanjay"],

  photoUrl: "/images/birthday-person.png",        // Final surprise photo
  characterFaceUrl: "/images/character-face.png",// Main face for games
  sleepingPhotoUrl: "/images/sleeping-photo.png",// Sleeping photo for Sleep Mode
  eatingPhotoUrl: "/images/eating-photo.png",    // Food-eating photo for Catch Food
  birthdaySongUrl: "/audio/birthday-song.mp3",    // Custom MP3 or WAV
  
  // Easily customize quiz questions, letter text, and targets here!
};
```

### Dropping in Your Actual Photos:
- **Main Photo**: Save to `public/images/birthday-person.png`
- **Character Face**: Save a transparent PNG face crop to `public/images/character-face.png`
- **Eating Photo**: Save his food-eating photo to `public/images/eating-photo.png`
- **Sleeping Photo**: Save his sleeping photo to `public/images/sleeping-photo.png`
- **Song**: Place an MP3 or WAV file in `public/audio/birthday-song.mp3`

---

## 🚀 Running the Project

```bash
# Start development server
npm run dev

# Open http://localhost:3000

# Build for Vercel deployment
npm run build
```
