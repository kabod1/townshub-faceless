#!/usr/bin/env node
// Generates chrome-extension/icons/icon{16,48,128}.png using pure Node.js (no external deps)
const zlib = require("zlib");
const fs   = require("fs");
const path = require("path");

// ── CRC32 ──────────────────────────────────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const tb = Buffer.from(type, "ascii");
  const len = Buffer.allocUnsafe(4); len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.concat([tb, data]);
  const crc = Buffer.allocUnsafe(4); crc.writeUInt32BE(crc32(crcBuf), 0);
  return Buffer.concat([len, tb, data, crc]);
}

// ── Draw a lightning bolt as pixel art onto the pixel array ───────────────
function drawBolt(pixels, size, stride) {
  // Normalised bolt path — (x, y) pairs as fraction of icon size
  // We draw a filled zig-zag polygon
  const w = size;
  const h = size;
  const cx = w / 2;

  // Bolt drawn as pixel rows
  for (let py = 0; py < h; py++) {
    const fy = py / h;
    for (let px = 0; px < w; px++) {
      const fx = px / w;

      // Top half: angled strip from top-right to center
      const inTop    = fy < 0.52 && fx > (0.55 - fy * 0.5) && fx < (0.78 - fy * 0.3);
      // Bottom half: angled strip from center to bottom-left
      const inBottom = fy >= 0.48 && fx > (0.22 + (fy - 0.48) * 0.3) && fx < (0.5 + (fy - 0.48) * 0.1);

      if (inTop || inBottom) {
        const idx = (py * stride + px) * 3;
        // Dark fill (#04080F)
        pixels[idx]     = 4;
        pixels[idx + 1] = 8;
        pixels[idx + 2] = 15;
      }
    }
  }
}

// ── Build PNG buffer for given size ────────────────────────────────────────
function makePNG(size) {
  const stride = size;
  const pixels = new Uint8Array(size * size * 3);

  // Fill background: gradient from #00D4FF (top-left) to #0060AA (bottom-right)
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const t = (px + py) / (2 * (size - 1));
      const idx = (py * stride + px) * 3;
      pixels[idx]     = Math.round(0x00 + t * (0x00 - 0x00));   // R: 0→0
      pixels[idx + 1] = Math.round(0xD4 + t * (0x60 - 0xD4));   // G: 212→96
      pixels[idx + 2] = Math.round(0xFF + t * (0xAA - 0xFF));   // B: 255→170
    }
  }

  // Draw rounded corners (darken/mask outside rounded rect)
  const r = size * 0.2;
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const dx = Math.max(0, Math.max(r - px, px - (size - 1 - r)));
      const dy = Math.max(0, Math.max(r - py, py - (size - 1 - r)));
      if (dx * dx + dy * dy > r * r) {
        const idx = (py * stride + px) * 3;
        // Transparent area — paint with dark bg colour #080D1A
        pixels[idx] = 8; pixels[idx+1] = 13; pixels[idx+2] = 26;
      }
    }
  }

  // Draw lightning bolt
  if (size >= 16) drawBolt(pixels, size, stride);

  // Scanlines (filter byte = 0 per row)
  const rows = [];
  for (let py = 0; py < size; py++) {
    const row = Buffer.allocUnsafe(1 + size * 3);
    row[0] = 0; // None filter
    for (let px = 0; px < size; px++) {
      const src = (py * stride + px) * 3;
      row[1 + px * 3]     = pixels[src];
      row[1 + px * 3 + 1] = pixels[src + 1];
      row[1 + px * 3 + 2] = pixels[src + 2];
    }
    rows.push(row);
  }

  const raw        = Buffer.concat(rows);
  const compressed = zlib.deflateSync(raw);

  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8]  = 8; // bit depth
  ihdr[9]  = 2; // colour type: RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG sig
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", compressed),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── Write icons ────────────────────────────────────────────────────────────
const outDir = path.join(__dirname, "..", "chrome-extension", "icons");
fs.mkdirSync(outDir, { recursive: true });

for (const size of [16, 48, 128]) {
  const buf  = makePNG(size);
  const file = path.join(outDir, `icon${size}.png`);
  fs.writeFileSync(file, buf);
  console.log(`✓ Generated ${file} (${buf.length} bytes)`);
}

console.log("\nAll icons generated. Chrome Extension is ready to load.");
