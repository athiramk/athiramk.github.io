import { publicUrl } from "@/lib/basePath";
import type { BlogPost } from "../blogPosts";

const post: BlogPost = {
  id: "css-grid-deep-dive",
  title: "A Deep Dive into CSS Grid",
  excerpt: "Understanding grid-template-areas, auto-fill vs auto-fit, and when to use grid over flexbox.",
  category: "Tech",
  date: "February 10, 2026",
  image: publicUrl("images/blog-css.jpg"),
  content: `CSS Grid has been around for a while, but many developers still reach for flexbox by default. In this post, let's explore what Grid does best.\n\n## Grid Template Areas\n\nOne of the most powerful features is \`grid-template-areas\`, which lets you visually define your layout in CSS.\n\n## Auto-fill vs Auto-fit\n\nBoth create responsive grids, but they behave differently when there's extra space. \`auto-fill\` creates empty tracks; \`auto-fit\` collapses them.`,
};

export default post;
