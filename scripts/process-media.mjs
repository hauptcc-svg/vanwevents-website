/**
 * process-media.mjs
 *
 * Uses ffmpeg to:
 * 1. Convert existing WhatsApp video assets → web-optimised MP4s in public/videos/
 * 2. Re-encode Remotion-rendered videos with web-optimised settings (faststart, CRF)
 * 3. Extract poster frames (JPEG) from each video for <video poster="...">
 *
 * Run: node scripts/process-media.mjs
 */

import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Point fluent-ffmpeg to the bundled ffmpeg binary
ffmpeg.setFfmpegPath(ffmpegStatic);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

// ─── Helpers ────────────────────────────────────────────────────────────────

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * Compress & web-optimise a video file.
 * Outputs H.264, CRF-controlled quality, faststart flag for streaming.
 */
function processVideo(inputPath, outputPath, options = {}) {
  return new Promise((resolve, reject) => {
    const {
      crf = 23,
      scaleWidth = null, // null = keep original
      scaleHeight = null,
    } = options;

    if (!fs.existsSync(inputPath)) {
      console.warn(`  ⚠️  Input not found, skipping: ${inputPath}`);
      return resolve(null);
    }

    ensureDir(path.dirname(outputPath));

    let cmd = ffmpeg(inputPath)
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions([
        `-crf ${crf}`,
        "-preset fast",
        "-movflags +faststart", // enables progressive streaming
        "-pix_fmt yuv420p",     // broad browser compatibility
        "-profile:v baseline",
        "-level 3.0",
      ]);

    if (scaleWidth || scaleHeight) {
      const w = scaleWidth ?? -2;
      const h = scaleHeight ?? -2;
      cmd = cmd.videoFilters(`scale=${w}:${h}`);
    }

    cmd
      .output(outputPath)
      .on("start", (commandLine) => {
        console.log(`  Running: ffmpeg ...`);
      })
      .on("progress", ({ percent }) => {
        if (percent) {
          process.stdout.write(`  Progress: ${Math.round(percent)}%\r`);
        }
      })
      .on("end", () => {
        console.log(`  ✅ Done: ${path.basename(outputPath)}`);
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error(`  ❌ Error processing ${inputPath}:`, err.message);
        reject(err);
      })
      .run();
  });
}

/**
 * Extract a single JPEG poster frame from a video at the given timestamp.
 */
function extractPoster(inputPath, outputPath, timestamp = "00:00:01") {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(inputPath)) {
      console.warn(`  ⚠️  Source not found for poster: ${inputPath}`);
      return resolve(null);
    }

    ensureDir(path.dirname(outputPath));

    ffmpeg(inputPath)
      .screenshots({
        timestamps: [timestamp],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: "1280x720",
      })
      .on("end", () => {
        console.log(`  🖼️  Poster: ${path.basename(outputPath)}`);
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error(`  ❌ Poster error:`, err.message);
        reject(err);
      });
  });
}

// ─── Media processing tasks ──────────────────────────────────────────────────

async function main() {
  console.log("🎞️  VanWEvents Media Processor\n");

  // ── Task 1: Convert WhatsApp videos ────────────────────────────────────────
  console.log("── Step 1: Converting existing video assets ──");

  const whatsappVideos = [
    {
      input: path.join(rootDir, "WhatsApp Video 2026-04-08 at 3.33.28 PM.mp4"),
      output: path.join(rootDir, "public/videos/hero.mp4"),
      poster: path.join(rootDir, "public/videos/hero-poster.jpg"),
      label: "Hero video (WhatsApp #1)",
      crf: 20,
    },
    {
      input: path.join(rootDir, "WhatsApp Video 2026-04-08 at 3.38.10 PM.mp4"),
      output: path.join(rootDir, "public/videos/cruise-promo.mp4"),
      poster: path.join(rootDir, "public/videos/cruise-promo-poster.jpg"),
      label: "Cruise promo video (WhatsApp #2)",
      crf: 22,
    },
  ];

  for (const v of whatsappVideos) {
    console.log(`\n📹 ${v.label}`);
    await processVideo(v.input, v.output, { crf: v.crf });
    await extractPoster(v.output, v.poster);
  }

  // ── Task 2: Re-encode Remotion hero video (if rendered) ────────────────────
  console.log("\n── Step 2: Re-encoding Remotion hero video ──");

  const remotionHero = path.join(rootDir, "public/videos/hero-remotion.mp4");
  const remotionHeroOut = path.join(rootDir, "public/videos/hero-remotion-web.mp4");

  if (fs.existsSync(remotionHero)) {
    console.log(`\n🎬 Re-encoding Remotion hero...`);
    await processVideo(remotionHero, remotionHeroOut, { crf: 22 });
    await extractPoster(remotionHeroOut, path.join(rootDir, "public/videos/hero-remotion-poster.jpg"));
  } else {
    console.log("  ℹ️  Remotion hero not found — run render:videos first if needed.");
  }

  // ── Task 3: Re-encode cruise card videos (if rendered) ────────────────────
  console.log("\n── Step 3: Re-encoding cruise card videos ──");

  const cruiseSlugs = [
    "east-africa",
    "mediterranean",
    "greek-islands",
    "caribbean",
    "arabian-gulf",
    "northern-europe",
  ];

  for (const slug of cruiseSlugs) {
    const inputPath = path.join(rootDir, `public/videos/cruises/${slug}.mp4`);
    const outputPath = path.join(rootDir, `public/videos/cruises/${slug}-web.mp4`);
    const posterPath = path.join(rootDir, `public/videos/cruises/${slug}-poster.jpg`);

    if (fs.existsSync(inputPath)) {
      console.log(`\n🎥 Cruise card: ${slug}`);
      await processVideo(inputPath, outputPath, { crf: 23 });
      await extractPoster(outputPath, posterPath, "00:00:02");

      // Rename web version to final
      fs.renameSync(outputPath, inputPath);
      console.log(`  🔄 Replaced original with optimised version`);

      if (fs.existsSync(posterPath)) {
        const finalPoster = path.join(rootDir, `public/videos/cruises/${slug}-poster.jpg`);
        // Already in right place
        console.log(`  🖼️  Poster ready: ${slug}-poster.jpg`);
      }
    } else {
      console.log(`  ℹ️  Cruise card ${slug} not rendered yet — run render:videos first.`);
    }
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log("\n🎉 Media processing complete!\n");
  console.log("Output summary:");
  console.log("  public/videos/hero.mp4          ← Hero video (from WhatsApp)");
  console.log("  public/videos/hero-poster.jpg   ← Hero poster frame");
  console.log("  public/videos/cruise-promo.mp4  ← Promo reel (from WhatsApp)");
  console.log("  public/videos/cruises/*.mp4     ← Cruise card videos");
  console.log("  public/videos/cruises/*-poster.jpg ← Cruise card posters");
  console.log("\nReady to run: npm run dev");
}

main().catch((err) => {
  console.error("❌ Media processing failed:", err);
  process.exit(1);
});
