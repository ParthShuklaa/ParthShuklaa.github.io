// Builds index.html, feed.xml and sitemap.xml from the JSON files in data/.
// Edit content in data/*.json, then run: node scripts/build.mjs
// (The GitHub Action in .github/workflows/site.yml runs this automatically.)

import { readFileSync, writeFileSync } from "node:fs";

const read = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), "utf8"));
const profile = read("profile.json");
const projects = read("projects.json").sort((a, b) => b.shipped.localeCompare(a.shipped));
const updates = read("updates.json").sort((a, b) => b.date.localeCompare(a.date));
const github = read("github.json");

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmtDate = (iso) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

const PLATFORM = {
  linkedin: { label: "LinkedIn", cls: "p-linkedin" },
  github: { label: "GitHub", cls: "p-github" },
  x: { label: "X", cls: "p-x" },
  instagram: { label: "Instagram", cls: "p-instagram" },
  certification: { label: "Certification", cls: "p-cert" },
  blog: { label: "Article", cls: "p-blog" },
  talk: { label: "Session", cls: "p-talk" },
};

const updateCard = (u) => {
  const p = PLATFORM[u.platform] || { label: u.platform, cls: "p-blog" };
  return `<article class="update">
      <div class="update-meta"><span class="pill ${p.cls}">${esc(p.label)}</span><time datetime="${esc(u.date)}">${fmtDate(u.date)}</time></div>
      <h3><a href="${esc(u.url)}" target="_blank" rel="noopener">${esc(u.title)}</a></h3>
      <p>${esc(u.summary)}</p>
    </article>`;
};

const projectCard = (p, i) => `<article class="project">
      <div class="project-top"><span class="project-no">P${String(projects.length - i).padStart(2, "0")}</span><time datetime="${esc(p.shipped)}">Shipped ${fmtDate(p.shipped)}</time></div>
      <h3>${esc(p.title)}</h3>
      <p class="problem">${esc(p.problem)}</p>
      <p>${esc(p.summary)}</p>
      <div class="tags">${p.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
      <div class="project-links">
        <a href="${esc(p.repo)}" target="_blank" rel="noopener">Code on GitHub ↗</a>
        ${p.demo ? `<a href="${esc(p.demo)}" target="_blank" rel="noopener">Live demo ↗</a>` : ""}
      </div>
    </article>`;

const ghRepos = (github.repos || [])
  .map((r) => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.name)}</a><span>${esc(r.description || "")}</span><time datetime="${esc(r.pushedAt)}">updated ${fmtDate(r.pushedAt.slice(0, 10))}</time></li>`)
  .join("");

const latest = updates.slice(0, 6).map(updateCard).join("");
const older = updates.slice(6).map(updateCard).join("");

const socials = Object.entries(profile.links)
  .filter(([, url]) => url)
  .map(([k, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc({ linkedin: "LinkedIn", github: "GitHub", x: "X", instagram: "Instagram" }[k] || k)} ↗</a>`)
  .join("");

const title = `${profile.name} | ${profile.headline}`;
const description = `${profile.name}: ${profile.headline}. ${profile.subhead}. ${profile.stats[0].value} ${profile.stats[0].label.toLowerCase()}.`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${esc(profile.siteUrl)}/" />
<link rel="alternate" type="application/rss+xml" title="${esc(profile.name)} – updates" href="${esc(profile.siteUrl)}/feed.xml" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${esc(profile.siteUrl)}/" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
<style>
  :root { --ink:#0D1117; --ink-2:#161D2B; --ink-3:#222C3F; --gold:#C8A96E; --gold-light:#E8CFA0; --gold-pale:rgba(200,169,110,.12); --text:#E8EDF5; --dim:#97A3BA; --border:rgba(255,255,255,.08); --azure:#3D9BE9; --green:#3ECFA8; }
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:var(--ink);color:var(--text);font:16px/1.6 'DM Sans',system-ui,sans-serif}
  a{color:var(--gold-light)}
  .wrap{max-width:1080px;margin:0 auto;padding:0 24px}
  nav{position:sticky;top:0;z-index:10;background:rgba(13,17,23,.88);backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
  nav .wrap{display:flex;align-items:center;justify-content:space-between;height:64px;gap:16px}
  .logo{font-family:'Instrument Serif',serif;font-size:1.3rem;color:var(--gold-light);text-decoration:none}
  .nav-links{display:flex;gap:22px;list-style:none}
  .nav-links a{color:var(--dim);text-decoration:none;font-size:.82rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase}
  .nav-links a:hover{color:var(--gold-light)}
  .btn{display:inline-block;padding:11px 20px;border-radius:8px;font-weight:700;font-size:.92rem;text-decoration:none;border:1px solid var(--gold)}
  .btn-gold{background:var(--gold);color:var(--ink)}
  .btn-ghost{color:var(--gold-light)}
  .btn:hover{transform:translateY(-1px)}
  header.hero{padding:72px 0 40px}
  .badge{display:inline-flex;gap:8px;align-items:center;background:var(--gold-pale);border:1px solid rgba(200,169,110,.35);color:var(--gold-light);padding:6px 14px;border-radius:999px;font-size:.82rem;font-weight:500}
  h1{font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(2.6rem,6vw,4.4rem);line-height:1.05;margin:20px 0 10px}
  h1 em{color:var(--gold-light)}
  .subhead{color:var(--gold-light);font-weight:500;margin-bottom:18px}
  .intro{color:var(--dim);font-size:1.1rem;max-width:720px;margin-bottom:28px}
  .cta{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:40px}
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
  .stat{background:var(--ink-2);border:1px solid var(--border);border-radius:12px;padding:16px}
  .stat b{display:block;font-family:'Instrument Serif',serif;font-size:2rem;font-weight:400;color:var(--gold-light)}
  .stat span{color:var(--dim);font-size:.85rem}
  section{padding:56px 0;border-top:1px solid var(--border);scroll-margin-top:64px}
  .eyebrow{color:var(--gold);text-transform:uppercase;letter-spacing:.12em;font-size:.75rem;font-weight:700}
  h2{font-family:'Instrument Serif',serif;font-weight:400;font-size:2.2rem;margin:6px 0 8px}
  .lead{color:var(--dim);max-width:680px;margin-bottom:28px}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}
  .grid-2{grid-template-columns:repeat(2,1fr)}
  .update,.project,.service,.cert{background:var(--ink-2);border:1px solid var(--border);border-radius:12px;padding:20px}
  .update h3,.project h3,.service h3{font-size:1.08rem;margin:8px 0 6px}
  .update h3 a{color:var(--text);text-decoration:none}
  .update h3 a:hover{color:var(--gold-light)}
  .update p,.project p,.service p{color:var(--dim);font-size:.95rem}
  .update-meta,.project-top{display:flex;justify-content:space-between;align-items:center;font-size:.8rem;color:var(--dim)}
  .pill{padding:3px 10px;border-radius:999px;font-size:.72rem;font-weight:700;letter-spacing:.04em}
  .p-linkedin{background:#0A66C2;color:#fff}.p-github{background:#2b3137;color:#fff;border:1px solid #444}.p-x{background:#000;color:#fff;border:1px solid #444}
  .p-instagram{background:#C13584;color:#fff}.p-cert{background:var(--gold);color:var(--ink)}.p-blog,.p-talk{background:var(--ink-3);color:var(--text)}
  details{margin-top:16px}summary{cursor:pointer;color:var(--gold-light);font-weight:500}
  details .grid{margin-top:16px}
  .project-no{font-family:'Instrument Serif',serif;font-size:1.4rem;color:var(--gold)}
  .problem{color:var(--text)!important;font-style:italic;margin-bottom:6px}
  .tags{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0}
  .tags span{background:var(--ink-3);color:var(--text);font-size:.75rem;padding:3px 10px;border-radius:6px}
  .project-links{display:flex;gap:16px;font-weight:500;font-size:.92rem}
  .gh-list{list-style:none;margin-top:24px;border:1px solid var(--border);border-radius:12px;overflow:hidden}
  .gh-list li{display:grid;grid-template-columns:240px 1fr auto;gap:12px;padding:12px 16px;border-top:1px solid var(--border);font-size:.9rem}
  .gh-list li:first-child{border-top:none}.gh-list span,.gh-list time{color:var(--dim)}
  .timeline{display:grid;gap:14px}
  .tl{display:grid;grid-template-columns:200px 1fr;gap:20px;padding:18px 0;border-top:1px solid var(--border)}
  .tl:first-child{border-top:none}
  .tl .period{color:var(--gold);font-size:.88rem;font-weight:500}
  .tl h3{font-size:1.05rem}.tl .org{color:var(--dim);font-size:.9rem;margin-bottom:6px}
  .tl ul{padding-left:18px;color:var(--dim);font-size:.94rem}
  .cert{display:flex;flex-direction:column;gap:4px}
  .cert .issuer{color:var(--gold);font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
  .cert b{font-weight:500}.cert small{color:var(--dim)}
  .skills{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px}
  .skills h3{font-size:.95rem;color:var(--gold-light);margin-bottom:8px}
  form{display:grid;gap:12px;max-width:620px}
  label{display:grid;gap:6px;font-size:.88rem;color:var(--dim)}
  input,select,textarea{font:inherit;color:var(--text);background:var(--ink-2);border:1px solid var(--border);border-radius:8px;padding:10px 12px}
  textarea{min-height:120px}
  .contact{display:grid;grid-template-columns:1fr 1fr;gap:32px}
  .contact-list{display:grid;gap:10px;align-content:start}
  .contact-list a{color:var(--text);text-decoration:none;background:var(--ink-2);border:1px solid var(--border);border-radius:10px;padding:12px 16px}
  footer{border-top:1px solid var(--border);padding:28px 0;color:var(--dim);font-size:.85rem}
  footer .wrap{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
  @media (max-width:760px){.grid-2{grid-template-columns:1fr}nav .btn{display:none}.logo{display:none}nav .wrap{justify-content:flex-start}.nav-links{gap:14px;overflow-x:auto;white-space:nowrap}.nav-links a{font-size:.72rem;letter-spacing:.03em}.stats{grid-template-columns:repeat(2,1fr)}.tl,.contact{grid-template-columns:1fr}.gh-list li{grid-template-columns:1fr}header.hero{padding-top:40px}}
</style>
</head>
<body>
<nav><div class="wrap">
  <a class="logo" href="#top">${esc(profile.name)}</a>
  <ul class="nav-links">
    <li><a href="#updates">Updates</a></li><li><a href="#projects">Projects</a></li><li><a href="#services">Services</a></li>
    <li><a href="#about">About</a></li><li><a href="#contact">Contact</a></li>
  </ul>
  <a class="btn btn-gold" href="${esc(profile.bookingUrl)}">Book a call</a>
</div></nav>

<header class="hero" id="top"><div class="wrap">
  <span class="badge">✦ ${esc(profile.badge)}</span>
  <h1>${esc(profile.name)}<br /><em>${esc(profile.headline)}</em></h1>
  <p class="subhead">${esc(profile.subhead)}</p>
  <p class="intro">${esc(profile.intro)}</p>
  <div class="cta">
    <a class="btn btn-gold" href="${esc(profile.bookingUrl)}">Book a call</a>
    <a class="btn btn-ghost" href="#projects">View projects</a>
    <a class="btn btn-ghost" href="${esc(profile.readinessCheckUrl)}" target="_blank" rel="noopener">AI readiness check ↗</a>
  </div>
  <div class="stats">${profile.stats.map((s) => `<div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("")}</div>
</div></header>

<section id="updates"><div class="wrap">
  <p class="eyebrow">Latest</p>
  <h2>Updates from everywhere</h2>
  <p class="lead">Posts, projects, certifications and sessions from LinkedIn, GitHub and beyond, in one place. <a href="feed.xml">Subscribe via RSS</a>.</p>
  <div class="grid">${latest}</div>
  ${older ? `<details><summary>See all ${updates.length} updates</summary><div class="grid">${older}</div></details>` : ""}
</div></section>

<section id="projects"><div class="wrap">
  <p class="eyebrow">Built in public</p>
  <h2>One AI project a week</h2>
  <p class="lead">Each project is a real business use case built with Claude, Copilot or Azure AI, open source on GitHub.</p>
  <div class="grid">${projects.map(projectCard).join("")}</div>
  ${ghRepos ? `<ul class="gh-list">${ghRepos}</ul>` : ""}
</div></section>

<section id="services"><div class="wrap">
  <p class="eyebrow">Work with me</p>
  <h2>How I help teams adopt AI</h2>
  <p class="lead">${esc(profile.availability)}.</p>
  <div class="grid grid-2">${profile.services.map((s) => `<article class="service"><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p><div class="tags">${s.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div></article>`).join("")}</div>
</div></section>

<section id="about"><div class="wrap">
  <p class="eyebrow">Experience</p>
  <h2>13+ years where technology meets people</h2>
  <div class="timeline">${profile.experience.map((e) => `<div class="tl"><div class="period">${esc(e.period)}</div><div><h3>${esc(e.role)}</h3><p class="org">${esc(e.org)}</p><ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div></div>`).join("")}</div>
</div></section>

<section id="certifications"><div class="wrap">
  <p class="eyebrow">Credentials</p>
  <h2>Certifications</h2>
  <div class="grid">${profile.certifications.map((c) => `<div class="cert"><span class="issuer">${esc(c.issuer)}${c.year ? ` · ${esc(c.year)}` : ""}</span><b>${esc(c.name)}</b>${c.note ? `<small>${esc(c.note)}</small>` : ""}${c.verifyUrl ? `<a href="${esc(c.verifyUrl)}" target="_blank" rel="noopener">Verify ↗</a>` : ""}</div>`).join("")}</div>
  <div class="skills" style="margin-top:32px">${Object.entries(profile.skills).map(([k, v]) => `<div><h3>${esc(k)}</h3><div class="tags">${v.map((s) => `<span>${esc(s)}</span>`).join("")}</div></div>`).join("")}</div>
</div></section>

<section id="contact"><div class="wrap">
  <p class="eyebrow">Contact</p>
  <h2>Let's talk about your AI rollout</h2>
  <div class="contact">
    <form id="contact-form">
      <label>Your name<input name="name" required /></label>
      <label>Company / organisation<input name="company" /></label>
      <label>I'm interested in<select name="topic">
        <option>AI adoption consulting</option><option>Copilot / Claude workshop</option><option>AI skilling programme</option>
        <option>Certification cohort</option><option>Full-time role</option><option>Something else</option></select></label>
      <label>Message<textarea name="message" required></textarea></label>
      <button class="btn btn-gold" type="submit">Send via email</button>
      <small style="color:var(--dim)">Opens your email app with the message ready to send.</small>
    </form>
    <div class="contact-list">
      <a href="mailto:${esc(profile.email)}">✉️ ${esc(profile.email)}</a>
      ${socials}
      <span style="color:var(--dim)">📍 ${esc(profile.location)}</span>
    </div>
  </div>
</div></section>

<footer><div class="wrap">
  <span>© ${new Date().getFullYear()} ${esc(profile.name)} · ${esc(profile.headline)}</span>
  <span>Built from JSON with a little help from Claude · last updated ${fmtDate(new Date().toISOString().slice(0, 10))}</span>
</div></footer>

<script>
  document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = new FormData(e.target);
    var subject = 'Website enquiry: ' + f.get('topic') + (f.get('company') ? ' (' + f.get('company') + ')' : '');
    var body = f.get('message') + '\\n\\n' + f.get('name') + (f.get('company') ? '\\n' + f.get('company') : '');
    window.location.href = 'mailto:${esc(profile.email)}?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
</script>
</body>
</html>
`;

const rssItems = updates
  .slice(0, 20)
  .map((u) => `  <item>
    <title>${esc(u.title)}</title>
    <link>${esc(u.url)}</link>
    <guid isPermaLink="false">${esc(u.date + "-" + u.url)}</guid>
    <pubDate>${new Date(u.date + "T09:00:00+05:30").toUTCString()}</pubDate>
    <category>${esc((PLATFORM[u.platform] || { label: u.platform }).label)}</category>
    <description>${esc(u.summary)}</description>
  </item>`)
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(profile.name)} – updates</title>
  <link>${esc(profile.siteUrl)}/</link>
  <atom:link href="${esc(profile.siteUrl)}/feed.xml" rel="self" type="application/rss+xml" />
  <description>${esc(profile.headline)}: projects, posts, certifications and sessions.</description>
  <language>en</language>
${rssItems}
</channel>
</rss>
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${esc(profile.siteUrl)}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>
</urlset>
`;

writeFileSync(new URL("../index.html", import.meta.url), html);
writeFileSync(new URL("../feed.xml", import.meta.url), rss);
writeFileSync(new URL("../sitemap.xml", import.meta.url), sitemap);
console.log(`Built index.html (${updates.length} updates, ${projects.length} projects, ${(github.repos || []).length} repos), feed.xml, sitemap.xml`);
