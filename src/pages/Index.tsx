import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import profileIllustration from "@/assets/profile-illustration.png";
import { useSeo } from "@/hooks/use-seo";
import FunBanner from "@/components/FunBanner";


const Index = () => {
  useSeo({ title: "Home", description: "Athira Kamala – Senior Software Developer specialising in Java, Spring Boot, Microservices, and Cloud. Based in Melbourne." });

  return (
    <div>
      <FunBanner />
      <section className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-14 py-8">
      <div className="flex-1 space-y-5">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Hi, I'm <span className="text-primary">Athira</span>
          </h1>
          <p className="text-base text-muted-foreground mt-2 font-medium">
            Software Developer · Designer · Creator
          </p>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          I build things on the web and enjoy turning ideas into clean, functional products. 
          Passionate about open source, creative coding, and continuous learning. 
          When I'm not at the keyboard, I'm probably reading, sketching, or exploring something new.
        </p>
        <div className="flex gap-3 pt-1">
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
            <Mail size={16} /> Get in Touch
          </Link>
        </div>
      </div>
      <div className="flex-shrink-0">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden">
          <img src={profileIllustration} alt="Athira Kamala illustration" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
};

export default Index;
