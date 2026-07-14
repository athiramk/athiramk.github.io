import { Download, Briefcase, GraduationCap, Award, Heart } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";

const experience = [
  {
    role: "Senior Software Engineer",
    company: "Insurance Australia Group (IAG)",
    period: "Jun 2022 — Aug 2025",
    tags: ["Java", "Spring", "RESTful API", "CI/CD", "DevOps"],
    summary: "Developed backend APIs for an insurance Quote & Buy platform, modernised legacy systems to close security gaps, and implemented CI/CD pipelines to speed up releases. Led BAU operations as stakeholder anchor for a year, mentored developers, and drove technical debt reduction across the team.",
  },
  {
    role: "Senior Systems Engineer",
    company: "Telstra",
    period: "Oct 2017 — Jun 2022",
    tags: ["Java", "Spring", "Microservices", "New Relic", "NoSQL"],
    summary: "Designed and built a web application for monitoring network device faults (routers and modems) using multithreading for efficient concurrent processing. Led a lift-and-shift migration of a legacy system to address infrastructure security vulnerabilities, ensuring compatibility and framework upgrades with minimal application disruption. Architected Netcool/OMNIbus solutions, including high-availability object servers and custom probe rules to parse SNMP and Syslog events from Cisco, Ericsson, and Alcatel devices. Designed custom Web GUI dashboards to improve alarm visibility for network operations centres, while managing ObjectServer performance tuning, platform maintenance on Solaris/Linux, and stakeholder priorities for ongoing feature and maintenance requests.",
  },
  {
    role: "Systems Engineer",
    company: "Telstra",
    period: "Feb 2014 — Sep 2017",
    tags: ["C++", "Perl", "Python", "SQL"],
    summary: "Configured Netcool/Impact policies for event enrichment, deduplication, and automated ticketing, and contributed to integrating Netcool event streams with Kafka via gateway components for producer-side event publishing. Enhanced application monitoring and logging using Splunk, and developed SQL triggers and procedures in OMNIbus to enhance, suppress, or reroute incoming events. Installed, configured, and upgraded Netcool products (OMNIbus, Web GUI, Impact), while providing 24/7 on-call support for network monitoring solutions.",
  },
];

const education = [
  {
    degree: "Bachelor of Technology – Computer Science & Engineering",
    institution: "Cochin University of Science and Technology, India",
    period: "2008 — 2012",
    description: "",
  },
];

const certifications = [
  { name: "GitHub Actions", year: "2025" },
  { name: "GitHub Foundations", year: "2025" },
  { name: "Oracle Certified Java Programmer (OCJP)", year: "2016" },
];

const community = [
  {
    role: "Volunteer – Sohum Innovation Lab",
    period: "2020 · Remote",
    description: "Worked with the engineering team to develop newborn hearing screening device software using C++",
  },
  {
    role: "Volunteer – Rise up Forum",
    period: "2018–2019 · Remote",
    description: "Coordinated resources and supported logistics during the 2018 Kerala floods relief efforts",
  },
];

const skills = [
  { category: "Languages & Frameworks", items: ["Java", "Spring Boot", "Hibernate", "RESTful APIs", "Microservices", "C++", "Perl", "Python", "Shell"] },
  { category: "Cloud & Infrastructure", items: ["AWS", "Kubernetes", "Docker", "Rancher"] },
  { category: "DevOps & CI/CD", items: ["Git", "Jenkins", "GitHub", "GitHub Actions", "Bamboo", "Nexus"] },
  { category: "Databases", items: ["Oracle", "SQL Server", "PostgreSQL", "MongoDB (NoSQL)", "Redis"] },
  { category: "Monitoring", items: ["New Relic", "Splunk"] },
];

const Resume = () => {
  useSeo({ title: "Resume", description: "Athira Kamala's resume – 12+ years of experience in Java, Spring Boot, Microservices, and Cloud across IAG and Telstra." });

  return (
    <div className="space-y-10">
      {/* Header */}
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
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Briefcase size={18} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Experience</h2>
        </div>
        <div className="relative ml-2 border-l-2 border-border pl-6 space-y-8">
          {experience.map((exp, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
              <p className="text-xs text-muted-foreground font-medium">{exp.period}</p>
              <h3 className="font-semibold text-foreground mt-0.5">{exp.role}</h3>
              <p className="text-sm text-primary/80">{exp.company}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {exp.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-[11px] font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{exp.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap size={18} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Education</h2>
        </div>
        <div className="relative ml-2 border-l-2 border-border pl-6 space-y-8">
          {education.map((e, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
              <p className="text-xs text-muted-foreground font-medium">{e.period}</p>
              <h3 className="font-semibold text-foreground mt-0.5">{e.degree}</h3>
              <p className="text-sm text-primary/80">{e.institution}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Certifications</h2>
        </div>
        <div className="space-y-2">
          {certifications.map((cert) => (
            <div key={cert.name} className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="text-sm font-medium text-foreground">{cert.name}</span>
              <span className="text-xs text-muted-foreground">{cert.year}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Community Involvement */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Heart size={18} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Community Involvement</h2>
        </div>
        <div className="relative ml-2 border-l-2 border-border pl-6 space-y-8">
          {community.map((c, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
              <p className="text-xs text-muted-foreground font-medium">{c.period}</p>
              <h3 className="font-semibold text-foreground mt-0.5">{c.role}</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{c.description}</p>
            </div>
          ))}
        </div>
      </section>

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
