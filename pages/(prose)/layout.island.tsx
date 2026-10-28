import type { ReactNode } from "react";

export default function ProseLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <article className="prose">{children}</article>
    </main>
  );
}
