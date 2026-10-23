import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

const projects = [
  {
    name: 'miyatees',
    category: 'smart contracts',
    year: '2025',
    description:
      'An on-chain NFT auction with reserve prices, increasing bids, and settlement in Solidity.',
    detail:
      'The contract tracks the leading bid, refunds the previous bidder, and transfers the NFT to the winner at settlement.',
    stack: 'Solidity / EVM / Foundry',
  },
  {
    name: 'gas-station-service',
    category: 'backend systems',
    year: '2025',
    description:
      'Automatic gas top-ups for NFT holders whose native-token balance falls below a configured threshold.',
    detail:
      'Balance checks and transfers run through BullMQ workers. Redis tracks cooldowns between top-ups; NFT-transfer webhooks trigger checks for new holders.',
    stack: 'TypeScript / Ethers.js / BullMQ / Redis',
  },
  {
    name: 'fitcheck',
    category: 'backend systems',
    year: '2024',
    description:
      'A fashion-marketplace backend for wardrobes, outfit recommendations, and real-time bidding.',
    detail:
      'Combines visual similarity search with CLIP and FAISS, background jobs, and WebSocket notifications.',
    stack: 'Python / Flask / PostgreSQL / FAISS',
  },
]

const stack = [
  ['languages', 'TypeScript, Rust, Solidity, Python'],
  ['backend', 'Node.js, Express, Flask, Redis'],
  ['blockchain', 'Anchor, Foundry, Ethers.js'],
  ['data & storage', 'PostgreSQL, Redis, AWS S3'],
  ['tooling', 'Docker, Git, Linux'],
]

function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme ?? null,
  )
  const [systemDark, setSystemDark] = useState(
    () => matchMedia('(prefers-color-scheme: dark)').matches,
  )
  const dark = theme ? theme === 'dark' : systemDark

  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)')
    const update = () => setSystemDark(media.matches)
    media.addEventListener('change', update)
    update()
    return () => media.removeEventListener('change', update)
  }, [])

  function toggleTheme() {
    const next = dark ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('darkTheme', String(!dark))
    } catch {
      /* The toggle still works without storage. */
    }
  }

  return (
    <button
      className="theme-btn"
      type="button"
      onClick={toggleTheme}
      aria-label={`${dark ? 'Dark' : 'Light'} theme. Switch to ${dark ? 'light' : 'dark'} theme`}
    >
      <span className="theme-icon" aria-hidden="true">
        ◐
      </span>
      <span>{dark ? 'light' : 'dark'}</span>
    </button>
  )
}

function SelectedWork() {
  return (
    <section
      className="section"
      id="projects"
      aria-labelledby="projects-heading"
    >
      <div className="section-heading">
        <h2 id="projects-heading">selected work</h2>
        <p className="eyebrow">2024 — 2025</p>
      </div>
      <ol>
        {projects.map((project, index) => (
          <li className="project" key={project.name}>
            <div className="project-meta">
              <span className="project-number" aria-hidden="true">
                0{index + 1}
              </span>
              <span>{project.category}</span>
              <span>{project.year}</span>
            </div>
            <div>
              <h3>
                <motion.a
                  href={`https://github.com/sudotx/${project.name}`}
                  target="_blank"
                  rel="noopener"
                  initial="rest"
                  whileHover="hover"
                  whileFocus="hover"
                >
                  {project.name}{' '}
                  <motion.span
                    className="arrow"
                    aria-hidden="true"
                    variants={{ rest: { x: 0, y: 0 }, hover: { x: 3, y: -3 } }}
                    transition={{ duration: 0.18 }}
                  >
                    ↗
                  </motion.span>
                </motion.a>
              </h3>
              <p className="project-desc">{project.description}</p>
              <p className="project-detail">{project.detail}</p>
              <p className="project-stack">{project.stack}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="more-work">
        <h3>also built</h3>
        <ul>
          <li className="compact-project">
            <a
              href="https://github.com/sudotx/anchor-token-whitelist"
              target="_blank"
              rel="noopener"
            >
              anchor-token-whitelist ↗
            </a>
            <p>
              Token access control for Solana programs. Rust / Anchor · 2024
            </p>
          </li>
          <li className="compact-project">
            <a
              href="https://github.com/sudotx/jobs-program"
              target="_blank"
              rel="noopener"
            >
              jobs-program ↗
            </a>
            <p>
              On-chain job posting, escrow, and settlement in SOL and SPL
              tokens. Rust / Anchor · 2023
            </p>
          </li>
        </ul>
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section
      id="experience"
      className="section split-section"
      aria-labelledby="experience-heading"
    >
      <h2 id="experience-heading">experience</h2>
      <ul>
        <li className="experience-entry">
          <h3>technical writer</h3>
          <p className="entry-meta">independent · Jan 2025 – present</p>
          <p>
            Writing about dev tooling, software invariants, and attack vectors
            such as slippage manipulation.
          </p>
          <a
            className="text-link"
            href="https://medium.com/@txcca"
            target="_blank"
            rel="noopener"
          >
            writing on Medium ↗
          </a>
        </li>
        <li className="experience-entry">
          <h3>open source contributor</h3>
          <p className="entry-meta">May 2024 – present</p>
          <p>
            Contributed to an EVM hacks root cause analysis database tracking
            exploits across EVM ecosystems.
          </p>
          <a
            className="text-link"
            href="https://github.com/sudotx"
            target="_blank"
            rel="noopener"
          >
            GitHub profile & contributions ↗
          </a>
        </li>
        <li className="experience-entry">
          <h3>blockchain developer · IvoryPay</h3>
          <p className="entry-meta">Aug 2023 – Nov 2023</p>
        </li>
        <li className="experience-entry">
          <h3>backend developer · XJOBS</h3>
          <p className="entry-meta">Jan 2022 – Mar 2023</p>
          <p>
            Maintained a Solana-based payment system handling SOL and SPL token
            transactions between freelancers and clients.
          </p>
        </li>
      </ul>
    </section>
  )
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="masthead">
        <div className="page masthead-inner">
          <a
            className="brand"
            href="#top"
            aria-label="dot / 0x4c — back to top"
          >
            0x4c<span aria-hidden="true">.</span>
          </a>
          <nav className="section-nav" aria-label="Sections">
            <ul className="nav-links">
              <li>
                <a href="#projects">work</a>
              </li>
              <li>
                <a href="#experience">experience</a>
              </li>
              <li>
                <a href="#stack">stack</a>
              </li>
              <li>
                <a href="#contact">contact</a>
              </li>
            </ul>
          </nav>
          <div className="utilities">
            <a href="https://github.com/sudotx" target="_blank" rel="noopener">
              github ↗
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main id="main" className="page" tabIndex={-1}>
        <section className="intro" aria-labelledby="about">
          <div>
            <h1 id="about">about me</h1>
            <p className="opening">AFK AF</p>
            <b className="manifesto">TƎᴎA⅃ꟼ ƎHT KↃAH</b>
          </div>
          <div className="identity">
            <img
              src="https://github.com/sudotx.png"
              alt="dot’s spiral-eyed cat avatar"
              className="avatar"
              width="84"
              height="84"
            />
            <div className="identity-copy">
              <p className="name">dot</p>
              <p className="handle">@sudotx</p>
              <p className="curiosity">Ever curious</p>
              <a href="https://t.me/sudotx" target="_blank" rel="noopener">
                telegram ↗
              </a>
            </div>
          </div>
        </section>
        <SelectedWork />
        <Experience />
        <section
          id="stack"
          className="section split-section"
          aria-labelledby="stack-heading"
        >
          <h2 id="stack-heading">stack</h2>
          <ul>
            {stack.map(([category, values]) => (
              <li className="skill-row" key={category}>
                <span className="skill-cat">{category}</span>
                <span className="skill-vals">{values}</span>
              </li>
            ))}
          </ul>
        </section>
        <section
          id="contact"
          className="section contact"
          aria-labelledby="contact-heading"
        >
          <h2 id="contact-heading">
            open to working on
            <br />
            interesting problems.
          </h2>
          <div className="contact-links">
            <a href="https://t.me/sudotx" target="_blank" rel="noopener">
              let’s talk on Telegram ↗
            </a>
            <a href="https://github.com/sudotx" target="_blank" rel="noopener">
              github ↗
            </a>
          </div>
        </section>
        <footer className="footer">
          <span>dot / sudotx / 0x4c</span>
          <a href="#top">back to top ↑</a>
        </footer>
      </main>
    </>
  )
}
