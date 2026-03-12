import { publicUrl } from "@/lib/basePath";
import type { BlogPost } from "../blogPosts";

const post: BlogPost = {
  id: "morning-routines",
  title: "Why I Changed My Morning Routine",
  excerpt: "How swapping screen time for journaling and a walk transformed my productivity and mental clarity.",
  category: "Life",
  date: "February 20, 2026",
  image: publicUrl("images/blog-morning.jpg"),
  content: `For years, the first thing I did every morning was check my phone. Emails, social media, news — all before I'd even gotten out of bed.\n\nA few months ago, I decided to try something different: no screens for the first hour. Instead, I journal for 15 minutes and go for a short walk.\n\n## The Results\n\nThe change was dramatic. I feel more focused, less anxious, and my mornings feel like they belong to me rather than to my inbox.`,
};

export default post;
