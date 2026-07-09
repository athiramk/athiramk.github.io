import { useState } from "react";
import { Link2, BookOpen, Play, Wrench, ExternalLink } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";

const sections = ["All", "Links", "Books", "Media", "Tools"] as const;

type Bookmark = {
  title: string;
  description: string;
  url?: string;
  section: "Links" | "Books" | "Media" | "Tools";
};

const bookmarks: Bookmark[] = [
  // Interesting links
  { title: "The Pudding", description: "Visual essays that explain ideas debated in culture — data-driven and beautifully designed.", url: "https://pudding.cool", section: "Links" },
  { title: "Refactoring UI", description: "Practical design tips for developers who want to make things look great without a design background.", url: "https://refactoringui.com", section: "Links" },
  { title: "The Marginalian", description: "Maria Popova's deeply thoughtful writing on creativity, philosophy, and the meaning of life.", url: "https://themarginalian.org", section: "Links" },
  { title: "Bartosz Ciechanowski's Blog", description: "Interactive articles explaining complex topics like GPS, cameras, and mechanical watches.", url: "https://ciechanow.ski", section: "Links" },

  // Books
  { title: "Mother Mary Comes to me - Arundhati Roy", description: "A powerful novel about the complexities of love, loss, and identity in post-colonial India.", section: "Books" },
  { title: "Atomic Habits — James Clear", description: "A practical framework for building good habits and breaking bad ones. Changed how I think about systems.", section: "Books" },
  { title: "Sapiens — Yuval Noah Harari", description: "A sweeping history of humankind that connects biology, culture, and technology.", section: "Books" },
  { title: "Show Your Work! — Austin Kleon", description: "A short, inspiring read about sharing your creative process and building an audience.", section: "Books" },

  // Media & talks
  { title: "Inventing on Principle — Bret Victor", description: "One of the most inspiring tech talks ever. About the power of immediate feedback in creative tools.", url: "https://vimeo.com/36579366", section: "Media" },
  { title: "The Futur", description: "Business and design education through engaging videos and conversations.", url: "https://youtube.com/@thefutur", section: "Media" },
  { title: "Lex Fridman Podcast", description: "Long-form conversations with scientists, engineers, and thinkers.", url: "https://lexfridman.com/podcast", section: "Media" },

  // Tools & resources
  { title: "Raycast", description: "A blazing fast launcher for macOS that replaced Spotlight for me.", url: "https://raycast.com", section: "Tools" },
  { title: "Excalidraw", description: "A simple, beautiful whiteboard tool for sketching diagrams. Open source and collaborative.", url: "https://excalidraw.com", section: "Tools" },
  { title: "Obsidian", description: "My go-to for note-taking and building a personal knowledge base with linked markdown files.", url: "https://obsidian.md", section: "Tools" },
];

const sectionIcons: Record<string, React.ElementType> = {
  Links: Link2,
  Books: BookOpen,
  Media: Play,
  Tools: Wrench,
};

const Bookmarks = () => {
  useSeo({ title: "Bookmarks", description: "Curated links, books, talks, and tools recommended by Athira Kamala." });
  const [active, setActive] = useState<string>("All");

  const filtered = active === "All"
    ? bookmarks
    : bookmarks.filter((b) => b.section === active);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Bookmarks</h1>
        <p className="text-muted-foreground mt-1">
          A curated collection of links, books, talks, and tools that have inspired me.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              active === s
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-2">
        {filtered.map((item) => {
          const Icon = sectionIcons[item.section];
          const Wrapper = item.url ? "a" : "div";
          const wrapperProps = item.url
            ? { href: item.url, target: "_blank", rel: "noopener noreferrer" }
            : {};

          return (
            <Wrapper
              key={item.title}
              {...(wrapperProps as any)}
              className="group flex items-start gap-4 rounded-lg border border-border p-4 hover:border-primary/30 transition-colors"
            >
              <Icon size={18} className="mt-0.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
              {item.url && (
                <ExternalLink size={14} className="mt-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              )}
            </Wrapper>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">Nothing here yet.</p>
      )}
    </div>
  );
};

export default Bookmarks;
