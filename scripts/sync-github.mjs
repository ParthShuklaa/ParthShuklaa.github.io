// Fetches Parth's latest portfolio repos from the GitHub API into data/github.json.
// Shows repos listed in data/github-config.json "include", plus any non-fork repo
// tagged with one of "includeTopics". Training-batch demo repos are left out.
import { readFileSync, writeFileSync } from "node:fs";

const config = JSON.parse(readFileSync(new URL("../data/github-config.json", import.meta.url), "utf8"));
const headers = { Accept: "application/vnd.github+json", "User-Agent": "parthshuklaa-site" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const res = await fetch(`https://api.github.com/users/${config.user}/repos?sort=pushed&per_page=100`, { headers });
if (!res.ok) {
  console.error(`GitHub API returned ${res.status}; keeping the existing data/github.json`);
  process.exit(0);
}
const repos = await res.json();
const picked = repos
  .filter((r) => !r.archived && (config.include.includes(r.name) || (!r.fork && (r.topics || []).some((t) => config.includeTopics.includes(t)))))
  .slice(0, config.max)
  .map((r) => ({ name: r.name, url: r.html_url, description: r.description, pushedAt: r.pushed_at, stars: r.stargazers_count, topics: r.topics || [] }));

writeFileSync(new URL("../data/github.json", import.meta.url), JSON.stringify({ generatedAt: new Date().toISOString(), repos: picked }, null, 2) + "\n");
console.log(`Saved ${picked.length} repos to data/github.json`);
