import Link from "next/link";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-frame">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="disclaimer" role="note">VIRTUAL COMMUNITY · 非真实公司或雇佣关系 / NOT REAL EMPLOYMENT</div>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Nothing Inc. home"><span className="brand-mark">NØ</span><span>无事集团<br /><small>NOTHING INC.</small></span></Link>
        <nav aria-label="Primary navigation"><Link href="/about">ABOUT</Link><Link href="/careers">CAREERS*</Link><Link href="/welcome">WELCOME</Link></nav>
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <div><strong>NOTHING INC.</strong><span>无事集团 / 虚拟创意社区</span></div>
        <p>Do Nothing. Be Everything.</p>
        <small>© {new Date().getFullYear()} Nothing Inc. No tracking. No database. No real employment.</small>
      </footer>
    </div>
  );
}
