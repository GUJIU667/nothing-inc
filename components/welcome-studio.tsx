"use client";

import { useMemo, useState } from "react";

function safe(value: string, fallback: string) { return value.trim().slice(0, 40) || fallback; }

export function WelcomeStudio() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [issued, setIssued] = useState(false);
  const displayName = safe(name, "YOUR NAME");
  const displayTitle = safe(title, "Chief Possibility Officer");
  const serial = useMemo(() => {
    const source = `${displayName}|${displayTitle}`;
    const code = Array.from(source).reduce((sum, char) => (sum * 31 + (char.codePointAt(0) ?? 0)) % 10000, 17);
    return `NØ-2026-${code.toString().padStart(4, "0")}`;
  }, [displayName, displayTitle]);

  function draw(kind: "offer" | "badge") {
    const canvas = document.createElement("canvas");
    const isOffer = kind === "offer";
    canvas.width = isOffer ? 1600 : 1080; canvas.height = isOffer ? 2100 : 680;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.fillStyle = isOffer ? "#f2f2ee" : "#0a0a0a"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = isOffer ? "#050505" : "#f4f4ef"; ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 3;
    const font = 'Arial, "Microsoft YaHei", sans-serif';
    if (isOffer) {
      ctx.strokeRect(90, 90, 1420, 1920); ctx.font = `700 54px ${font}`; ctx.fillText("NØ  NOTHING INC. / 无事集团", 145, 180);
      ctx.font = `22px ${font}`; ctx.fillText("VIRTUAL COMMUNITY · NOT REAL EMPLOYMENT", 145, 240);
      ctx.font = `700 118px ${font}`; ctx.fillText("OFFER", 145, 520);
      ctx.font = `30px ${font}`; ctx.fillText("Dear", 145, 720); ctx.font = `700 66px ${font}`; ctx.fillText(displayName, 145, 800);
      ctx.font = `30px ${font}`; ctx.fillText("We are delighted to offer you the self-selected title of", 145, 920);
      ctx.font = `700 54px ${font}`; ctx.fillText(displayTitle, 145, 1010);
      ctx.font = `30px ${font}`; ctx.fillText("Your start date is now. Your possibilities are infinite.", 145, 1150);
      ctx.fillText("No office. No hierarchy. No employment relationship.", 145, 1210);
      ctx.font = `italic 48px Georgia`; ctx.fillText("Do Nothing. Be Everything.", 145, 1460);
      ctx.font = `24px ${font}`; ctx.fillText(`SERIAL  ${serial}`, 145, 1840); ctx.fillText("A CREATIVE KEEPSAKE ONLY / 仅作数字纪念", 145, 1900);
    } else {
      ctx.strokeRect(36, 36, 1008, 608); ctx.font = `700 46px ${font}`; ctx.fillText("NØ", 84, 112);
      ctx.font = `20px ${font}`; ctx.fillText("NOTHING INC. / 无事集团", 174, 105);
      ctx.font = `700 70px ${font}`; ctx.fillText(displayName, 84, 310);
      ctx.font = `30px ${font}`; ctx.fillText(displayTitle, 84, 372);
      ctx.font = `20px ${font}`; ctx.fillText(serial, 84, 550); ctx.fillText("VIRTUAL MEMBER", 800, 550);
    }
    canvas.toBlob((blob) => {
      if (!blob) return;
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `nothing-inc-${kind}.png`;
      link.href = href;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(href), 1000);
    }, "image/png");
  }

  return (
    <section className="studio section-pad">
      <div className="studio-form">
        <div className="section-kicker">VIRTUAL ONBOARDING</div><h2>Make it official—<br />in the least official way.</h2>
        <label>YOUR NAME / 姓名<input value={name} onChange={e => setName(e.target.value)} maxLength={40} placeholder="e.g. Zhang San" /></label>
        <label>YOUR SELF-SELECTED TITLE / 自选称谓<input value={title} onChange={e => setTitle(e.target.value)} maxLength={40} placeholder="e.g. Chief Daydreaming Officer" /></label>
        <label className="check"><input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} /><span>我理解这是虚拟社区体验，不是真实招聘或雇佣关系。</span></label>
        <button className="button button-dark" disabled={!agreed} onClick={() => setIssued(true)}>Issue my virtual offer</button>
        <p className="privacy">🔒 本页不发送或保存你的输入。PNG 在你的设备上即时生成。</p>
      </div>
      <div className="offer-preview" aria-live="polite">
        <div className="offer-paper"><div className="offer-top"><b>NØ</b><span>NOTHING INC.<br />无事集团</span></div><small>VIRTUAL OFFER · NOT REAL EMPLOYMENT</small><h3>OFFER</h3><p>Dear</p><strong>{displayName}</strong><p>We are delighted to offer you the self-selected title of</p><h4>{displayTitle}</h4><p>Your start date is now. Your possibilities are infinite.</p><em>Do Nothing. Be Everything.</em><footer>{serial}<span>CREATIVE KEEPSAKE ONLY</span></footer></div>
        {issued && <div className="download-panel"><p>Welcome to Nothing. / 欢迎加入无事。</p><button onClick={() => draw("offer")}>Download Offer PNG</button><button onClick={() => draw("badge")}>Download Employee Badge PNG</button></div>}
      </div>
    </section>
  );
}
