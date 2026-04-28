import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { marked } from "marked";
import { useEffect, useState } from "react";

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);
  const [renderedContent, setRenderedContent] = useState("");

  useEffect(() => {
    if (post?.content) {
      const html = marked(post.content) as string;
      setRenderedContent(html);
    }
  }, [post]);

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
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{post.date}</p>
      </div>
      {post.image && (
      <div className={`w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center ${post.image.endsWith('.svg') ? 'p-6' : ''}`}>
        <img
          src={post.image}
          alt={post.title}
          className={`w-full ${post.image.endsWith('.svg') ? 'object-contain' : 'object-cover'}`}
        />
      </div>
      )}
      <div
        className="prose prose-neutral dark:prose-invert max-w-none
          prose-headings:text-foreground
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4
          prose-strong:text-foreground
          prose-a:text-primary"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
    </article>
  );
};

export default BlogPost;