// Validates the data files so a bad edit never breaks the live site.
import { readFileSync } from "node:fs";
const read = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), "utf8"));
const errors = [];
const isDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d));
const isUrl = (u) => /^https?:\/\//.test(u);

const p = read("profile.json");
for (const k of ["name", "headline", "intro", "email", "siteUrl"]) if (!p[k]) errors.push(`profile.json: missing ${k}`);
read("updates.json").forEach((u, i) => {
  if (!isDate(u.date)) errors.push(`updates.json[${i}]: bad date`);
  if (!isUrl(u.url)) errors.push(`updates.json[${i}]: bad url`);
  if (!u.title || !u.summary) errors.push(`updates.json[${i}]: missing title or summary`);
});
read("projects.json").forEach((pr, i) => {
  if (!isDate(pr.shipped)) errors.push(`projects.json[${i}]: bad shipped date`);
  if (!isUrl(pr.repo)) errors.push(`projects.json[${i}]: bad repo url`);
  for (const k of ["title", "problem", "summary", "resumeLine"]) if (!pr[k]) errors.push(`projects.json[${i}]: missing ${k}`);
});
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("Data files OK");
