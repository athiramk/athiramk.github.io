import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
}

export function useSeo({ title, description }: SeoProps) {
  useEffect(() => {
    const suffix = "Athira Kamala";
    document.title = title === "Home" ? suffix : `${title} | ${suffix}`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", document.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description);
  }, [title, description]);
}
