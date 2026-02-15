import Link from "next/link";
import { portfolio } from "@/data/portfolio";

export default function HomePage() {
  return (
    <main className="container">
      <header className="hero">
        <nav className="topNav">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
          <Link href="/blog">Blog</Link>
        </nav>

        <p className="eyebrow">{portfolio.name}</p>
        <h1>{portfolio.headline}</h1>
        <div className="ctaRow">
          <a href={portfolio.links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={portfolio.links.email}>Email</a>
          <Link href={portfolio.links.blog}>Blog</Link>
        </div>
      </header>

      <section id="about" className="cardSection">
        <h2>About</h2>
        {portfolio.sections.about.split("\n").map((line) => (
          <p key={line}>{line}</p>
        ))}
      </section>

      <section id="skills" className="cardSection">
        <h2>Skills</h2>
        <ul className="chipList">
          {portfolio.sections.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>

      <section id="projects" className="cardSection">
        <h2>Projects</h2>
        <div className="grid">
          {portfolio.sections.projects.map((project) => (
            <article key={project.title}>
              <h3>{project.title}</h3>
              <p>{project.desc}</p>
              <a href={project.link} target="_blank" rel="noreferrer">
                Link
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="cardSection">
        <h2>Experience</h2>
        <div className="list">
          {portfolio.sections.experience.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p className="period">{item.period}</p>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="cardSection">
        <h2>Contact</h2>
        <p>
          메일: <a href={portfolio.links.email}>you@example.com</a>
        </p>
        <p>
          GitHub: <a href={portfolio.links.github}>{portfolio.links.github}</a>
        </p>
      </section>
    </main>
  );
}
