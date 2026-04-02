import Image from "next/image";
import Link from "next/link";
import { portfolio } from "@/data/portfolio";
import { getAtCoderTone, getCodeforcesTone, getCompetitiveRatings } from "@/lib/ratings";
import { buildSvgPaths } from "@/lib/chart";

export default async function HomePage() {
  const ratings = await getCompetitiveRatings(portfolio.ratings);
  const atcoderTone = getAtCoderTone(ratings.atcoder.rating);
  const codeforcesTone = getCodeforcesTone(ratings.codeforces.rating);
  const intro = portfolio.sections.about.split("\n");

  const atcoderChart = buildSvgPaths(ratings.atcoder.history);
  const codeforcesChart = buildSvgPaths(ratings.codeforces.history);

  return (
    <main className="container homePage">
      <div className="blobWrap" aria-hidden="true">
        <div className="blob blob1" />
        <div className="blob blob2" />
        <div className="blob blob3" />
        <div className="blob blob4" />
        <div className="blob blob5" />
        <div className="blob blob6" />
      </div>

      <header className="hero" data-fade>
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
              {portfolio.heroNotes.map((note) => (
                <span key={note}>{note}</span>
              ))}
            </div>
            <div className="ctaRow heroActions">
              <a href={portfolio.links.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={portfolio.links.email}>Email</a>
              <Link href={portfolio.links.blog}>
                Blog
              </Link>
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
              <small>{portfolio.tagline}</small>
            </div>
          </aside>
        </div>
      </header>

      <section className="sectionGrid">
        <section id="about" className="cardSection featureCard" data-fade>
          <p className="sectionLabel">About</p>
          <h2>Quiet structure, steady shipping.</h2>
          {portfolio.sections.about.split("\n").map((line) => (
            <p key={line}>{line}</p>
          ))}
        </section>

        <section id="experience" className="cardSection featureCard" data-fade>
          <p className="sectionLabel">Experience</p>
          {portfolio.sections.experience.map((exp) => (
            <div key={exp.title} className="experienceItem">
              <h2>{exp.title}</h2>
              <p className="period">{exp.period}</p>
              <div className="experienceLines">
                {Array.isArray(exp.desc)
                  ? exp.desc.map((line) => <p key={line}>{line}</p>)
                  : <p>{exp.desc}</p>}
              </div>
            </div>
          ))}
        </section>
      </section>

      <section id="skills" className="cardSection" data-fade>
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
              <div className="ratingCardTop">
                <div>
                  <span className="ratingCardHandle">AtCoder @{ratings.atcoder.handle}</span>
                  <span className="ratingCardScore">
                    {ratings.atcoder.rating} <small>max {ratings.atcoder.maxRating}</small>
                  </span>
                  <span className="ratingCardLabel">{atcoderTone.label}</span>
                </div>
              </div>
              {atcoderChart.linePath && (
                <svg
                  className="ratingChart"
                  viewBox="0 0 360 80"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="grad-atcoder" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopOpacity="0.25" stopColor="currentColor" />
                      <stop offset="100%" stopOpacity="0" stopColor="currentColor" />
                    </linearGradient>
                  </defs>
                  <path d={atcoderChart.fillPath} fill="url(#grad-atcoder)" />
                  <path d={atcoderChart.linePath} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx={atcoderChart.lastX} cy={atcoderChart.lastY} r="4" fill="currentColor" />
                </svg>
              )}
            </a>
            <a
              href={ratings.codeforces.url}
              target="_blank"
              rel="noreferrer"
              className={`ratingCard ${codeforcesTone.className}`}
            >
              <div className="ratingCardTop">
                <div>
                  <span className="ratingCardHandle">Codeforces @{ratings.codeforces.handle}</span>
                  <span className="ratingCardScore">
                    {ratings.codeforces.rating} <small>max {ratings.codeforces.maxRating}</small>
                  </span>
                  <span className="ratingCardLabel">{codeforcesTone.label}</span>
                </div>
              </div>
              {codeforcesChart.linePath && (
                <svg
                  className="ratingChart"
                  viewBox="0 0 360 80"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="grad-codeforces" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopOpacity="0.25" stopColor="currentColor" />
                      <stop offset="100%" stopOpacity="0" stopColor="currentColor" />
                    </linearGradient>
                  </defs>
                  <path d={codeforcesChart.fillPath} fill="url(#grad-codeforces)" />
                  <path d={codeforcesChart.linePath} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx={codeforcesChart.lastX} cy={codeforcesChart.lastY} r="4" fill="currentColor" />
                </svg>
              )}
            </a>
          </div>
        </div>
      </section>

      <section id="projects" className="cardSection" data-fade>
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
              {project.tags?.length ? (
                <ul className="chipList projectTags">
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              ) : null}
              <a href={project.link} target="_blank" rel="noreferrer">
                View project
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="cardSection" data-fade>
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
          <Link href={portfolio.links.blog} className="contactItem">
            <span>Blog</span>
            <strong>hyenje29.click/blog</strong>
          </Link>
        </div>
      </section>
    </main>
  );
}
