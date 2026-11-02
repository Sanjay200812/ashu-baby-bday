// Minimal PNG generator without external dependencies
const fs = require('fs');
const zlib = require('zlib');

function createPNG(width, height, drawPixel) {
  // RGBA buffer with filter byte per row (0 = None)
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None
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

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

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

// CRC32 table
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

// 1. Character Face (128x128 Transparent with Party Hat & Smiley face)
const charFacePNG = createPNG(128, 128, (x, y, w, h) => {
  const cx = 64, cy = 72, r = 44;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Party Hat (Triangle: top at (64, 8), bottom left (36, 42), bottom right (92, 42))
  if (y >= 8 && y <= 42) {
    const halfWidthAtY = ((y - 8) / 34) * 28;
    if (Math.abs(x - 64) <= halfWidthAtY) {
      // Hat stripes
      const stripe = Math.floor((y + x * 0.5) / 8) % 2 === 0;
      if (stripe) return [255, 65, 108, 255]; // Vivid Pink
      return [255, 209, 102, 255]; // Warm Gold
    }
  }

  // Hat Pom-pom
  const pomDx = x - 64, pomDy = y - 7;
  if (Math.sqrt(pomDx * pomDx + pomDy * pomDy) <= 7) {
    return [255, 230, 109, 255];
  }

  // Head Circle
  if (dist <= r) {
    // Border
    if (dist >= r - 3) return [240, 180, 100, 255];

    // Eyes
    const leftEyeDx = x - 48, leftEyeDy = y - 66;
    const rightEyeDx = x - 80, rightEyeDy = y - 66;
    if (Math.sqrt(leftEyeDx * leftEyeDx + leftEyeDy * leftEyeDy) <= 5 ||
        Math.sqrt(rightEyeDx * rightEyeDx + rightEyeDy * rightEyeDy) <= 5) {
      return [30, 25, 40, 255];
    }
    // Eye sparkle
    if ((x === 47 && y === 64) || (x === 79 && y === 64)) {
      return [255, 255, 255, 255];
    }

    // Cheeks blush
    const leftCheek = Math.sqrt((x - 42) ** 2 + (y - 78) ** 2);
    const rightCheek = Math.sqrt((x - 86) ** 2 + (y - 78) ** 2);
    if (leftCheek <= 8 || rightCheek <= 8) {
      return [255, 140, 160, 255];
    }

    // Smile (arc around cy=74, r=22)
    const smileDist = Math.sqrt(dx * dx + (y - 72) * (y - 72));
    if (y > 74 && y <= 90 && smileDist >= 16 && smileDist <= 20 && Math.abs(dx) <= 22) {
      return [180, 50, 60, 255];
    }

    // Face skin tone
    return [255, 222, 173, 255];
  }

  // Transparent outside
  return [0, 0, 0, 0];
});

fs.writeFileSync('public/images/character-face.png', charFacePNG);

// 2. Birthday Person Photo Placeholder (400x400)
const personPhotoPNG = createPNG(400, 400, (x, y, w, h) => {
  const cx = 200, cy = 200;
  const dx = x - cx, dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background subtle dark radial glow
  const bgGrad = Math.min(255, Math.floor(40 + (dist / 200) * 30));
  
  // Ornate circle frame (r = 180)
  if (dist > 185) {
    return [15, 15, 25, 255];
  }
  if (dist >= 172 && dist <= 185) {
    // Golden rim
    const shimmer = Math.sin((x + y) * 0.05) * 30;
    return [Math.min(255, 225 + shimmer), Math.min(255, 185 + shimmer), 70, 255];
  }

  // Inside frame: gradient background
  const innerR = dist / 172;
  const rCol = Math.floor(35 + (1 - innerR) * 45);
  const gCol = Math.floor(25 + (1 - innerR) * 25);
  const bCol = Math.floor(65 + (1 - innerR) * 60);

  // Stylized silhouette / portrait
  // Head
  const headDist = Math.sqrt((x - 200) ** 2 + (y - 170) ** 2);
  if (headDist <= 65) {
    // Warm tone
    return [245, 205, 160, 255];
  }

  // Birthday Crown on head (y: 80 to 125, x: 155 to 245)
  if (y >= 85 && y <= 125 && Math.abs(x - 200) <= 45) {
    return [255, 215, 0, 255];
  }

  // Shoulders / torso
  const shoulderDist = Math.sqrt(((x - 200) * 0.6) ** 2 + (y - 280) ** 2);
  if (shoulderDist <= 95 && y > 210) {
    // Midnight velvet tuxedo / celebratory outfit
    return [70, 40, 110, 255];
  }

  return [rCol, gCol, bCol, 255];
});

fs.writeFileSync('public/images/birthday-person.png', personPhotoPNG);

// 3. Favicon SVG
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFD700" />
      <stop offset="100%" stop-color="#FF416C" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="#0D0E15" />
  <circle cx="32" cy="18" r="4" fill="#FFD700" filter="drop-shadow(0 0 4px #FFD700)" />
  <rect x="29" y="22" width="6" height="10" rx="2" fill="#FFF" />
  <path d="M14 32 C14 30, 50 30, 50 32 L52 46 C52 50, 12 50, 12 46 Z" fill="url(#grad)" />
  <path d="M12 46 C12 52, 52 52, 52 46 L54 54 C54 58, 10 58, 10 54 Z" fill="#6A11CB" />
  <circle cx="22" cy="38" r="2" fill="#FFF" />
  <circle cx="32" cy="38" r="2" fill="#FFF" />
  <circle cx="42" cy="38" r="2" fill="#FFF" />
</svg>`;

fs.writeFileSync('public/favicon.svg', faviconSvg);

console.log('Generated placeholder assets successfully!');
