import { publicUrl } from "@/lib/basePath";

const hobbies = [
  {
    title: "Music",
    description: "Playing guitar and discovering new artists. Music is my go-to for unwinding after a long day.",
    image: publicUrl("images/hobby-music.jpg"),
  },
  {
    title: "Hiking",
    description: "Exploring trails and getting out into nature whenever I can. There's nothing like a good summit view.",
    image: publicUrl("images/hobby-hiking.jpg"),
  },
  {
    title: "Reading",
    description: "From sci-fi novels to design books — I always have something on my nightstand.",
    image: publicUrl("images/hobby-reading.jpg"),
  },
  {
    title: "Photography",
    description: "Capturing moments and experimenting with composition. Mostly street and landscape photography.",
    image: publicUrl("images/hobby-photography.jpg"),
  },
  {
    title: "Cooking",
    description: "Trying new recipes and cuisines. I find cooking to be a creative and meditative process.",
    image: publicUrl("images/hobby-cooking.jpg"),
  },
  {
    title: "Gaming",
    description: "Story-driven games and indie titles are my favorites. A great way to experience interactive storytelling.",
    image: publicUrl("images/hobby-gaming.jpg"),
  },
];

const Hobbies = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Hobbies</h1>
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
