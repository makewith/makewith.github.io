import type { ReactNode } from "react";
import { navItems, tagline } from "../site";

function Nav() {
  return (
    <nav>
      <ul className="nav">
        {navItems.map((item) => (
          <li key={item.href}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// The brand's logotype: only "with" takes the makewith accent color.
function Wordmark() {
  return (
    <span>
      make<span className="site-name-accent">with</span>
    </span>
  );
}

export default function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <div className="site">
      <header className="site-header">
        <a href="/" className="site-name">
          <picture className="site-mark">
            <source srcSet="/brand/makewith-mark-reverse.svg" media="(prefers-color-scheme: dark)" />
            <img src="/brand/makewith-mark.svg" alt="" width="44" height="41" />
          </picture>
          <Wordmark />
        </a>
        <Nav />
      </header>
      {children}
      <footer className="site-footer">
        <div className="brand">
          <a href="/" className="site-name">
            <Wordmark />
          </a>
          <span className="tagline">{tagline}</span>
        </div>
        <Nav />
      </footer>
    </div>
  );
}
