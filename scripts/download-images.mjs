/**
 * download-images.mjs
 *
 * Downloads one high-quality landscape photo per cruise destination from Unsplash.
 * Uses the Unsplash API (free tier).
 *
 * Run: node scripts/download-images.mjs
 */

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images", "msc");

const ACCESS_KEY = "P5wcuug2Fx-R3v8K9PlKCzxZeKS3Lrww9-bit0zhpEg";

// One targeted search query per destination
const destinations = [
  {
    slug: "east-africa",
    query: "mozambique tropical beach ocean",
    fallbackQuery: "east africa beach sunset",
  },
  {
    slug: "mediterranean",
    query: "amalfi coast italy mediterranean sea",
    fallbackQuery: "mediterranean sea blue water",
  },
  {
    slug: "greek-islands",
    query: "santorini greece whitewashed blue dome",
    fallbackQuery: "greek islands sea",
  },
  {
    slug: "caribbean",
    query: "caribbean turquoise beach tropical paradise",
    fallbackQuery: "tropical island beach water",
  },
  {
    slug: "arabian-gulf",
    query: "dubai skyline luxury waterfront",
    fallbackQuery: "arabian gulf sunset",
  },
  {
    slug: "northern-europe",
    query: "norwegian fjords dramatic landscape",
    fallbackQuery: "norway fjords water mountains",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Follow redirect
        return httpsGet(res.headers.location, headers).then(resolve).catch(reject);
      }
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on("error", reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error("Request timeout")); });
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const doDownload = (targetUrl) => {
      https.get(targetUrl, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          return doDownload(res.headers.location);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${targetUrl}`));
        }
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on("finish", () => { file.close(); resolve(destPath); });
        file.on("error", (err) => { fs.unlink(destPath, () => {}); reject(err); });
      }).on("error", reject);
    };
    doDownload(url);
  });
}

async function searchUnsplash(query) {
  const encoded = encodeURIComponent(query);
  const url = `https://api.unsplash.com/search/photos?query=${encoded}&orientation=landscape&per_page=3&order_by=relevant`;
  const { statusCode, body } = await httpsGet(url, {
    Authorization: `Client-ID ${ACCESS_KEY}`,
    "Accept-Version": "v1",
  });

  if (statusCode !== 200) {
    throw new Error(`Unsplash API returned ${statusCode}: ${body}`);
  }

  const data = JSON.parse(body);
  if (!data.results || data.results.length === 0) return null;

  // Pick result with highest resolution
  const best = data.results[0];
  return {
    url: best.urls.full,          // Full quality
    regularUrl: best.urls.regular, // ~1080px (faster)
    id: best.id,
    description: best.description ?? best.alt_description ?? query,
    credit: best.user.name,
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🖼️  VanWEvents — Unsplash Image Downloader\n");
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let successCount = 0;

  for (const dest of destinations) {
    const outputPath = path.join(OUT_DIR, `${dest.slug}.jpg`);

    // Skip if already downloaded
    if (fs.existsSync(outputPath)) {
      console.log(`✅ Already exists: ${dest.slug}.jpg — skipping`);
      successCount++;
      continue;
    }

    console.log(`🔍 Searching: "${dest.query}"`);

    let photo = null;
    try {
      photo = await searchUnsplash(dest.query);
      if (!photo) {
        console.log(`  ⚠️  No results, trying fallback: "${dest.fallbackQuery}"`);
        photo = await searchUnsplash(dest.fallbackQuery);
      }
    } catch (err) {
      console.error(`  ❌ Search failed for ${dest.slug}:`, err.message);
      continue;
    }

    if (!photo) {
      console.error(`  ❌ No results found for ${dest.slug}`);
      continue;
    }

    console.log(`  📸 Found: "${photo.description}" by ${photo.credit}`);
    console.log(`  ⬇️  Downloading regular (1080px) version...`);

    try {
      await downloadFile(photo.regularUrl, outputPath);
      const stats = fs.statSync(outputPath);
      console.log(`  ✅ Saved: ${dest.slug}.jpg (${Math.round(stats.size / 1024)}KB)\n`);
      successCount++;
    } catch (err) {
      console.error(`  ❌ Download failed:`, err.message);
      // Clean up partial file
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }

    // Respect Unsplash rate limits (50 req/hour on free tier)
    await new Promise((r) => setTimeout(r, 1200));
  }

  console.log(`\n🎉 Done! Downloaded ${successCount}/${destinations.length} images`);
  console.log(`   Output: public/images/msc/\n`);

  if (successCount < destinations.length) {
    console.log("⚠️  Some images failed. Re-run the script to retry missing ones.");
  } else {
    console.log("✅ All cruise images ready. Run: npm run process:media");
  }
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
