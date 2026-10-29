import { SiteHeader } from "@/components/site-header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-frame">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="disclaimer" role="note">A VIRTUAL COMMUNITY · NOT REAL EMPLOYMENT / 非真实雇佣关系</div>
      <SiteHeader />
      <main id="main">{children}</main>
      <footer className="site-footer">
        <div><strong>NOTHING INC.</strong><span>无事集团 · A VIRTUAL COMMUNITY</span></div>
        <nav aria-label="Footer navigation"><a href="/about">About</a><a href="/careers">Careers</a><a href="/careers#join">Join Us</a></nav>
        <p>Do Nothing. Be Everything.</p>
        <small>© {new Date().getFullYear()} Nothing Inc. No tracking. No database. Virtual membership only.</small>
      </footer>
    </div>
  );
}
