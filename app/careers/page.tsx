import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = { title: "Careers" };
const roles = ["Chief Daydreaming Officer", "Director of Unfinished Ideas", "首席发呆官", "Head of Beautiful Mistakes"];

export default function CareersPage() {
  return (
    <SiteShell>
      <section className="page-hero careers-hero grid-noise"><p className="eyebrow">CAREERS* / 虚拟入职</p><h1>Zero openings.<br /><em>Infinite roles.</em></h1><p>*“Careers” is a creative experience, not recruitment.</p></section>
      <section className="roles section-pad"><div className="section-kicker">SOME TITLES WE NEVER POSTED</div><div className="role-list">{roles.map((role, i) => <div key={role}><span>0{i + 1}</span><h2>{role}</h2><small>SELF-APPOINTED</small></div>)}</div></section>
      <section className="process section-pad"><div className="section-kicker">HOW NOT TO APPLY</div><ol><li><b>01</b><span>Write your name<br /><small>写下你的名字</small></span></li><li><b>02</b><span>Invent a title<br /><small>发明一个称谓</small></span></li><li><b>03</b><span>Receive instantly<br /><small>即时获得虚拟 Offer</small></span></li></ol></section>
      <section className="notice"><strong>重要说明 / IMPORTANT</strong><p>无事集团是虚拟社区。生成内容仅供娱乐与自我表达，不代表真实公司、招聘、雇佣、薪酬或劳动关系。你输入的内容只在当前浏览器内处理，不会提交到服务器。</p></section>
      <section className="closing-cta"><h2>Ready to be<br />officially unofficial?</h2><Link className="button button-light" href="/welcome">Create my virtual offer</Link></section>
    </SiteShell>
  );
}
