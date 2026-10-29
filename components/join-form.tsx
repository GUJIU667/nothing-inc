"use client";

import { FormEvent, useState } from "react";

const roles = [
  "CEO",
  "President",
  "VP of Human Resources",
  "Chief Nothing Officer",
  "Software Engineer",
  "Intern",
  "Employee",
];

export function JoinForm() {
  const [nickname, setNickname] = useState("");
  const [role, setRole] = useState("Chief Nothing Officer");
  const [customRole, setCustomRole] = useState("");
  const [error, setError] = useState("");
  const [hired, setHired] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    setHired(true);
    const params = new URLSearchParams({ name: cleanName, role: chosenRole, joined: new Date().toISOString().slice(0, 10) });
    window.setTimeout(() => window.location.assign(`/welcome?${params.toString()}`), 850);
  }

  return (
    <form className="join-form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="nickname">NICKNAME / 昵称</label>
        <input id="nickname" name="nickname" value={nickname} onChange={(event) => setNickname(event.target.value)} maxLength={24} autoComplete="nickname" placeholder="How should Nothing know you?" aria-describedby={error ? "join-error" : undefined} />
      </div>
      <fieldset>
        <legend>CHOOSE YOUR TITLE / 选择职位</legend>
        <div className="role-grid">
          {roles.map((item) => <label className={role === item ? "role-option selected" : "role-option"} key={item}><input type="radio" name="role" value={item} checked={role === item} onChange={() => setRole(item)} /><span>{item}</span></label>)}
          <label className={role === "CUSTOM" ? "role-option selected" : "role-option"}><input type="radio" name="role" value="CUSTOM" checked={role === "CUSTOM"} onChange={() => setRole("CUSTOM")} /><span>Custom Title / 自定义</span></label>
        </div>
      </fieldset>
      {role === "CUSTOM" && <div className="field custom-field"><label htmlFor="custom-role">YOUR TITLE / 你的职位</label><input id="custom-role" value={customRole} onChange={(event) => setCustomRole(event.target.value)} maxLength={42} placeholder="Invent something reasonable" /></div>}
      <div className="equal-note"><span>ONE LEVEL</span><p>CEO, intern, and every title in between share the same level. Titles express identity, not authority.</p></div>
      {error && <p className="form-error" id="join-error" role="alert">{error}</p>}
      <button className="action-button" type="submit" disabled={hired}>{hired ? "CONGRATULATIONS — YOU'RE HIRED" : "ONE-CLICK ONBOARDING ↗"}</button>
      <p className="legal-note">No account. No résumé. No interview. This creates a virtual community keepsake, not an employment contract or legal appointment.</p>
    </form>
  );
}
