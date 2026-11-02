// Extended PNG generator for all required placeholders
const fs = require('fs');
const zlib = require('zlib');

function createPNG(width, height, drawPixel) {
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawPixel(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', deflated);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const toCrc = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(calcCrc(toCrc), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function calcCrc(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

// 1. Character Face
const charFacePNG = createPNG(128, 128, (x, y) => {
  const cx = 64, cy = 72, r = 44;
  const dx = x - cx, dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (y >= 8 && y <= 42) {
    const halfWidthAtY = ((y - 8) / 34) * 28;
    if (Math.abs(x - 64) <= halfWidthAtY) {
      const stripe = Math.floor((y + x * 0.5) / 8) % 2 === 0;
      return stripe ? [255, 65, 108, 255] : [255, 209, 102, 255];
    }
  }

  const pomDx = x - 64, pomDy = y - 7;
  if (Math.sqrt(pomDx * pomDx + pomDy * pomDy) <= 7) return [255, 230, 109, 255];

  if (dist <= r) {
    if (dist >= r - 3) return [240, 180, 100, 255];
    const leftEyeDx = x - 48, leftEyeDy = y - 66;
    const rightEyeDx = x - 80, rightEyeDy = y - 66;
    if (Math.sqrt(leftEyeDx * leftEyeDx + leftEyeDy * leftEyeDy) <= 5 ||
        Math.sqrt(rightEyeDx * rightEyeDx + rightEyeDy * rightEyeDy) <= 5) {
      return [30, 25, 40, 255];
    }
    if ((x === 47 && y === 64) || (x === 79 && y === 64)) return [255, 255, 255, 255];
    const leftCheek = Math.sqrt((x - 42) ** 2 + (y - 78) ** 2);
    const rightCheek = Math.sqrt((x - 86) ** 2 + (y - 78) ** 2);
    if (leftCheek <= 8 || rightCheek <= 8) return [255, 140, 160, 255];
    const smileDist = Math.sqrt(dx * dx + (y - 72) * (y - 72));
    if (y > 74 && y <= 90 && smileDist >= 16 && smileDist <= 20 && Math.abs(dx) <= 22) {
      return [180, 50, 60, 255];
    }
    return [255, 222, 173, 255];
  }
  return [0, 0, 0, 0];
});
fs.writeFileSync('public/images/character-face.png', charFacePNG);

// 2. Main Birthday Person Photo
const personPhotoPNG = createPNG(400, 400, (x, y) => {
  const cx = 200, cy = 200;
  const dx = x - cx, dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > 185) return [15, 15, 25, 255];
  if (dist >= 172 && dist <= 185) {
    const shimmer = Math.sin((x + y) * 0.05) * 30;
    return [Math.min(255, 225 + shimmer), Math.min(255, 185 + shimmer), 70, 255];
  }
  const headDist = Math.sqrt((x - 200) ** 2 + (y - 170) ** 2);
  if (headDist <= 65) return [245, 205, 160, 255];
  if (y >= 85 && y <= 125 && Math.abs(x - 200) <= 45) return [255, 215, 0, 255];
  const shoulderDist = Math.sqrt(((x - 200) * 0.6) ** 2 + (y - 280) ** 2);
  if (shoulderDist <= 95 && y > 210) return [70, 40, 110, 255];

  const innerR = dist / 172;
  return [Math.floor(35 + (1 - innerR) * 45), Math.floor(25 + (1 - innerR) * 25), Math.floor(65 + (1 - innerR) * 60), 255];
});
fs.writeFileSync('public/images/birthday-person.png', personPhotoPNG);

// 3. Sleeping Photo Placeholder (Warm, funny night vibe with sleepy face and Zzz)
const sleepingPhotoPNG = createPNG(300, 300, (x, y) => {
  const cx = 150, cy = 150;
  const dx = x - cx, dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Night navy background
  if (dist > 140) return [12, 16, 32, 255];
  if (dist >= 132 && dist <= 140) return [99, 102, 241, 255]; // Indigo border

  // Pillow
  if (y >= 90 && y <= 220 && Math.abs(x - 150) <= 100) {
    if (dist > 75) return [226, 232, 240, 255]; // Fluffy white pillow
  }

  // Sleeping face
  const headDist = Math.sqrt((x - 150) ** 2 + (y - 155) ** 2);
  if (headDist <= 50) {
    // Closed curved eyes (slits)
    if ((y === 148 || y === 149) && ((x >= 130 && x <= 142) || (x >= 158 && x <= 170))) {
      return [40, 30, 50, 255];
    }
    // Sleeping mouth 'o'
    const mouthDist = Math.sqrt((x - 150) ** 2 + (y - 172) ** 2);
    if (mouthDist <= 6) return [160, 50, 70, 255];
    // Sleeping skin
    return [255, 218, 185, 255];
  }

  // Cozy blanket
  if (y > 185) return [79, 70, 229, 255];

  return [30, 27, 75, 255];
});
fs.writeFileSync('public/images/sleeping-photo.png', sleepingPhotoPNG);

// 4. Food Eating Photo Placeholder (Funny eating / feast vibe)
const eatingPhotoPNG = createPNG(300, 300, (x, y) => {
  const cx = 150, cy = 150;
  const dx = x - cx, dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > 140) return [20, 15, 10, 255];
  if (dist >= 132 && dist <= 140) return [245, 158, 11, 255]; // Amber border

  // Feast background
  const headDist = Math.sqrt((x - 150) ** 2 + (y - 135) ** 2);
  if (headDist <= 55) {
    // Wide hungry eyes
    const leftEye = Math.sqrt((x - 135) ** 2 + (y - 125) ** 2);
    const rightEye = Math.sqrt((x - 165) ** 2 + (y - 125) ** 2);
    if (leftEye <= 6 || rightEye <= 6) return [20, 20, 20, 255];
    // Giant open hungry mouth
    if (y >= 145 && y <= 170 && Math.abs(x - 150) <= 22) {
      return [180, 20, 40, 255];
    }
    return [255, 220, 180, 255];
  }

  // Huge slice of pizza / burger in hands
  if (y >= 155 && y <= 210 && Math.abs(x - 150) <= 45) {
    return [239, 68, 68, 255]; // Tasty Food
  }

  return [45, 25, 20, 255];
});
fs.writeFileSync('public/images/eating-photo.png', eatingPhotoPNG);

console.log('Successfully generated all required image placeholders!');
