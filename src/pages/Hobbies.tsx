import { publicUrl } from "@/lib/basePath";
import { useSeo } from "@/hooks/use-seo";
import { ExternalLink } from "lucide-react";

const hobbies = [
  {
    title: "Watercolour Painting",
    description: "Bringing landscapes and florals to life with watercolours. I love the unpredictability and flow of the medium.",
    image: publicUrl("images/hobby-watercolor.jpg"),
  },
  {
    title: "Cooking",
    description: "Trying new recipes and cuisines. I have recently discovered the joy of cooking.",
    image: publicUrl("images/hobby-cooking.jpg"),
  },
  {
    title: "Hiking",
    description: "Exploring trails and getting out into nature whenever I can. There's nothing like a good summit view.",
    image: publicUrl("images/hobby-hiking.jpg"),
  },
  {
    title: "Reading",
    description: "From fiction to non-fiction — I always have something on my nightstand. A great way to unwind and learn.",
    image: publicUrl("images/hobby-reading.jpg"),
  },
  {
    title: "Writing",
    description: "Journaling thoughts and crafting stories. Writing helps me process ideas and express creativity.",
    image: publicUrl("images/hobby-writing.jpg"),
  },
  {
    title: "Playing Volleyball",
    description: "Love the energy of a good volleyball game. It's a great way to stay active and have fun with friends.",
    image: publicUrl("images/hobby-volleyball.jpg"),
  },
];

const sideProjects = [
  {
    title: "QR Code Crafter",
    description: "Generate beautiful, customizable QR codes for contacts and links — free and instant.",
    url: "https://athiramk.com/qr-code-crafter/",
    image: publicUrl("images/project-qr-code-crafter.png"),
    imagePosition: "object-center" as const,
  },
  {
    title: "BodyRhythm",
    description: "Decode what your body is saying — track moods, energy, cravings, and more based on your cycle.",
    url: "https://athiramk.com/body-rhythm/",
    image: publicUrl("images/project-body-rhythm.png"),
    imagePosition: "object-top" as const,
  },
];

const Hobbies = () => {
  useSeo({ title: "Hobbies & Side Projects", description: "Athira Kamala's hobbies and side projects – watercolour, cooking, hiking, and web apps." });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Hobbies and Side Projects</h1>
        <p className="text-muted-foreground mt-1">Things I enjoy outside of work.</p>
      </div>



      {/* Hobbies */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Hobbies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {hobbies.map((hobby) => (
            <div
              key={hobby.title}
              className="group rounded-lg border border-border overflow-hidden hover:border-primary/30 transition-colors"
            >
              <div className="aspect-square w-full overflow-hidden bg-muted">
                <img
                  src={hobby.image}
                  alt={hobby.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground">{hobby.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {hobby.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side Projects */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Side Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sideProjects.map((project) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg border border-border overflow-hidden hover:border-primary/30 transition-colors flex flex-col"
            >
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={project.image}
                  alt={project.title}
                  className={`w-full h-full object-cover scale-125 group-hover:scale-[1.35] transition-transform duration-300 ${project.imagePosition}`}
                />
              </div>
              <div className="p-4 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-foreground">{project.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hobbies;
