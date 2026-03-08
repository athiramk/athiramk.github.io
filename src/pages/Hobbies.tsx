import { publicUrl } from "@/lib/basePath";
import { useSeo } from "@/hooks/use-seo";

const hobbies = [
  {
    title: "Watercolour Painting",
    description: "Bringing landscapes and florals to life with watercolours. I love the unpredictability and flow of the medium.",
    image: publicUrl("images/hobby-watercolor.jpg"),
  },
  {
    title: "Cooking",
    description: "Trying new recipes and cuisines. I find cooking to be a creative and meditative process.",
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

const Hobbies = () => {
  useSeo({ title: "Hobbies", description: "Athira Kamala's hobbies – music, photography, reading, hiking, cooking, and gaming." });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Hobbies and Side Projects</h1>
        <p className="text-muted-foreground mt-1">Things I enjoy outside of work.</p>
      </div>

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
  );
};

export default Hobbies;
