import { publicUrl } from "@/lib/basePath";
import type { BlogPost } from "../blogPosts";

const post: BlogPost = {
  id: "getting-started-with-react",
  title: "Getting Started with React in 2026",
  excerpt: "A beginner-friendly guide to building modern web apps with React, covering hooks, state management, and best practices.",
  category: "Tech",
  date: "March 5, 2026",
  image: publicUrl("images/blog-react.jpg"),
  content: `React continues to be one of the most popular frameworks for building user interfaces. In this post, we'll walk through the essentials — from setting up your first project to understanding hooks and component patterns.\n\nWhether you're brand new to frontend development or coming from another framework, this guide will help you get productive quickly.\n\n## Why React?\n\nReact's component model makes it easy to build reusable UI pieces. Combined with a rich ecosystem of tools and libraries, it's a solid choice for projects of any size.\n\n## Getting Started\n\nThe fastest way to start is with Vite. Run \`npm create vite@latest\` and select the React + TypeScript template. You'll have a working app in seconds.`,
};

export default post;
