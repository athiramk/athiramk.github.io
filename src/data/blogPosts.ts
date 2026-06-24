export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  content: string;
  image?: string;
};

export const categories = ["All", "Tech", "Art", "Life", "Random", "Travel"] as const;

import { markdownPosts } from './loadPosts';

export const blogPosts: BlogPost[] = [...markdownPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);