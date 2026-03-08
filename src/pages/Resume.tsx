import { Download, Briefcase, GraduationCap } from "lucide-react";

const experience = [
  {
    role: "Senior Frontend Developer",
    company: "Tech Corp",
    period: "2024 — Present",
    description: "Leading the frontend team, building design systems, and shipping user-facing features with React and TypeScript.",
  },
  {
    role: "Frontend Developer",
    company: "StartupXYZ",
    period: "2022 — 2024",
    description: "Built and maintained the core web application. Worked closely with design and product to ship new features weekly.",
  },
  {
    role: "Junior Developer",
    company: "Agency Co.",
    period: "2020 — 2022",
    description: "Developed client websites and landing pages. Gained experience with responsive design and CMS integrations.",
  },
];

const education = [
  {
    degree: "B.Sc. Computer Science",
    institution: "University of Technology",
    period: "2016 — 2020",
    description: "Focused on software engineering, algorithms, and human-computer interaction.",
  },
];

const skills = [
  { category: "Languages", items: ["TypeScript", "JavaScript", "Python", "HTML/CSS"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Vite"] },
  { category: "Tools", items: ["Git", "Figma", "VS Code", "Docker"] },
  { category: "Soft Skills", items: ["Communication", "Problem Solving", "Team Leadership", "Mentoring"] },
];

type TimelineEntry = {
  title: string;
  subtitle: string;
  period: string;
  description: string;
};

const TimelineSection = ({
  title,
  icon: Icon,
  entries,
}: {
  title: string;
  icon: React.ElementType;
  entries: TimelineEntry[];
}) => (
  <section className="space-y-4">
    <div className="flex items-center gap-2">
      <Icon size={18} className="text-primary" />
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    </div>
    <div className="relative ml-2 border-l-2 border-border pl-6 space-y-8">
      {entries.map((entry, i) => (
        <div key={i} className="relative">
          {/* Dot */}
          <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
          <p className="text-xs text-muted-foreground font-medium">{entry.period}</p>
          <h3 className="font-semibold text-foreground mt-0.5">{entry.title}</h3>
          <p className="text-sm text-primary/80">{entry.subtitle}</p>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{entry.description}</p>
        </div>
      ))}
    </div>
  </section>
);

const Resume = () => {
  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Resume</h1>
          <p className="text-muted-foreground mt-1">A summary of my experience, education, and skills.</p>
        </div>
        <a
          href="/resume.pdf"
          download
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity self-start"
        >
          <Download size={16} /> Download PDF
        </a>
      </div>

      {/* Experience */}
      <TimelineSection
        title="Experience"
        icon={Briefcase}
        entries={experience.map((e) => ({
          title: e.role,
          subtitle: e.company,
          period: e.period,
          description: e.description,
        }))}
      />

      {/* Education */}
      <TimelineSection
        title="Education"
        icon={GraduationCap}
        entries={education.map((e) => ({
          title: e.degree,
          subtitle: e.institution,
          period: e.period,
          description: e.description,
        }))}
      />

      {/* Skills */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((group) => (
            <div key={group.category} className="rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">{group.category}</h3>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Resume;
