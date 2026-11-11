import watercolor from "../assets/hobbies/hobby-watercolor.jpg";
import cooking from "../assets/hobbies/hobby-cooking.jpg";
import hiking from "../assets/hobbies/hobby-hiking.jpg";
import reading from "../assets/hobbies/hobby-reading.jpg";
import writing from "../assets/hobbies/hobby-writing.jpg";
import volleyball from "../assets/hobbies/hobby-volleyball.jpg";

type Hobby = { title: string; image: ImageMetadata; alt: string; description: string; link?: { href: string; label: string } };

export const hobbies: Hobby[] = [
  { title: "Watercolour Painting", image: watercolor, alt: "A watercolour painting in progress", description: "Bringing landscapes and florals to life with watercolours. I love the unpredictability and flow of the medium." , link: { href: "/watercolour/", label: "See the gallery" } },
  { title: "Cooking", image: cooking, alt: "A home-cooked dish", description: "Trying new recipes and cuisines. I have recently discovered the joy of cooking." },
  { title: "Hiking", image: hiking, alt: "A hiking trail view", description: "Exploring trails and getting out into nature whenever I can. There's nothing like a good summit view." },
  { title: "Reading", image: reading, alt: "A book resting on a table", description: "From fiction to non-fiction — I always have something on my nightstand. A great way to unwind and learn." },
  { title: "Writing", image: writing, alt: "A notebook and pen", description: "Journaling thoughts and crafting stories. Writing helps me process ideas and express creativity." },
  { title: "Playing Volleyball", image: volleyball, alt: "A volleyball game", description: "Love the energy of a good volleyball game. It's a great way to stay active and have fun with friends." },
];
