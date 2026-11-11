// Usage: npm run new-post "My Post Title"
import { writeFileSync, existsSync } from "node:fs";

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error('Usage: npm run new-post "My Post Title"');
  process.exit(1);
}
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");
const file = `src/content/blog/${slug}.md`;
if (existsSync(file)) {
  console.error(`${file} already exists`);
  process.exit(1);
}
const date = new Date().toISOString().slice(0, 10);
writeFileSync(
  file,
  `---
title: "${title.replace(/"/g, '\\"')}"
summary: ""
date: ${date}
tags: []
draft: true
# updated: ${date}   # uncomment and change when you revise a published post
---

Write your post here.
`
);
console.log(`Created ${file} (draft: true — set to false or delete the line to publish)`);
