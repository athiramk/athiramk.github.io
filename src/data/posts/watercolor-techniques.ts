import { publicUrl } from "@/lib/basePath";
import type { BlogPost } from "../blogPosts";

const post: BlogPost = {
  id: "watercolor-techniques",
  title: "Watercolor Techniques I've Been Loving",
  excerpt: "Exploring wet-on-wet, dry brush, and salt textures — a few techniques that have leveled up my paintings recently.",
  category: "Art",
  date: "February 28, 2026",
  image: publicUrl("images/blog-watercolor.jpg"),
  content: `I've been painting with watercolors for a couple of years now, and I wanted to share some techniques that have really changed how I approach a piece.\n\n## Wet-on-Wet\n\nThis technique involves applying wet paint onto a wet surface. The colors blend organically, creating soft edges and beautiful gradients.\n\n## Dry Brush\n\nUsing a dry brush on textured paper creates a scratchy, raw effect that's great for adding detail and contrast.\n\n## Salt Textures\n\nSprinkle coarse salt onto wet paint and let it dry. The salt absorbs the pigment and leaves behind a crystalline pattern.`,
};

export default post;
