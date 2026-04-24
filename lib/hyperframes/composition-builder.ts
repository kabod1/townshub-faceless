/**
 * Converts Townshub video editor scenes into a valid HyperFrames HTML composition.
 * Output can be rendered with: npx hyperframes render --input composition.html --output output.mp4
 *
 * HyperFrames: https://github.com/heygen-com/hyperframes
 * Architecture: each clip element carries data-start / data-duration / data-track-index.
 * A GSAP timeline registered at window.__timelines.composition drives all animation.
 * Chrome BeginFrame + FFmpeg encode the result deterministically.
 */

export interface HFTextOverlay {
  text: string;
  position: "top" | "center" | "bottom";
  color: string;
}

export interface HFScene {
  id: string;
  title: string;
  imageUrl: string;
  videoUrl: string;
  prompt: string;
  script: string;
  duration: number;
  transition: "fade" | "cut" | "slide" | "zoom";
  audioUrl: string;
  textOverlay: HFTextOverlay;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const PLACEHOLDER_COLORS = [
  "#0f172a", "#1e1b4b", "#172554", "#14532d", "#1c1917",
];

const FADE_DUR = 0.5;
const SLIDE_PX = 1280;

export function buildHyperFramesComposition(
  scenes: HFScene[],
  projectName: string
): string {
  if (!scenes.length) return "";

  // Compute per-scene start times
  const starts: number[] = [];
  let t = 0;
  for (const s of scenes) {
    starts.push(t);
    t += s.duration;
  }
  const totalDuration = t;

  // ── Clip HTML ────────────────────────────────────────────────
  const clipsHtml = scenes
    .map((scene, i) => {
      const start = starts[i];
      const dur = scene.duration;
      const parts: string[] = [];

      // Media layer (track 0)
      if (scene.videoUrl) {
        parts.push(
          `    <video class="clip sc${i}-media" src="${esc(scene.videoUrl)}" muted\n` +
          `      data-start="${start}" data-duration="${dur}" data-track-index="0"\n` +
          `      style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:0;"></video>`
        );
      } else if (scene.imageUrl) {
        parts.push(
          `    <img class="clip sc${i}-media" src="${esc(scene.imageUrl)}"\n` +
          `      data-start="${start}" data-duration="${dur}" data-track-index="0"\n` +
          `      style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:0;" />`
        );
      } else {
        const bg = PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length];
        parts.push(
          `    <div class="clip sc${i}-media"\n` +
          `      data-start="${start}" data-duration="${dur}" data-track-index="0"\n` +
          `      style="position:absolute;top:0;left:0;width:100%;height:100%;background:${bg};` +
          `opacity:0;display:flex;align-items:center;justify-content:center;">\n` +
          `      <span style="color:rgba(255,255,255,0.08);font-size:96px;font-family:Inter,sans-serif;font-weight:900;">${i + 1}</span>\n` +
          `    </div>`
        );
      }

      // Text overlay (track 1)
      if (scene.textOverlay?.text?.trim()) {
        const pos =
          scene.textOverlay.position === "top"
            ? "top:52px"
            : scene.textOverlay.position === "center"
            ? "top:50%;transform:translateY(-50%)"
            : "bottom:52px";
        parts.push(
          `    <div class="clip sc${i}-text"\n` +
          `      data-start="${start}" data-duration="${dur}" data-track-index="1"\n` +
          `      style="position:absolute;${pos};left:0;right:0;text-align:center;padding:0 80px;opacity:0;">\n` +
          `      <p style="color:${esc(scene.textOverlay.color)};font-size:38px;font-weight:800;` +
          `font-family:Inter,sans-serif;text-shadow:0 3px 14px rgba(0,0,0,0.9);margin:0;line-height:1.3;">\n` +
          `        ${esc(scene.textOverlay.text)}\n` +
          `      </p>\n` +
          `    </div>`
        );
      }

      // Scene title caption (track 2) — small lower-third
      if (scene.title?.trim()) {
        parts.push(
          `    <div class="clip sc${i}-title"\n` +
          `      data-start="${start}" data-duration="${dur}" data-track-index="2"\n` +
          `      style="position:absolute;bottom:28px;left:40px;opacity:0;">\n` +
          `      <p style="color:rgba(255,255,255,0.55);font-size:13px;font-weight:600;` +
          `font-family:Inter,sans-serif;letter-spacing:0.06em;text-transform:uppercase;margin:0;">${esc(scene.title)}</p>\n` +
          `    </div>`
        );
      }

      return `    <!-- Scene ${i + 1}: ${start}s – ${start + dur}s -->\n` + parts.join("\n");
    })
    .join("\n\n");

  // ── GSAP animation script ────────────────────────────────────
  const anims: string[] = ["    const tl = gsap.timeline({ paused: true });", ""];

  scenes.forEach((scene, i) => {
    const start = starts[i];
    const end = start + scene.duration;
    const tr = scene.transition;
    const prev = i - 1;
    const hasText = !!(scene.textOverlay?.text?.trim());
    const prevHasText = !!(scenes[prev]?.textOverlay?.text?.trim());

    anims.push(`    // ── Scene ${i + 1} (${tr}) ──`);

    if (i === 0) {
      // First scene: straight fade in
      anims.push(`    tl.to('.sc0-media', { opacity: 1, duration: ${FADE_DUR} }, 0);`);
      if (hasText) {
        anims.push(`    tl.to('.sc0-text',  { opacity: 1, duration: 0.4 }, 0.4);`);
      }
      anims.push(`    tl.to('.sc0-title', { opacity: 1, duration: 0.3 }, 0.3);`);
    } else {
      const ts = start - (tr === "cut" ? 0 : FADE_DUR / 2); // transition start

      if (tr === "fade") {
        anims.push(`    tl.to('.sc${prev}-media', { opacity: 0, duration: ${FADE_DUR} }, ${ts});`);
        anims.push(`    tl.to('.sc${i}-media',    { opacity: 1, duration: ${FADE_DUR} }, ${ts});`);
        if (prevHasText) anims.push(`    tl.to('.sc${prev}-text',  { opacity: 0, duration: 0.3 }, ${ts});`);
        anims.push(`    tl.to('.sc${prev}-title', { opacity: 0, duration: 0.3 }, ${ts});`);
        if (hasText) anims.push(`    tl.to('.sc${i}-text',    { opacity: 1, duration: 0.4 }, ${start + 0.4});`);
        anims.push(`    tl.to('.sc${i}-title',    { opacity: 1, duration: 0.3 }, ${start + 0.3});`);

      } else if (tr === "cut") {
        anims.push(`    tl.set('.sc${prev}-media', { opacity: 0 }, ${start});`);
        anims.push(`    tl.set('.sc${i}-media',    { opacity: 1 }, ${start});`);
        if (prevHasText) anims.push(`    tl.set('.sc${prev}-text',  { opacity: 0 }, ${start});`);
        anims.push(`    tl.set('.sc${prev}-title', { opacity: 0 }, ${start});`);
        if (hasText) anims.push(`    tl.to('.sc${i}-text',    { opacity: 1, duration: 0.3 }, ${start + 0.2});`);
        anims.push(`    tl.to('.sc${i}-title',    { opacity: 1, duration: 0.2 }, ${start + 0.2});`);

      } else if (tr === "slide") {
        anims.push(`    gsap.set('.sc${i}-media', { x: ${SLIDE_PX}, opacity: 1 });`);
        anims.push(`    tl.to('.sc${prev}-media', { x: -${SLIDE_PX}, duration: ${FADE_DUR}, ease: 'power2.inOut' }, ${ts});`);
        anims.push(`    tl.to('.sc${i}-media',    { x: 0,            duration: ${FADE_DUR}, ease: 'power2.inOut' }, ${ts});`);
        if (prevHasText) anims.push(`    tl.to('.sc${prev}-text',  { opacity: 0, duration: 0.2 }, ${ts});`);
        anims.push(`    tl.to('.sc${prev}-title', { opacity: 0, duration: 0.2 }, ${ts});`);
        if (hasText) anims.push(`    tl.to('.sc${i}-text',    { opacity: 1, duration: 0.4 }, ${start + 0.4});`);
        anims.push(`    tl.to('.sc${i}-title',    { opacity: 1, duration: 0.3 }, ${start + 0.3});`);

      } else if (tr === "zoom") {
        anims.push(`    gsap.set('.sc${i}-media', { scale: 0.92, opacity: 1 });`);
        anims.push(`    tl.to('.sc${prev}-media', { scale: 1.08, opacity: 0, duration: ${FADE_DUR}, ease: 'power2.inOut' }, ${ts});`);
        anims.push(`    tl.to('.sc${i}-media',    { scale: 1,    duration: ${FADE_DUR}, ease: 'power2.inOut' }, ${ts});`);
        if (prevHasText) anims.push(`    tl.to('.sc${prev}-text',  { opacity: 0, duration: 0.2 }, ${ts});`);
        anims.push(`    tl.to('.sc${prev}-title', { opacity: 0, duration: 0.2 }, ${ts});`);
        if (hasText) anims.push(`    tl.to('.sc${i}-text',    { opacity: 1, duration: 0.4 }, ${start + 0.4});`);
        anims.push(`    tl.to('.sc${i}-title',    { opacity: 1, duration: 0.3 }, ${start + 0.3});`);
      }
    }

    // Subtle Ken Burns on images
    if (scene.imageUrl && !scene.videoUrl) {
      anims.push(
        `    tl.fromTo('.sc${i}-media', { scale: 1 }, ` +
        `{ scale: 1.06, duration: ${scene.duration}, ease: 'none' }, ${start});`
      );
    }

    anims.push("");
  });

  // Fade out final scene
  const lastI = scenes.length - 1;
  const lastEnd = totalDuration;
  anims.push(`    // ── Final fade-out ──`);
  anims.push(`    tl.to('.sc${lastI}-media', { opacity: 0, duration: ${FADE_DUR} }, ${lastEnd - FADE_DUR});`);
  if (scenes[lastI]?.textOverlay?.text?.trim()) {
    anims.push(`    tl.to('.sc${lastI}-text',  { opacity: 0, duration: 0.3 }, ${lastEnd - 0.8});`);
  }
  anims.push(`    tl.to('.sc${lastI}-title', { opacity: 0, duration: 0.3 }, ${lastEnd - 0.8});`);
  anims.push("");

  // Anchor timeline length exactly
  anims.push(`    tl.to({}, { duration: 0.001 }, ${totalDuration});`);
  anims.push("");
  anims.push("    window.__timelines = { composition: tl };");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=1280" />
  <title>${esc(projectName)}</title>
  <!-- Fontsource Inter for deterministic font loading (no FOUC during render) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 1280px; height: 720px; overflow: hidden; background: #000; }
    #composition { position: relative; width: 1280px; height: 720px; overflow: hidden; }
    /* HyperFrames: clips start invisible; GSAP timeline controls opacity */
    .clip { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="composition" data-composition-id="composition">

${clipsHtml}

  </div>

  <!-- GSAP from CDN (pinned version for determinism) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script>
${anims.join("\n")}
    /*
     * ─────────────────────────────────────────────────────────────
     *  HyperFrames composition — generated by Townshub AI Video Editor
     *  Project  : ${esc(projectName)}
     *  Scenes   : ${scenes.length}
     *  Duration : ${totalDuration}s
     *
     *  To preview in browser:
     *    npx hyperframes preview
     *
     *  To render to MP4 (requires Node 22+ and FFmpeg installed):
     *    npx hyperframes render --input composition.html --output "${esc(projectName.replace(/\s+/g, "-").toLowerCase())}.mp4"
     *
     *  Quality presets (add --quality flag):
     *    --quality draft    (fast, CRF 28)
     *    --quality standard (recommended, CRF 18)
     *    --quality high     (near-lossless, CRF 15)
     * ─────────────────────────────────────────────────────────────
     */
  </script>
</body>
</html>`;
}
