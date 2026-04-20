/**
 * render-videos.mjs
 *
 * Renders all Remotion compositions to MP4 files in public/videos/.
 * Run: node scripts/render-videos.mjs
 *
 * Requires: npm install completed, Chrome/Chromium available.
 */

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

// Compositions to render
const compositions = [
  {
    id: "HeroVideo",
    outputPath: "public/videos/hero-remotion.mp4",
    codec: "h264",
    crf: 18,
  },
  {
    id: "cruise-east-africa",
    outputPath: "public/videos/cruises/east-africa.mp4",
    codec: "h264",
    crf: 23,
  },
  {
    id: "cruise-mediterranean",
    outputPath: "public/videos/cruises/mediterranean.mp4",
    codec: "h264",
    crf: 23,
  },
  {
    id: "cruise-greek-islands",
    outputPath: "public/videos/cruises/greek-islands.mp4",
    codec: "h264",
    crf: 23,
  },
  {
    id: "cruise-caribbean",
    outputPath: "public/videos/cruises/caribbean.mp4",
    codec: "h264",
    crf: 23,
  },
  {
    id: "cruise-arabian-gulf",
    outputPath: "public/videos/cruises/arabian-gulf.mp4",
    codec: "h264",
    crf: 23,
  },
  {
    id: "cruise-northern-europe",
    outputPath: "public/videos/cruises/northern-europe.mp4",
    codec: "h264",
    crf: 23,
  },
];

async function main() {
  console.log("🎬 Bundling Remotion project...");

  const bundleLocation = await bundle({
    entryPoint: path.join(rootDir, "remotion", "Root.tsx"),
    webpackOverride: (config) => config,
  });

  console.log("✅ Bundle ready:", bundleLocation);

  for (const comp of compositions) {
    const outputPath = path.join(rootDir, comp.outputPath);
    const outputDir = path.dirname(outputPath);

    // Ensure output directory exists
    fs.mkdirSync(outputDir, { recursive: true });

    console.log(`\n🎥 Rendering: ${comp.id} → ${comp.outputPath}`);

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: comp.id,
    });

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: comp.codec,
      outputLocation: outputPath,
      crf: comp.crf,
      videoBitrate: undefined,
      onProgress: ({ progress }) => {
        process.stdout.write(`  Progress: ${Math.round(progress * 100)}%\r`);
      },
    });

    console.log(`  ✅ Rendered: ${comp.outputPath}`);
  }

  console.log("\n🎉 All Remotion compositions rendered successfully!");
  console.log("   Next step: node scripts/process-media.mjs");
}

main().catch((err) => {
  console.error("❌ Render failed:", err);
  process.exit(1);
});
