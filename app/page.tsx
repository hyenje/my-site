import Image from "next/image";
import Link from "next/link";
import { portfolio } from "@/data/portfolio";
import { getAtCoderTone, getCodeforcesTone, getCompetitiveRatings } from "@/lib/ratings";

export default async function HomePage() {
  const ratings = await getCompetitiveRatings(portfolio.ratings);
  const atcoderTone = getAtCoderTone(ratings.atcoder.rating);
  const codeforcesTone = getCodeforcesTone(ratings.codeforces.rating);
  const intro = portfolio.sections.about.split("\n");

  return (
    <main className="container homePage">
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
            <p className="heroKicker">Competitive Programming · Writing</p>
            <h1 className="heroTitle">{portfolio.headline}</h1>
            <p className="heroIntro">{intro[0]}</p>
            <div className="heroNotes">
              <span>Ajou Univ · A.N.S.I</span>
              <span>AtCoder · Codeforces</span>
              <span>MDX Blog</span>
            </div>
            <div className="ctaRow heroActions">
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
            <div className="portraitCaption">
              <span>{portfolio.name}</span>
              <small>building calm, reliable tools and solving hard problems</small>
            </div>
          </aside>
        </div>
      </header>

      <section className="sectionGrid">
        <section id="about" className="cardSection featureCard">
          <p className="sectionLabel">About</p>
          <h2>Quiet structure, steady shipping.</h2>
          {portfolio.sections.about.split("\n").map((line) => (
            <p key={line}>{line}</p>
          ))}
        </section>

        <section id="experience" className="cardSection featureCard">
          <p className="sectionLabel">Experience</p>
          <h2>{portfolio.sections.experience[0].title}</h2>
          <p className="period">{portfolio.sections.experience[0].period}</p>
          <div className="experienceLines">
            {Array.isArray(portfolio.sections.experience[0].desc)
              ? portfolio.sections.experience[0].desc.map((line) => <p key={line}>{line}</p>)
              : <p>{portfolio.sections.experience[0].desc}</p>}
          </div>
        </section>
      </section>

      <section id="skills" className="cardSection">
        <div className="sectionIntro">
          <p className="sectionLabel">Skills</p>
          <h2>Core stack and competitive profile</h2>
        </div>
        <div className="skillsLayout">
          <ul className="chipList skillChips">
            {portfolio.sections.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
          <div className="ratingPanel ratingPanelInline">
            <h3>Competitive Ratings</h3>
            <a
              href={ratings.atcoder.url}
              target="_blank"
              rel="noreferrer"
              className={`ratingCard ${atcoderTone.className}`}
            >
              AtCoder @{ratings.atcoder.handle}
              <span>
                {ratings.atcoder.rating} (max {ratings.atcoder.maxRating})
              </span>
              <small>{atcoderTone.label}</small>
            </a>
            <a
              href={ratings.codeforces.url}
              target="_blank"
              rel="noreferrer"
              className={`ratingCard ${codeforcesTone.className}`}
            >
              Codeforces @{ratings.codeforces.handle}
              <span>
                {ratings.codeforces.rating} (max {ratings.codeforces.maxRating})
              </span>
              <small>{codeforcesTone.label}</small>
            </a>
          </div>
        </div>
      </section>

      <section id="projects" className="cardSection">
        <div className="sectionIntro">
          <p className="sectionLabel">Projects</p>
          <h2>Selected work</h2>
        </div>
        <div className="projectGrid">
          {portfolio.sections.projects.map((project, index) => (
            <article key={project.title} className="projectCard">
              <p className="projectIndex">{String(index + 1).padStart(2, "0")}</p>
              <h3>{project.title}</h3>
              <p>{project.desc}</p>
              <a href={project.link} target="_blank" rel="noreferrer">
                View project
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="cardSection">
        <div className="sectionIntro">
          <p className="sectionLabel">Contact</p>
          <h2>Open to thoughtful projects and conversations.</h2>
        </div>
        <div className="contactGrid">
          <a href={portfolio.links.email} className="contactItem">
            <span>Email</span>
            <strong>hyenje29@gmail.com</strong>
          </a>
          <a href={portfolio.links.github} className="contactItem" target="_blank" rel="noreferrer">
            <span>GitHub</span>
            <strong>github.com/hyenje</strong>
          </a>
          <a href={portfolio.links.blog} className="contactItem" target="_blank" rel="noreferrer">
            <span>Blog</span>
            <strong>blog.naver.com/hyenje29</strong>
          </a>
        </div>
      </section>
    </main>
  );
}
