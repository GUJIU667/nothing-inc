import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="page-hero grid-noise"><p className="eyebrow">ABOUT / 关于无事</p><h1>We are serious<br />about <em>nothing.</em></h1></section>
      <section className="editorial section-pad">
        <div className="section-kicker">THE NON-MANIFESTO</div>
        <div className="editorial-copy">
          <h2>无事，不是无所事事。</h2>
          <p className="lead">它是一块没有 KPI、层级和标准答案的开放空间。</p>
          <p>Nothing Inc.（无事集团）是一个虚拟创意社区。任何人都可以选择自己的称谓，带着尚未完成的想法加入，在不被“应该”定义的地方，试着创造一点新的可能。</p>
          <p>我们没有办公室、考勤、薪酬、劳动合同或管理层。本站生成的 Offer 与员工卡均为纪念性数字作品，不构成真实录用、劳动或商业关系。</p>
        </div>
      </section>
      <section className="facts section-pad">
        <div><b>∞</b><span>POSSIBILITIES<br />可能性</span></div><div><b>0</b><span>LAYERS<br />管理层级</span></div><div><b>100%</b><span>SELF-SELECTED<br />自选称谓</span></div>
      </section>
      <section className="closing-cta"><h2>没有职位空缺。<br />只有你还没命名的角色。</h2><Link className="button button-light" href="/welcome">Name yours</Link></section>
    </SiteShell>
  );
}
