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

import { markdownPosts } from './loadPosts';

export const blogPosts: BlogPost[] = [
  ...markdownPosts
];