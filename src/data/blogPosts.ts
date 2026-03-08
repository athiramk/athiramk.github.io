import { publicUrl } from "@/lib/basePath";

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  content: string;
  image?: string;
};

export const categories = ["All", "Tech", "Art", "Life", "Random"] as const;

export const blogPosts: BlogPost[] = [
  {
    id: "getting-started-with-react",
    title: "Getting Started with React in 2026",
    excerpt: "A beginner-friendly guide to building modern web apps with React, covering hooks, state management, and best practices.",
    category: "Tech",
    date: "March 5, 2026",
    image: publicUrl("images/blog-react.jpg"),
    content: `React continues to be one of the most popular frameworks for building user interfaces. In this post, we'll walk through the essentials — from setting up your first project to understanding hooks and component patterns.\n\nWhether you're brand new to frontend development or coming from another framework, this guide will help you get productive quickly.\n\n## Why React?\n\nReact's component model makes it easy to build reusable UI pieces. Combined with a rich ecosystem of tools and libraries, it's a solid choice for projects of any size.\n\n## Getting Started\n\nThe fastest way to start is with Vite. Run \`npm create vite@latest\` and select the React + TypeScript template. You'll have a working app in seconds.`,
  },
  {
    id: "watercolor-techniques",
    title: "Watercolor Techniques I've Been Loving",
    excerpt: "Exploring wet-on-wet, dry brush, and salt textures — a few techniques that have leveled up my paintings recently.",
    category: "Art",
    date: "February 28, 2026",
    image: publicUrl("images/blog-watercolor.jpg"),
    content: `I've been painting with watercolors for a couple of years now, and I wanted to share some techniques that have really changed how I approach a piece.\n\n## Wet-on-Wet\n\nThis technique involves applying wet paint onto a wet surface. The colors blend organically, creating soft edges and beautiful gradients.\n\n## Dry Brush\n\nUsing a dry brush on textured paper creates a scratchy, raw effect that's great for adding detail and contrast.\n\n## Salt Textures\n\nSprinkle coarse salt onto wet paint and let it dry. The salt absorbs the pigment and leaves behind a crystalline pattern.`,
  },
  {
    id: "morning-routines",
    title: "Why I Changed My Morning Routine",
    excerpt: "How swapping screen time for journaling and a walk transformed my productivity and mental clarity.",
    category: "Life",
    date: "February 20, 2026",
    image: publicUrl("images/blog-morning.jpg"),
    content: `For years, the first thing I did every morning was check my phone. Emails, social media, news — all before I'd even gotten out of bed.\n\nA few months ago, I decided to try something different: no screens for the first hour. Instead, I journal for 15 minutes and go for a short walk.\n\n## The Results\n\nThe change was dramatic. I feel more focused, less anxious, and my mornings feel like they belong to me rather than to my inbox.`,
  },
  {
    id: "weird-apis",
    title: "5 Weird APIs You Should Try",
    excerpt: "From random cat facts to the International Space Station tracker — fun APIs that are perfect for side projects.",
    category: "Random",
    date: "February 15, 2026",
    image: publicUrl("images/blog-apis.jpg"),
    content: `Sometimes the best way to learn is to build something fun. Here are five quirky APIs that are great for side projects:\n\n1. **Cat Facts API** — Random cat facts on demand\n2. **ISS Location API** — Track the space station in real time\n3. **Bored API** — Get activity suggestions when you're bored\n4. **Dog CEO API** — Random dog images by breed\n5. **Chuck Norris Jokes API** — Because why not\n\nEach of these is free, requires no auth, and is perfect for a weekend hack.`,
  },
  {
    id: "css-grid-deep-dive",
    title: "A Deep Dive into CSS Grid",
    excerpt: "Understanding grid-template-areas, auto-fill vs auto-fit, and when to use grid over flexbox.",
    category: "Tech",
    date: "February 10, 2026",
    image: publicUrl("images/blog-css.jpg"),
    content: `CSS Grid has been around for a while, but many developers still reach for flexbox by default. In this post, let's explore what Grid does best.\n\n## Grid Template Areas\n\nOne of the most powerful features is \`grid-template-areas\`, which lets you visually define your layout in CSS.\n\n## Auto-fill vs Auto-fit\n\nBoth create responsive grids, but they behave differently when there's extra space. \`auto-fill\` creates empty tracks; \`auto-fit\` collapses them.`,
  },
  {
    id: "sketching-daily",
    title: "30 Days of Daily Sketching",
    excerpt: "What I learned from committing to one sketch per day for a full month — the good, the bad, and the ugly.",
    category: "Art",
    date: "February 5, 2026",
    image: publicUrl("images/blog-sketching.jpg"),
    content: `I challenged myself to sketch something every day for 30 days. Here's what happened.\n\n## Week 1: Excitement\n\nThe first week was easy. I was motivated, and ideas came naturally.\n\n## Week 2-3: The Grind\n\nBy the second week, it started feeling like a chore. Some days I barely managed a doodle.\n\n## Week 4: Breakthrough\n\nSomething clicked in the final week. My lines became more confident, and I started seeing subjects differently.`,
  },
];
