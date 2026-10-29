import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { WelcomeStudio } from "@/components/welcome-studio";

export const metadata: Metadata = { title: "Welcome" };

export default function WelcomePage() {
  return <SiteShell><section className="page-hero compact grid-noise"><p className="eyebrow">WELCOME / 欢迎无事发生</p><h1>Choose a title.<br /><em>Become nothing.</em></h1></section><WelcomeStudio /></SiteShell>;
}
