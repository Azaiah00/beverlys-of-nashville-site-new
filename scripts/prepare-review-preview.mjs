import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const previewOrigin = (process.argv[2] || process.env.REVIEW_ORIGIN || "").replace(/\/$/, "");
const outputRoot = path.resolve("dist/public");
const liveOrigins = [
  "https://www.beverlysofnashville.com",
  "https://beverlysofnashville.com",
];
const editableExtensions = new Set([".html", ".json", ".txt", ".xml"]);

if (!/^https:\/\/[a-z0-9-]+(?:--[a-z0-9-]+)?\.netlify\.app$/i.test(previewOrigin)) {
  throw new Error("Pass the full Netlify review origin, for example https://partner-review--example.netlify.app");
}

async function collectEditableFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectEditableFiles(entryPath));
    } else if (editableExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(entryPath);
    }
  }

  return files;
}

const files = await collectEditableFiles(outputRoot);
let changedFiles = 0;

for (const file of files) {
  const source = await readFile(file, "utf8");
  let updated = source;

  for (const liveOrigin of liveOrigins) {
    updated = updated.replaceAll(liveOrigin, previewOrigin);
  }

  if (path.extname(file).toLowerCase() === ".html" && !/name=["']robots["']/i.test(updated)) {
    updated = updated.replace(/<head>/i, '<head>\n  <meta name="robots" content="noindex, nofollow, noarchive">');
  }

  if (updated !== source) {
    await writeFile(file, updated, "utf8");
    changedFiles += 1;
  }
}

await writeFile(
  path.join(outputRoot, "_headers"),
  "/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n",
  "utf8",
);

console.log(`Prepared ${changedFiles} review files for ${previewOrigin}`);
