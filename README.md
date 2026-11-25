# parthshuklaa.github.io

Parth Shukla's single point of contact: latest updates from LinkedIn, GitHub and beyond, weekly AI projects, services, experience and certifications. The site is built from JSON files, so adding content never means editing HTML.

## How it works

| File | What it holds |
|---|---|
| `data/profile.json` | Headline, intro, stats, services, experience, certifications, skills, links |
| `data/projects.json` | One entry per weekly project, including its ATS resume line |
| `data/updates.json` | The updates feed (LinkedIn, GitHub, X, Instagram, certifications, sessions) |
| `data/github.json` | Generated nightly from the GitHub API (do not edit) |
| `data/github-config.json` | Which repos appear: an include list plus repos tagged `claude` or `portfolio` |

`scripts/build.mjs` turns the data into `index.html`, `feed.xml` (RSS) and `sitemap.xml`. The GitHub Action in `.github/workflows/site.yml` syncs GitHub repos, validates the data and rebuilds the site every night and on every push that changes `data/` or `scripts/`.

## Everyday tasks

Add an update (for example after a LinkedIn post):

```bash
npm run add-update -- --platform linkedin --url "https://www.linkedin.com/posts/..." --title "Post title" --summary "One-line summary"
```

Or just paste the link and a one-line summary to Claude and ask it to add the update.

Add a project: append an entry to `data/projects.json`, then `npm run build`.

Print all ATS resume lines: `npm run resume-lines`.

Build locally: `npm run build`, then open `index.html`.
