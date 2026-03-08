import { Github, Linkedin, Twitter, Mail, Globe, Youtube, ExternalLink } from "lucide-react";

const socialLinks = [
  { title: "GitHub", url: "https://github.com", icon: Github, description: "Check out my open source projects" },
  { title: "LinkedIn", url: "https://linkedin.com", icon: Linkedin, description: "Connect with me professionally" },
  { title: "Twitter / X", url: "https://x.com", icon: Twitter, description: "Thoughts in 280 characters or less" },
  { title: "YouTube", url: "https://youtube.com", icon: Youtube, description: "Tutorials and creative content" },
  { title: "Email", url: "mailto:hello@example.com", icon: Mail, description: "Drop me a line anytime" },
];

const usefulLinks = [
  { title: "My Portfolio", url: "https://example.com", description: "A curated showcase of my best work" },
  { title: "Dev.to Blog", url: "https://dev.to", description: "Technical articles and community posts" },
  { title: "Dribbble", url: "https://dribbble.com", description: "Design explorations and shots" },
  { title: "Notion Resources", url: "https://notion.so", description: "Templates and resources I've shared" },
];

const Links = () => {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Links</h1>
        <p className="text-muted-foreground mt-1">Find me around the internet.</p>
      </div>

      {/* Social links */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Social</h2>
        <div className="space-y-2">
          {socialLinks.map((link) => (
            <a
              key={link.title}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-lg border border-border p-4 hover:border-primary/30 transition-colors"
            >
              <link.icon size={20} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">{link.title}</p>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </div>
              <ExternalLink size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </a>
          ))}
        </div>
      </section>

      {/* Useful links */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Resources</h2>
        <div className="space-y-2">
          {usefulLinks.map((link) => (
            <a
              key={link.title}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-lg border border-border p-4 hover:border-primary/30 transition-colors"
            >
              <Globe size={20} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">{link.title}</p>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </div>
              <ExternalLink size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Links;
