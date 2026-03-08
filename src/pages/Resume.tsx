import { Download, Briefcase, GraduationCap, Award, Heart } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";

const experience = [
  {
    role: "Senior Software Developer",
    company: "IAG (through Infosys)",
    period: "Jun 2022 — Aug 2025 · Melbourne",
    tags: ["Java", "Spring", "RESTful API", "CI/CD", "DevOps"],
    points: [
      "Enhanced and maintained containerised backend services of the customer facing insurance application using Java Spring Boot",
      "Optimised and maintained a Java based RESTful API integration that facilitated real-time data synchronization between the external partner application and backend database",
      "Involved in vulnerability identification using Snyk and GitHub security and mitigation to improve security",
      "Involved in the development activities of Bitbucket to GitHub and Nexus to Nexus3 migration",
      "Introduced CI/CD pipelines with GitHub, Jenkins, Bamboo and Nexus, cutting application deployment time by 40%",
      "Improved monitoring and operational processes, reducing problem resolution time",
      "Mentored team members through code reviews and worked with product owners, architects, and QA teams",
      "Actively contributed to technical debt reduction and improving documentation",
    ],
  },
  {
    role: "Technology Lead",
    company: "Telstra (through Infosys)",
    period: "Oct 2021 — Jun 2022 · India",
    tags: ["Java", "Spring", "Microservices", "New Relic", "NoSQL"],
    points: [
      "Designed and implemented a cloud-native, event-driven microservices architecture to diagnose faults in customer networks which reduced problem resolution time",
      "Created New Relic dashboards for device health, latency, uptime, and performance insights",
      "Mentored engineers and provided technical guidance on system enhancements",
      "Refactored legacy backend applications using Spring Boot, Hibernate, and OOP principles to improve code reusability and simplify future updates",
    ],
  },
  {
    role: "Technology Analyst",
    company: "Telstra (through Infosys)",
    period: "Oct 2017 — Sep 2021 · Melbourne: Oct 2018 – Aug 2019",
    tags: ["C++", "Perl", "Python", "SQL"],
    points: [
      "Designed and implemented Netcool/OMNIbus architecture, including high-availability object servers and process agent configuration files",
      "Developed custom probe rules files (SNMP, Syslog) to parse events from Cisco, Ericsson, and Alcatel devices",
      "Designed custom Web GUI dashboards and filters, improving alarm visibility for network operation centres",
      "Managed performance tuning of ObjectServers and conducted routine maintenance on Solaris/Linux platforms",
      "Managed stakeholder relationships and prioritized maintenance and feature requests",
    ],
  },
  {
    role: "Senior Systems Engineer",
    company: "Telstra (through Infosys)",
    period: "Oct 2015 — Sep 2017 · India",
    tags: ["C++", "Perl", "Python", "SQL", "Splunk"],
    points: [
      "Configured and customized Netcool/Impact policies for event enrichment, deduplication, and automated ticketing",
      "Integrated Netcool with Remedy ARS using gateways for bidirectional ticket synchronization",
      "Enhanced application monitoring and logging using Splunk",
    ],
  },
  {
    role: "Systems Engineer",
    company: "Telstra (through Infosys)",
    period: "Sep 2013 — Sep 2015 · India",
    tags: ["C++", "Perl", "Shell", "SQL"],
    points: [
      "Installed, configured, and upgraded Netcool products (OMNIbus, Web GUI, Impact)",
      "Wrote SQL triggers and procedures in OMNIbus to enhance, suppress, or reroute incoming events",
      "Provided 24/7 on-call support for troubleshooting network monitoring solutions",
    ],
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
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-outside ml-4">
                {exp.points.map((point, j) => (
                  <li key={j} className="leading-relaxed">{point}</li>
                ))}
              </ul>
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
