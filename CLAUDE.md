# CLAUDE.md

Parth Shukla's personal site and single point of contact, served by GitHub Pages from `main`.

- Content lives in `data/*.json`; never hand-edit `index.html`, `feed.xml` or `sitemap.xml` (they are generated).
- After any data change run `npm run build` (validates data, then builds) and commit the generated files with the data.
- To add an update: `npm run add-update -- --platform <linkedin|github|x|instagram|certification|blog|talk> --url <url> --title <title> --summary <one line>`.
- Keep wording plain and specific; no hype. Client names stay out of public updates unless Parth says otherwise.
- No build tooling beyond Node 22 built-ins; no npm dependencies.
