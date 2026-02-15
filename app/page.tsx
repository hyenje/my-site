import Image from "next/image";
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

        <div className="heroBody">
          <div className="heroMain">
            <p className="eyebrow">{portfolio.name}</p>
            <h1>{portfolio.headline}</h1>
            <div className="ctaRow">
              <a href={portfolio.links.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={portfolio.links.email}>Email</a>
              <a href={portfolio.links.blog} target="_blank" rel="noreferrer">
                Blog
              </a>
            </div>
          </div>

          <aside className="heroAside">
            <Image
              src={portfolio.photo}
              alt={`${portfolio.name} profile`}
              width={220}
              height={280}
              className="profileImage"
              priority
            />
            <div className="ratingPanel">
              <h3>Competitive Ratings</h3>
              <a href={portfolio.ratings.atcoder.url} target="_blank" rel="noreferrer">
                AtCoder @{portfolio.ratings.atcoder.handle}
                <span>
                  {portfolio.ratings.atcoder.rating} (max {portfolio.ratings.atcoder.maxRating})
                </span>
              </a>
              <a href={portfolio.ratings.codeforces.url} target="_blank" rel="noreferrer">
                Codeforces @{portfolio.ratings.codeforces.handle}
                <span>
                  {portfolio.ratings.codeforces.rating} (max {portfolio.ratings.codeforces.maxRating})
                </span>
              </a>
            </div>
          </aside>
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
              {Array.isArray(item.desc)
                ? item.desc.map((line) => <p key={line}>{line}</p>)
                : <p>{item.desc}</p>}
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="cardSection">
        <h2>Contact</h2>
        <p>
          메일: <a href={portfolio.links.email}>hyenje29@gmail.com</a>
        </p>
        <p>
          GitHub: <a href={portfolio.links.github}>{portfolio.links.github}</a>
        </p>
      </section>
    </main>
  );
}
