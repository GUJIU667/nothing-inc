import { JoinForm } from "@/components/join-form";
import { SiteShell } from "@/components/site-shell";

export default function CareersPage() {
  return (
    <SiteShell>
      <section className="page-hero careers-page-hero">
        <p className="overline">CAREERS / ONE-CLICK ONBOARDING</p>
        <h1>YOUR CAREER.<br /><em>YOUR RULES.</em></h1>
        <p className="page-intro">No Resume. No Interview. No Rejection.</p>
        <div className="career-facts"><span>NO ACCOUNT</span><span>NO CV</span><span>NO HIERARCHY</span></div>
      </section>
      <section className="join-section section" id="join">
        <div className="join-heading"><p className="overline">BECOME ANYTHING</p><h2>CHOOSE A NAME.<br />CHOOSE A TITLE.</h2><p>That is the entire application.</p></div>
        <JoinForm />
      </section>
    </SiteShell>
  );
}
