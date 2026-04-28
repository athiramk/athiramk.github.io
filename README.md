# Athira Kamala — Personal Portfolio & Blog

A personal portfolio and blog website built with React, Vite, TypeScript, Tailwind CSS, and shadcn/ui.

Live preview: [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)

---

## Table of Contents

- [Project Structure](#project-structure)
- [Pages Overview](#pages-overview)
- [How to Add a Blog Post](#how-to-add-a-blog-post)
- [Customising Pages](#customising-pages)
- [Theming & Design System](#theming--design-system)
- [Getting Started](#getting-started)

---

## Project Structure

```
├── public/
│   ├── images/              # Blog & hobby images (referenced via publicUrl())
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── assets/              # Imported assets (e.g. profile illustration)
│   ├── components/
│   │   ├── Layout.tsx        # Root layout — header, nav, footer, theme toggle
│   │   ├── NavLink.tsx       # Reusable nav link component
│   │   └── ui/              # shadcn/ui components (button, card, dialog, etc.)
│   ├── data/
│   │   └── blogPosts.ts     # Blog post content & categories
│   ├── hooks/
│   │   ├── use-theme.ts     # Dark/light mode toggle (persisted to localStorage)
│   │   ├── use-seo.ts       # Per-page SEO (title, meta description, OG tags)
│   │   └── use-mobile.tsx   # Mobile breakpoint detection
│   ├── lib/
│   │   ├── basePath.ts      # Helper for resolving public asset URLs
│   │   └── utils.ts         # Tailwind merge utility (cn)
│   ├── pages/
│   │   ├── Index.tsx         # Home — hero section with intro & profile image
│   │   ├── Blog.tsx          # Blog listing with category filters
│   │   ├── BlogPost.tsx      # Individual blog post view
│   │   ├── Hobbies.tsx       # Hobbies grid with images
│   │   ├── Bookmarks.tsx     # Curated links, books, media & tools
│   │   ├── Resume.tsx        # Work experience, education, skills
│   │   ├── Contact.tsx       # Contact form (Formspree) + social links
│   │   └── NotFound.tsx      # 404 page
│   ├── App.tsx               # Router & provider setup
│   ├── index.css             # Tailwind directives & CSS design tokens
│   └── main.tsx              # React entry point
├── index.html                # HTML shell (fonts, meta tags)
├── tailwind.config.ts        # Tailwind theme (fonts, colours, tokens)
└── vite.config.ts            # Vite config (aliases, dev server)
```

---

## Pages Overview

| Page | Route | File | Description |
|------|-------|------|-------------|
| Home | `/` | `src/pages/Index.tsx` | Hero intro with profile image, tagline, and CTA buttons |
| Blog | `/blog` | `src/pages/Blog.tsx` | Card grid of posts with category filters (All, Tech, Art, Life, Random) |
| Blog Post | `/blog/:id` | `src/pages/BlogPost.tsx` | Full blog post rendered from `blogPosts.ts` |
| Hobbies | `/hobbies` | `src/pages/Hobbies.tsx` | Visual grid of hobbies with images and descriptions |
| Bookmarks | `/bookmarks` | `src/pages/Bookmarks.tsx` | Curated links, books, media & tools with section filters |
| Resume | `/resume` | `src/pages/Resume.tsx` | Work experience, education, skills, and interests |
| Contact | `/contact` | `src/pages/Contact.tsx` | Contact form (via Formspree) and social links |

---

## How to Add a Blog Post

All blog posts live in **`src/data/blogPosts.ts`**.

### 1. Add an image (optional)

Place your image in `public/images/` (e.g. `public/images/blog-my-topic.jpg`).

### 2. Add the post object

Open `src/data/blogPosts.ts` and add a new entry to the `blogPosts` array:

```ts
{
  id: "my-new-post",                          // URL slug — must be unique
  title: "My New Blog Post",
  excerpt: "A short summary shown on the blog listing page.",
  category: "Tech",                           // Must be: "Tech" | "Art" | "Life" | "Random"
  date: "March 8, 2026",
  image: publicUrl("images/blog-my-topic.jpg"), // Optional — omit for no image
  content: `Your full post content here.

## Subheading

You can use **markdown-style** formatting with template literals.
Multiple paragraphs are separated by \\n\\n.`,
}
```

### 3. Add a new category (optional)

To add a new filter category, update the `categories` array in the same file:

```ts
export const categories = ["All", "Tech", "Art", "Life", "Random", "NewCategory"] as const;
```

That's it — no routing changes needed. The post will automatically appear on `/blog` and be accessible at `/blog/my-new-post`.

---

## Customising Pages

### Home (`src/pages/Index.tsx`)
- Edit the heading, tagline, and bio text directly
- Replace the profile image by swapping `src/assets/profile-illustration.png`
- Modify CTA buttons (links, labels, icons)

### Hobbies (`src/pages/Hobbies.tsx`)
- Add/remove hobbies by editing the `hobbies` array
- Each hobby has: `title`, `description`, and `image` (from `public/images/`)

### Bookmarks (`src/pages/Bookmarks.tsx`)
- Add/remove items in the `bookmarks` array
- Each bookmark has: `title`, `description`, optional `url`, and `section` (`"Links"` | `"Books"` | `"Media"` | `"Tools"`)

### Resume (`src/pages/Resume.tsx`)
- Edit the `experience`, `education`, `skills`, and `interests` arrays directly in the file
- Each experience entry has: `role`, `company`, `period`, `tags`, and `points`

### Contact (`src/pages/Contact.tsx`)
- Update the Formspree endpoint URL in `FORMSPREE_URL`
- Edit social links in the `socials` array

### Navigation (`src/components/Layout.tsx`)
- Add or remove pages by editing the `navLinks` array
- Don't forget to add a corresponding route in `src/App.tsx`

---

## Theming & Design System

### Colours & Tokens
All colours are defined as CSS custom properties in `src/index.css` using HSL values, with separate `:root` (light) and `.dark` blocks. Key tokens include:

- `--background`, `--foreground` — base colours
- `--primary`, `--primary-foreground` — accent colour
- `--muted`, `--muted-foreground` — subdued text/backgrounds
- `--border`, `--accent`, `--destructive` — UI elements

### Font
The site uses **Source Serif 4** (loaded via Google Fonts in `index.html`). To change it:
1. Update the `<link>` tag in `index.html`
2. Update `fontFamily.sans` in `tailwind.config.ts`

### Dark Mode
Managed by `src/hooks/use-theme.ts`. Toggles the `.dark` class on `<html>` and persists the preference to `localStorage`.

---

## Getting Started

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app runs at `http://localhost:8080` by default.

### Other commands

| Command | Description |
|---------|-------------|
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run lint` | Lint with ESLint |

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool & dev server
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — accessible UI components
- **React Router** — client-side routing
- **Formspree** — contact form backend
- **Source Serif 4** — typography (Google Fonts)
