import type { APIRoute, GetStaticPaths } from "astro";
import { getPosts } from "../../lib/posts";
import { renderCard } from "../../lib/og";

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { title, summary, tags } = props.post.data;
  const png = await renderCard({ title, summary, tags });
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
