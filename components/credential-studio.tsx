"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type Credential = { name: string; role: string; joined: string; id: string };
type CanvasKind = "offer" | "badge";

const fontStack = '"Geist","Inter","Noto Sans SC","Microsoft YaHei",Arial,sans-serif';

function clean(value: string | null, max: number) {
  return (value ?? "").trim().replace(/\s+/g, " ").slice(0, max);
}

function formatDate(value: string) {
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00Z`) : new Date();
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "2-digit", timeZone: "UTC" }).format(parsed);
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, startSize: number, minSize: number, weight = 700) {
  let size = startSize;
  while (size > minSize) {
    ctx.font = `${weight} ${size}px ${fontStack}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  return size;
}

function downloadCanvas(kind: CanvasKind, credential: Credential) {
  const canvas = document.createElement("canvas");
  const offer = kind === "offer";
  canvas.width = offer ? 1600 : 1200;
  canvas.height = offer ? 2100 : 760;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#080808";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#2a2a2a";
  ctx.lineWidth = 2;
  ctx.strokeRect(42, 42, canvas.width - 84, canvas.height - 84);
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "alphabetic";

  if (offer) {
    ctx.font = `700 42px ${fontStack}`;
    ctx.fillText("NØ", 110, 145);
    ctx.font = `600 24px ${fontStack}`;
    ctx.fillText("NOTHING INC. / 无事集团", 205, 140);
    ctx.fillStyle = "#a3a3a3";
    ctx.font = `500 18px ${fontStack}`;
    ctx.fillText("VIRTUAL COMMUNITY DOCUMENT · NOT AN EMPLOYMENT CONTRACT", 110, 188);
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 150px ${fontStack}`;
    ctx.fillText("OFFER", 110, 480);
    ctx.fillStyle = "#a3a3a3";
    ctx.font = `500 24px ${fontStack}`;
    ctx.fillText("WELCOME TO NOTHING", 112, 545);
    ctx.fillStyle = "#ffffff";
    ctx.font = `500 31px ${fontStack}`;
    ctx.fillText("Congratulations,", 110, 760);
    const nameSize = fitText(ctx, credential.name, 1380, 82, 44);
    ctx.font = `700 ${nameSize}px ${fontStack}`;
    ctx.fillText(credential.name, 110, 855);
    ctx.fillStyle = "#a3a3a3";
    ctx.font = `500 27px ${fontStack}`;
    ctx.fillText("You are now part of Nothing Inc. with the self-selected title", 110, 950);
    ctx.fillStyle = "#ffffff";
    const roleSize = fitText(ctx, credential.role, 1380, 62, 36);
    ctx.font = `700 ${roleSize}px ${fontStack}`;
    ctx.fillText(credential.role, 110, 1045);
    ctx.fillStyle = "#a3a3a3";
    ctx.font = `500 26px ${fontStack}`;
    ctx.fillText("One level. Infinite titles. Your start date is now.", 110, 1140);
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 60px ${fontStack}`;
    ctx.fillText("DO NOTHING.", 110, 1420);
    ctx.fillText("BE EVERYTHING.", 110, 1495);
    ctx.strokeStyle = "#363636";
    ctx.beginPath(); ctx.moveTo(110, 1740); ctx.lineTo(1490, 1740); ctx.stroke();
    ctx.fillStyle = "#a3a3a3";
    ctx.font = `500 21px ${fontStack}`;
    ctx.fillText(`JOINED  ${formatDate(credential.joined).toUpperCase()}`, 110, 1810);
    ctx.fillText(`MEMBER ID  ${credential.id}`, 110, 1855);
    ctx.fillText("VIRTUAL KEEPSAKE ONLY · NO LEGAL EMPLOYMENT OR EXECUTIVE APPOINTMENT", 110, 1960);
  } else {
    ctx.font = `700 46px ${fontStack}`;
    ctx.fillText("NØ", 70, 110);
    ctx.font = `600 20px ${fontStack}`;
    ctx.fillText("NOTHING INC. / 无事集团", 162, 105);
    ctx.fillStyle = "#a3a3a3";
    ctx.font = `500 16px ${fontStack}`;
    ctx.fillText("VIRTUAL MEMBER ID", 70, 152);
    ctx.fillStyle = "#ffffff";
    const nameSize = fitText(ctx, credential.name, 760, 72, 38);
    ctx.font = `700 ${nameSize}px ${fontStack}`;
    ctx.fillText(credential.name, 70, 350);
    ctx.fillStyle = "#a3a3a3";
    const roleSize = fitText(ctx, credential.role, 760, 34, 22, 500);
    ctx.font = `500 ${roleSize}px ${fontStack}`;
    ctx.fillText(credential.role, 70, 410);
    ctx.fillStyle = "#ffffff";
    ctx.font = `600 18px ${fontStack}`;
    ctx.fillText(credential.id, 70, 635);
    ctx.fillStyle = "#a3a3a3";
    ctx.font = `500 15px ${fontStack}`;
    ctx.fillText(`JOINED ${formatDate(credential.joined).toUpperCase()}`, 760, 635);
    ctx.fillText("NOT REAL EMPLOYMENT", 945, 105);
  }

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = kind === "offer" ? "nothing-inc-offer-letter.png" : "nothing-inc-employee-id.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
}

export function CredentialStudio() {
  const params = useSearchParams();
  const name = clean(params.get("name"), 24);
  const role = clean(params.get("role"), 42);
  const joined = clean(params.get("joined"), 10) || new Date().toISOString().slice(0, 10);
  const [downloaded, setDownloaded] = useState<CanvasKind | null>(null);
  const id = useMemo(() => {
    const source = `${name}|${role}|${joined}`;
    const code = Array.from(source).reduce((sum, char) => (sum * 33 + (char.codePointAt(0) ?? 0)) % 1000000, 2026);
    return `NØ-${code.toString().padStart(6, "0")}`;
  }, [name, role, joined]);
  const credential = { name, role, joined, id };

  if (!name || !role) {
    return <section className="empty-welcome"><p className="overline">NO CREDENTIAL FOUND</p><h1>YOUR TITLE<br />IS WAITING.</h1><p>Choose a title first. Nothing takes less than a minute.</p><a className="action-button inline-action" href="/careers#join">CHOOSE MY TITLE ↗</a></section>;
  }

  function download(kind: CanvasKind) {
    downloadCanvas(kind, credential);
    setDownloaded(kind);
  }

  return (
    <section className="credential-studio">
      <div className="welcome-copy">
        <p className="overline">CONGRATULATIONS / YOU&apos;RE HIRED*</p>
        <h1>WELCOME<br />TO NOTHING.</h1>
        <p>Congratulations, <strong>{name}</strong>. You are now part of Nothing Inc.</p>
        <small>*Virtual membership only. No employment or legal appointment is created.</small>
      </div>
      <div className="credential-grid">
        <article className="offer-preview dark-document">
          <header><b>NØ</b><span>NOTHING INC.<small>无事集团</small></span><i>VIRTUAL OFFER</i></header>
          <div><p>WELCOME TO NOTHING</p><h2>OFFER</h2><span>Congratulations,</span><h3>{name}</h3><span>You are now part of Nothing Inc. as</span><h4>{role}</h4><p>One level. Infinite titles. Your start date is now.</p></div>
          <footer><span>{formatDate(joined)}</span><span>{id}</span></footer>
        </article>
        <article className="badge-preview dark-document">
          <header><b>NØ</b><span>NOTHING INC.<small>VIRTUAL MEMBER</small></span><i>NOT REAL EMPLOYMENT</i></header>
          <div><h3>{name}</h3><p>{role}</p></div>
          <footer><span>{id}</span><span>JOINED {formatDate(joined)}</span></footer>
        </article>
      </div>
      <div className="download-actions">
        <button className="action-button" onClick={() => download("offer")}>DOWNLOAD OFFER LETTER <span>PNG ↘</span></button>
        <button className="action-button secondary-action" onClick={() => download("badge")}>DOWNLOAD EMPLOYEE ID <span>PNG ↘</span></button>
        <p aria-live="polite">{downloaded ? `${downloaded === "offer" ? "Offer letter" : "Employee ID"} downloaded.` : "Files are generated locally in your browser."}</p>
      </div>
    </section>
  );
}
