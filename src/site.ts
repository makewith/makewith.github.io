export const siteName = "makewith";
// void.config.ts builds titleTemplate from this, and og.ts takes it back off
// og:title, since og:site_name already carries the name.
export const titleSuffix = ` | ${siteName}`;
export const siteUrl = "https://makewith.jp";
// The home page heading breaks the tagline after the comma; the footer runs it on one line.
export const taglineLines = ["つくる人が集まり、", "つくり続ける場所。"] as const;
export const tagline = taglineLines.join("");
// The meetup photo stands for the place itself, so only pages about the
// place use it; a record shows its own image or none.
export const placeImage = "/images/mokumoku-past.jpg";
export const placeImagePaths = ["/", "/about/"];

// GitHub Pages serves each page as a directory index, so the trailing slash
// form is the canonical URL and avoids a redirect.
export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about/", label: "About" },
  { href: "/making/", label: "Making" },
];
