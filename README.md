# athiramk.com

Personal site and blog built with [Astro](https://astro.build), deployed to GitHub Pages.

## Writing a post

```sh
npm run new-post "My Post Title"
```

This creates `src/content/blog/my-post-title.md` as a draft. Fill in `summary` and `tags`, write the post in
markdown, then remove `draft: true` (or set it to `false`) to publish. Commit and push to `main` — GitHub Actions
builds and deploys the site.

Frontmatter fields: `title`, `summary`, `date` (YYYY-MM-DD), `tags` (list), optional `cover` (path to an image under
`src/assets/blog/`, e.g. `../../assets/blog/pic.jpg`) with `coverAlt`, and `draft`. A typo or missing field fails the
build with a clear message. Drafts show up in `npm run dev` but never in production.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs ./dist (also builds the search index)
npm run preview
```

## Where things live

- `src/content/blog/` – posts
- `src/data/` – projects, hobbies, bookmarks, resume, site links
- `src/pages/` – routes · `src/layouts/Base.astro` – page shell · `src/styles/global.css` – design tokens
