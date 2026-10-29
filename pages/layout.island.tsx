import type { ReactNode } from "react";
import SiteFrame from "#src/components/SiteFrame";
import "./style.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <SiteFrame>{children}</SiteFrame>;
}
