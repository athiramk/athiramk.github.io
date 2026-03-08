import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="space-y-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground">Post not found</h1>
        <Link to="/blog" className="text-sm text-primary hover:underline">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="space-y-6">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={14} /> Back to blog
      </Link>

      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          {post.category}
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{post.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{post.date}</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground leading-relaxed space-y-4">
        {post.content.split("\n\n").map((paragraph, i) => {
          if (paragraph.startsWith("## ")) {
            return (
              <h2 key={i} className="text-xl font-semibold mt-8 mb-3 text-foreground">
                {paragraph.replace("## ", "")}
              </h2>
            );
          }
          return (
            <p key={i} className="text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>
    </article>
  );
};

export default BlogPost;
