import { Suspense } from "react";
import { CredentialStudio } from "@/components/credential-studio";
import { SiteShell } from "@/components/site-shell";

export default function WelcomePage() {
  return <SiteShell><Suspense fallback={<div className="credential-loading">PREPARING NOTHING…</div>}><CredentialStudio /></Suspense></SiteShell>;
}
