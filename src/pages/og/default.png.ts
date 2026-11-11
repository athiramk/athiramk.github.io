import type { APIRoute } from "astro";
import { renderCard } from "../../lib/og";
import { SITE } from "../../data/site";

export const GET: APIRoute = async () => {
  const png = await renderCard({
    title: "Notes on building reliable software",
    summary: "Java, Spring Boot and backend engineering — by " + SITE.name,
    tags: [],
  });
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
