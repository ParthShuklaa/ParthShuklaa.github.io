// Prints every project's ATS resume line, newest first (US-09).
import { readFileSync } from "node:fs";
const projects = JSON.parse(readFileSync(new URL("../data/projects.json", import.meta.url), "utf8"));
projects.sort((a, b) => b.shipped.localeCompare(a.shipped)).forEach((p) => console.log("- " + p.resumeLine));
