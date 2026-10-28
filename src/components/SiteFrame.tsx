import type { ReactNode } from "react";
import { navItems, siteName, tagline } from "../site";

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

export default function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <div className="site">
      <header className="site-header">
        <a href="/" className="site-name">
          {siteName}
        </a>
        <Nav />
      </header>
      {children}
      <footer className="site-footer">
        <div className="brand">
          <a href="/" className="site-name">
            {siteName}
          </a>
          <span className="tagline">{tagline}</span>
        </div>
        <Nav />
      </footer>
    </div>
  );
}
