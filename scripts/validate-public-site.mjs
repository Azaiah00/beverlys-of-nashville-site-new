import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";

const publicDir = resolve("client/public");
const htmlFiles = readdirSync(publicDir).filter((name) => extname(name) === ".html");
const failures = [];
const warnings = [];

const formDefinitions = new Set();
const definitionsHtml = readFileSync(join(publicDir, "__forms.html"), "utf8");
for (const match of definitionsHtml.matchAll(/<form\b[^>]*\bname=["']([^"']+)["']/gi)) {
  formDefinitions.add(match[1]);
}

for (const fileName of htmlFiles) {
  const filePath = join(publicDir, fileName);
  const html = readFileSync(filePath, "utf8");

  if (!/<title>[^<]+<\/title>/i.test(html)) failures.push(`${fileName}: missing title`);
  if (!/<html\b[^>]*\blang=["']en["']/i.test(html)) failures.push(`${fileName}: missing lang=en`);
  if (fileName !== "__forms.html" && !/<meta\b[^>]*\bname=["']viewport["']/i.test(html)) {
    failures.push(`${fileName}: missing viewport meta`);
  }

  for (const match of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)) {
    const target = match[1].split(/[?#]/)[0];
    if (!target || /^(?:https?:|mailto:|tel:|sms:|javascript:|#|\/)/i.test(target)) continue;
    if (!/\.(?:html|css|js|png|jpe?g|webp|gif|svg|mp4|webm|ico)$/i.test(target)) continue;
    const resolved = normalize(join(dirname(filePath), target));
    if (!existsSync(resolved)) failures.push(`${fileName}: missing local resource ${target}`);
  }

  for (const match of html.matchAll(/<form\b[^>]*\bname=["']([^"']+)["'][^>]*\bdata-netlify=["']true["']/gi)) {
    if (!formDefinitions.has(match[1])) failures.push(`${fileName}: Netlify form ${match[1]} is absent from __forms.html`);
  }

  if (fileName !== "__forms.html" && /data-netlify=["']true["']/i.test(html) && !/href=["']\/privacy["']|script\.js/i.test(html)) {
    warnings.push(`${fileName}: form page may not expose the privacy notice`);
  }
}

if (failures.length) {
  console.error("Public-site validation failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML files and ${formDefinitions.size} Netlify form definitions.`);
if (warnings.length) console.warn(warnings.map((item) => `Warning: ${item}`).join("\n"));
