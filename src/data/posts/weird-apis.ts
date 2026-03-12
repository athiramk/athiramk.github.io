import { publicUrl } from "@/lib/basePath";
import type { BlogPost } from "../blogPosts";

const post: BlogPost = {
  id: "weird-apis",
  title: "5 Weird APIs You Should Try",
  excerpt: "From random cat facts to the International Space Station tracker — fun APIs that are perfect for side projects.",
  category: "Random",
  date: "February 15, 2026",
  image: publicUrl("images/blog-apis.jpg"),
  content: `Sometimes the best way to learn is to build something fun. Here are five quirky APIs that are great for side projects:\n\n1. **Cat Facts API** — Random cat facts on demand\n2. **ISS Location API** — Track the space station in real time\n3. **Bored API** — Get activity suggestions when you're bored\n4. **Dog CEO API** — Random dog images by breed\n5. **Chuck Norris Jokes API** — Because why not\n\nEach of these is free, requires no auth, and is perfect for a weekend hack.`,
};

export default post;
