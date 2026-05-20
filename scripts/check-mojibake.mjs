import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const textExtensions = new Set([".html", ".js", ".css", ".json", ".md", ".txt"]);
const ignoreDirs = new Set([".git", "node_modules"]);
const suspiciousFragments = [
  "\u00C3\u00A7",
  "\u00C3\u00A3",
  "\u00C3\u00A1",
  "\u00C3\u00A2",
  "\u00C3\u00A9",
  "\u00C3\u00AA",
  "\u00C3\u00AD",
  "\u00C3\u00B3",
  "\u00C3\u00B4",
  "\u00C3\u00B5",
  "\u00C3\u00BA",
  "\u00C3\u00BC",
  "\u00C2\u00AA",
  "\u00C2\u00BA",
  "\u00E2\u20AC\u201C",
  "\u00E2\u20AC\u201D",
  "\u00E2\u20AC\u0153",
  "\u00E2\u20AC\u009D",
  "\u00E2\u20AC\u00A2",
  "O\u00E2\u201A\u201A",
  "SatO\u00E2",
  "FiO\u00E2",
  "\uFFFD",
  "\u001A",
  "porm",
  "observao",
  "dbito",
  "regio",
  "secreo",
  "responsvel",
  "avaliao",
  "realizao",
  "ocluso"
];

const offenders = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoreDirs.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!textExtensions.has(path.extname(entry.name))) continue;

    const content = fs.readFileSync(fullPath, "utf8");
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (suspiciousFragments.some((fragment) => line.includes(fragment))) {
        offenders.push(`${path.relative(root, fullPath)}:${index + 1}: ${line.trim()}`);
      }
    });
  }
}

walk(root);

if (offenders.length) {
  console.error("Possible mojibake found:\n");
  console.error(offenders.join("\n"));
  process.exit(1);
}

console.log("No mojibake patterns found.");
