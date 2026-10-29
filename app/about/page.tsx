import { SiteShell } from "@/components/site-shell";

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="page-hero">
        <p className="overline">ABOUT / 关于无事</p>
        <h1>THE COMPANY<br />OF <em>NOTHING.</em></h1>
        <p className="page-intro">A virtual organization built for people who prefer possibility over permission.</p>
      </section>

      <section className="about-statement section">
        <p className="overline">THE NON-MANIFESTO</p>
        <h2>WE DO NOT MANAGE PEOPLE.<br />WE MAKE ROOM FOR THEM.</h2>
        <p>Nothing Inc. is a virtual creative community. We have no office, attendance system, salary, legal officers, or management layer. What we do have is an open invitation to choose your own title and make something unexpected.</p>
      </section>

      <section className="about-principles section">
        <article><span>MISSION</span><h2>Creating Infinite Possibilities.</h2><p>创造无限可能。Give unfinished ideas enough room to become real.</p></article>
        <article><span>VISION</span><h2>Making work a choice, and freedom a way of life.</h2><p>让工作成为选择，让自由成为生活方式。</p></article>
        <article><span>ORGANIZATIONAL PHILOSOPHY</span><h2>One Level. Infinite Titles.</h2><p>所有成员拥有平等身份。CEO 与实习生只是在同一水平线上选择了不同称谓。</p></article>
      </section>

      <section className="equality-section section">
        <div><span>CEO</span><span>01</span></div><div><span>EMPLOYEE</span><span>01</span></div><div><span>INTERN</span><span>01</span></div>
        <p>Different names. Equal standing. Titles at Nothing Inc. express identity—not legal authority, seniority, or an employment relationship.</p>
      </section>

      <section className="final-cta section">
        <p className="overline">NO VACANCIES. INFINITE OPENINGS.</p>
        <h2>CHOOSE YOUR<br />OWN TITLE.</h2>
        <a className="action-button inline-action inverted" href="/careers#join">BECOME ANYTHING ↗</a>
      </section>
    </SiteShell>
  );
}
