import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

const principles = [
  ["01", "No ranks", "没有上下级，只有正在发生的想法。"],
  ["02", "Choose your title", "你的称谓由你定义，也可以随时改变。"],
  ["03", "Make nothing useful", "不以产出证明存在，但欢迎一切真实创造。"],
];

export default function Home() {
  return (
    <SiteShell>
      <section className="hero grid-noise">
        <div className="hero-orbit" aria-hidden="true" />
        <p className="eyebrow">无事集团 · NOTHING INC. / EST. NOW</p>
        <h1>Do Nothing.<br /><span>Be Everything.</span></h1>
        <p className="hero-copy">一家不生产答案的虚拟集团。我们聚集好奇的人，创造无限可能。<br /><span>Creating Infinite Possibilities.</span></p>
        <div className="hero-actions">
          <Link className="button button-light" href="/welcome">加入无事 / Enter</Link>
          <Link className="text-link" href="/about">Read the non-manifesto ↗</Link>
        </div>
        <div className="hero-index" aria-hidden="true">N° 000</div>
      </section>
      <section className="statement section-pad" aria-labelledby="mission-heading">
        <div className="section-kicker">OUR ONLY MISSION</div>
        <h2 id="mission-heading">Creating Infinite<br />Possibilities.</h2>
        <p>我们相信，最有价值的事常常开始于“无事可做”。</p>
      </section>
      <section className="principles section-pad" aria-label="Community principles">
        {principles.map(([index, title, copy]) => <article className="principle" key={index}><span>{index}</span><h3>{title}</h3><p>{copy}</p></article>)}
      </section>
      <section className="reveal section-pad">
        <p className="eyebrow dark">A COMPANY WITH NOTHING TO HIDE</p>
        <h2>职位是自选的。<br />Offer 是即时的。<br />自由是真的。</h2>
        <Link className="button button-dark" href="/careers">Browse zero openings</Link>
      </section>
    </SiteShell>
  );
}
