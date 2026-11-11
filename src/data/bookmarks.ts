export type Bookmark = { title: string; description: string; url?: string; section: "Links" | "Books" | "Media" | "Tools" };

export const bookmarks: Bookmark[] = [
  { title: "The Pudding", description: "Visual essays that explain ideas debated in culture — data-driven and beautifully designed.", url: "https://pudding.cool", section: "Links" },
  { title: "Refactoring UI", description: "Practical design tips for developers who want to make things look great without a design background.", url: "https://refactoringui.com", section: "Links" },
  { title: "The Marginalian", description: "Maria Popova's deeply thoughtful writing on creativity, philosophy, and the meaning of life.", url: "https://themarginalian.org", section: "Links" },
  { title: "Bartosz Ciechanowski's Blog", description: "Interactive articles explaining complex topics like GPS, cameras, and mechanical watches.", url: "https://ciechanow.ski", section: "Links" },
  { title: "Mother Mary Comes to Me — Arundhati Roy", description: "A powerful novel about the complexities of love, loss, and identity in post-colonial India.", section: "Books" },
  { title: "Atomic Habits — James Clear", description: "A practical framework for building good habits and breaking bad ones. Changed how I think about systems.", section: "Books" },
  { title: "Sapiens — Yuval Noah Harari", description: "A sweeping history of humankind that connects biology, culture, and technology.", section: "Books" },
  { title: "Show Your Work! — Austin Kleon", description: "A short, inspiring read about sharing your creative process and building an audience.", section: "Books" },
  { title: "Inventing on Principle — Bret Victor", description: "One of the most inspiring tech talks ever. About the power of immediate feedback in creative tools.", url: "https://vimeo.com/36579366", section: "Media" },
  { title: "The Futur", description: "Business and design education through engaging videos and conversations.", url: "https://youtube.com/@thefutur", section: "Media" },
  { title: "Lex Fridman Podcast", description: "Long-form conversations with scientists, engineers, and thinkers.", url: "https://lexfridman.com/podcast", section: "Media" },
  { title: "Raycast", description: "A blazing fast launcher for macOS that replaced Spotlight for me.", url: "https://raycast.com", section: "Tools" },
  { title: "Excalidraw", description: "A simple, beautiful whiteboard tool for sketching diagrams. Open source and collaborative.", url: "https://excalidraw.com", section: "Tools" },
  { title: "Obsidian", description: "My go-to for note-taking and building a personal knowledge base with linked markdown files.", url: "https://obsidian.md", section: "Tools" },
];
