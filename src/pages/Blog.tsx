import { useState } from "react";
import { Link } from "react-router-dom";
import { blogPosts, categories } from "@/data/blogPosts";

const Blog = () => {
  const [active, setActive] = useState("All");

  const filtered = active === "All"
    ? blogPosts
    : blogPosts.filter((p) => p.category === active);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Blog</h1>
        <p className="text-muted-foreground mt-1">Thoughts on tech, art, life, and everything in between.</p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              active === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Post grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="group block rounded-lg border border-border overflow-hidden hover:border-primary/30 transition-colors"
          >
            {post.image && (
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {post.category}
              </span>
              <h3 className="mt-2 font-semibold text-foreground group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">{post.date}</p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No posts in this category yet.</p>
      )}
    </div>
  );
};

export default Blog;
