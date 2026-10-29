"use client";

import { FormEvent, useRef, useState } from "react";

const roles = [
  { title: "CEO", zh: "首席执行官", description: "Sets the direction. Everyone else remains equally in charge." },
  { title: "Chief Slacking Officer", zh: "首席摸鱼官", description: "Advances the disciplined practice of appearing thoughtfully unavailable." },
  { title: "Chief Nothing Officer", zh: "首席无事官", description: "Protects Nothing from the unnecessary introduction of Something." },
  { title: "Global Sleep Director", zh: "全球睡眠战略总监", description: "Coordinates rest across borders, time zones, and calendar invitations." },
  { title: "VP of Doing Nothing", zh: "无所事事业部副总裁", description: "Scales inactivity with executive precision and measurable calm." },
  { title: "Chief Financial Freedom Officer", zh: "首席财富自由官", description: "Maintains an ambitious portfolio of zero-dollar opportunities." },
  { title: "Head of Talent Rejection", zh: "人才拒绝事务负责人", description: "Rejects rejection and welcomes every qualified human immediately." },
  { title: "Chief Unemployment Officer", zh: "首席失业官", description: "Leads the strategic transition from busy to meaningfully unoccupied." },
  { title: "Director of Strategic Procrastination", zh: "战略拖延总监", description: "Ensures every urgent matter receives the delay it deserves." },
  { title: "Chief Work-Life Balance Officer", zh: "首席工作生活平衡官", description: "Keeps the balance firmly weighted toward life." },
  { title: "Intern", zh: "实习生", description: "Holds exactly the same organizational level as the CEO." },
] as const;

export function JoinForm() {
  const [nickname, setNickname] = useState("");
  const [role, setRole] = useState("CEO");
  const [customRole, setCustomRole] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hired, setHired] = useState(false);
  const applicationId = useRef<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || hired) return;

    const cleanName = nickname.trim().replace(/\s+/g, " ");
    const chosenRole = role === "CUSTOM" ? customRole.trim().replace(/\s+/g, " ") : role;

    if (cleanName.length < 2 || cleanName.length > 24) {
      setError("请输入 2–24 个字符的昵称 / Enter a nickname between 2 and 24 characters.");
      return;
    }
    if (!chosenRole || chosenRole.length < 2 || chosenRole.length > 42) {
      setError("请输入 2–42 个字符的职位 / Enter a title between 2 and 42 characters.");
      return;
    }
    if (!/^[\p{L}\p{N}\p{M} .,'’&()\-·]+$/u.test(cleanName) || !/^[\p{L}\p{N}\p{M} .,'’&()\-·]+$/u.test(chosenRole)) {
      setError("请仅使用文字、数字和常见标点 / Please use letters, numbers, spaces, and basic punctuation.");
      return;
    }

    setError("");
    setSubmitting(true);
    applicationId.current ??= crypto.randomUUID();

    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: applicationId.current, name: cleanName, role: chosenRole, custom: role === "CUSTOM" }),
      });
      const result = await response.json() as { member?: { applicationId: string }; error?: string };
      if (!response.ok || !result.member) {
        if (response.status === 409) applicationId.current = null;
        throw new Error(result.error || "Application could not be completed.");
      }

      setHired(true);
      window.setTimeout(() => window.location.assign(`/welcome?application=${encodeURIComponent(result.member.applicationId)}`), 650);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nothing encountered something. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form className="join-form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="nickname">NICKNAME / 昵称</label>
        <input id="nickname" name="nickname" value={nickname} onChange={(event) => setNickname(event.target.value)} maxLength={24} autoComplete="nickname" placeholder="How should Nothing know you?" aria-describedby={error ? "join-error" : undefined} />
      </div>
      <fieldset>
        <legend>CHOOSE YOUR TITLE / 选择职位</legend>
        <div className="role-list">
          {roles.map((item) => (
            <label className={role === item.title ? "role-option selected" : "role-option"} key={item.title}>
              <input type="radio" name="role" value={item.title} checked={role === item.title} onChange={() => setRole(item.title)} />
              <span><strong>{item.title}</strong><small>{item.zh}</small><em>{item.description}</em></span>
            </label>
          ))}
          <label className={role === "CUSTOM" ? "role-option selected" : "role-option"}>
            <input type="radio" name="role" value="CUSTOM" checked={role === "CUSTOM"} onChange={() => setRole("CUSTOM")} />
            <span><strong>Custom Title</strong><small>自定义职位</small><em>Invent a reasonable identity that HR never thought to reject.</em></span>
          </label>
        </div>
      </fieldset>
      {role === "CUSTOM" && <div className="field custom-field"><label htmlFor="custom-role">YOUR TITLE / 你的职位</label><input id="custom-role" value={customRole} onChange={(event) => setCustomRole(event.target.value)} maxLength={42} placeholder="Invent something reasonable" /></div>}
      <div className="vacancy-strip"><span>REMOTE</span><span>$0 / YEAR</span><span>UNLIMITED VACANCIES</span></div>
      <div className="equal-note"><span>ONE LEVEL</span><p>Every title is an equal virtual community identity. CEO and intern carry no organizational rank or legal authority.</p></div>
      {error && <p className="form-error" id="join-error" role="alert">{error}</p>}
      <button className="action-button" type="submit" disabled={submitting || hired}>{hired ? "CONGRATULATIONS — YOU'RE HIRED" : submitting ? "ALLOCATING YOUR NUMBER…" : "ONE-CLICK ONBOARDING ↗"}</button>
      <p className="legal-note">No account. No résumé. No interview. This creates a virtual community keepsake, not an employment contract or legal appointment.</p>
    </form>
  );
}
