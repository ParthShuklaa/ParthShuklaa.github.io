// Adds one update to data/updates.json, then rebuilds the site.
// Usage (all on one line):
//   node scripts/add-update.mjs --platform linkedin --url "https://www.linkedin.com/posts/..." \
//     --title "AB-731: the lesson behind the badge" --summary "Why AI adoption is a people project."
// Optional: --date 2026-11-26 (defaults to today). Platforms: linkedin, github, x, instagram, certification, blog, talk
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, v, i, all) => (v.startsWith("--") ? [...acc, [v.slice(2), all[i + 1]]] : acc), [])
);
const allowed = ["linkedin", "github", "x", "instagram", "certification", "blog", "talk"];
for (const key of ["platform", "url", "title", "summary"]) {
  if (!args[key]) { console.error(`Missing --${key}`); process.exit(1); }
}
if (!allowed.includes(args.platform)) { console.error(`--platform must be one of: ${allowed.join(", ")}`); process.exit(1); }
if (!/^https?:\/\//.test(args.url)) { console.error("--url must start with http(s)://"); process.exit(1); }
const date = args.date || new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { console.error("--date must be YYYY-MM-DD"); process.exit(1); }

const file = new URL("../data/updates.json", import.meta.url);
const updates = JSON.parse(readFileSync(file, "utf8"));
if (updates.some((u) => u.url === args.url)) { console.log("This URL is already in updates.json; nothing added."); process.exit(0); }
updates.unshift({ date, platform: args.platform, title: args.title, summary: args.summary, url: args.url });
writeFileSync(file, JSON.stringify(updates, null, 2) + "\n");
console.log(`Added: ${args.title}`);
execFileSync(process.execPath, [new URL("./build.mjs", import.meta.url).pathname], { stdio: "inherit" });
