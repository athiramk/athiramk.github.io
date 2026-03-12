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

// Import individual posts — to add a new post, create a file in src/data/posts/ and add it here.
import gettingStartedWithReact from "./posts/getting-started-with-react";
import watercolorTechniques from "./posts/watercolor-techniques";
import morningRoutines from "./posts/morning-routines";
import weirdApis from "./posts/weird-apis";
import cssGridDeepDive from "./posts/css-grid-deep-dive";
import sketchingDaily from "./posts/sketching-daily";

export const blogPosts: BlogPost[] = [
  gettingStartedWithReact,
  watercolorTechniques,
  morningRoutines,
  weirdApis,
  cssGridDeepDive,
  sketchingDaily,
];
