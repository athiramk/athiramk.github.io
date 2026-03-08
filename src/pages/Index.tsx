import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Hi, I'm <span className="text-primary">Your Name</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Welcome to my corner of the internet. I write about tech, creative projects, 
            and life. Have a look around!
          </p>
          <div className="flex gap-3 pt-2">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Read the Blog <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-muted border-2 border-border flex items-center justify-center text-muted-foreground text-sm">
            Photo
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">About Me</h2>
        <p className="text-muted-foreground leading-relaxed">
          I'm a developer and creative thinker passionate about building things on the web. 
          When I'm not coding, you'll find me exploring new hobbies, reading, or tinkering 
          with side projects. This site is where I share what I learn and what I'm working on.
        </p>
      </section>

      {/* Latest posts placeholder */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Latest Posts</h2>
          <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            View all →
          </Link>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
            >
              <p className="text-xs text-muted-foreground mb-1">March {i}, 2026</p>
              <h3 className="font-medium text-foreground">Sample Blog Post {i}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                A brief description of what this post is about...
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
