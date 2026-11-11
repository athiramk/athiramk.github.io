import rss from "@astrojs/rss";
import { getPosts } from "../lib/posts";
import { SITE } from "../data/site";

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site,
    items: posts.map((p) => ({ title: p.data.title, description: p.data.summary, pubDate: p.data.date, link: `/blog/${p.id}/` })),
  });
}
