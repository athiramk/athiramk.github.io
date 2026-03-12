import { publicUrl } from "@/lib/basePath";
import type { BlogPost } from "../blogPosts";

const post: BlogPost = {
  id: "sketching-daily",
  title: "30 Days of Daily Sketching",
  excerpt: "What I learned from committing to one sketch per day for a full month — the good, the bad, and the ugly.",
  category: "Art",
  date: "February 5, 2026",
  image: publicUrl("images/blog-sketching.jpg"),
  content: `I challenged myself to sketch something every day for 30 days. Here's what happened.\n\n## Week 1: Excitement\n\nThe first week was easy. I was motivated, and ideas came naturally.\n\n## Week 2-3: The Grind\n\nBy the second week, it started feeling like a chore. Some days I barely managed a doodle.\n\n## Week 4: Breakthrough\n\nSomething clicked in the final week. My lines became more confident, and I started seeing subjects differently.`,
};

export default post;
