import { SiteShell } from "@/components/site-shell";

const pillars = [
  { number: "01", label: "MISSION", title: "Creating Infinite Possibilities.", copy: "We leave enough space for ideas that do not have names yet." },
  { number: "02", label: "STRUCTURE", title: "One Level. Infinite Titles.", copy: "Every member is equal. A title describes you; it never ranks you." },
  { number: "03", label: "FREEDOM", title: "Your Title. Your Choice.", copy: "No résumé, interview, or permission required. Choose what you want to become." },
];

export default function Home() {
  return (
    <SiteShell>
      <section className="home-hero">
        <div className="hero-signal" aria-hidden="true"><span>N</span><span>Ø</span></div>
        <p className="overline reveal-up">NOTHING INC. / 无事集团</p>
        <h1 className="reveal-up delay-1">THE FUTURE<br />IS <em>NOTHING.</em></h1>
        <div className="hero-bottom reveal-up delay-2">
          <div><p className="manifesto">Do Nothing. Be Everything.</p><span>Your title. Your choice. Infinite possibilities.</span></div>
          <a className="action-button inline-action" href="/careers#join">BECOME ANYTHING ↗</a>
        </div>
        <div className="scroll-cue">SCROLL TO NOTHING <i /></div>
      </section>

      <section className="brand-thesis section">
        <p className="overline">THE IDEA</p>
        <h2>NOTHING IS NOT<br />THE ABSENCE OF <span>EVERYTHING.</span></h2>
        <div className="split-copy"><p>It is the absence of limits.</p><p>无事，不是无所事事。它是一块没有标准答案、没有等级秩序、也没有必须成为谁的开放空间。</p></div>
      </section>

      <section className="pillar-list section" aria-label="Nothing Inc. principles">
        {pillars.map((pillar) => <article key={pillar.number}><span>{pillar.number}</span><small>{pillar.label}</small><h3>{pillar.title}</h3><p>{pillar.copy}</p></article>)}
      </section>

      <section className="zero-hierarchy section">
        <p className="overline">ORGANIZATION CHART</p>
        <div className="equal-line"><span>CEO</span><i /><span>INTERN</span><i /><span>YOU</span></div>
        <h2>ZERO HIERARCHY.<br />TOTAL POSSIBILITY.</h2>
        <p>CEO and intern are different titles on the same line. Authority is not included.</p>
        <a className="text-arrow" href="/about">EXPLORE THE PHILOSOPHY ↗</a>
      </section>

      <section className="final-cta section">
        <p className="overline">ONE CLICK. ZERO INTERVIEWS.</p>
        <h2>WHAT WILL<br />YOU BECOME?</h2>
        <a className="action-button inline-action inverted" href="/careers#join">JOIN NOTHING INC. ↗</a>
      </section>
    </SiteShell>
  );
}
