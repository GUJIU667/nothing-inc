"use client";

import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

type Credential = { applicationId: string; name: string; role: string; joined: string; id: string };
type CanvasKind = "offer" | "badge";

const siteUrl = "https://nothing-inc.bronzecrown2048.chatgpt.site/";
const displayUrl = "nothing-inc.bronzecrown2048.chatgpt.site";
const fontStack = '"Geist","Inter","Noto Sans SC","Microsoft YaHei",Arial,sans-serif';

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

async function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function downloadCanvas(kind: CanvasKind, credential: Credential) {
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
    ctx.fillText("OFFER", 110, 465);
    ctx.fillStyle = "#a3a3a3";
    ctx.font = `500 24px ${fontStack}`;
    ctx.fillText("WELCOME TO NOTHING", 112, 530);
    ctx.fillStyle = "#ffffff";
    ctx.font = `500 31px ${fontStack}`;
    ctx.fillText("Congratulations,", 110, 700);
    const nameSize = fitText(ctx, credential.name, 1380, 82, 44);
    ctx.font = `700 ${nameSize}px ${fontStack}`;
    ctx.fillText(credential.name, 110, 795);
    ctx.fillStyle = "#a3a3a3";
    ctx.font = `500 27px ${fontStack}`;
    ctx.fillText("We are pleased to formally welcome you to Nothing Inc. in the position of", 110, 905);
    ctx.fillStyle = "#ffffff";
    const roleSize = fitText(ctx, credential.role, 1380, 62, 34);
    ctx.font = `700 ${roleSize}px ${fontStack}`;
    ctx.fillText(credential.role, 110, 1005);
    ctx.fillStyle = "#a3a3a3";
    ctx.font = `500 26px ${fontStack}`;
    ctx.fillText("Your appointment to our virtual community takes effect immediately.", 110, 1100);
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 58px ${fontStack}`;
    ctx.fillText("DO NOTHING.", 110, 1320);
    ctx.fillText("BE EVERYTHING.", 110, 1395);

    ctx.strokeStyle = "#363636";
    ctx.beginPath(); ctx.moveTo(110, 1530); ctx.lineTo(1490, 1530); ctx.stroke();
    ctx.fillStyle = "#a3a3a3";
    ctx.font = `600 19px ${fontStack}`;
    ctx.fillText("MEMBER ID", 110, 1605);
    ctx.fillText("ISSUE DATE", 110, 1660);
    ctx.fillText("ISSUED BY", 110, 1715);
    ctx.fillStyle = "#ffffff";
    ctx.font = `600 23px ${fontStack}`;
    ctx.fillText(credential.id, 300, 1605);
    ctx.fillText(formatDate(credential.joined).toUpperCase(), 300, 1660);
    ctx.fillText("OFFICE OF HUMAN RESOURCES, NOTHING INC.", 300, 1715);

    const qrData = await QRCode.toDataURL(siteUrl, { errorCorrectionLevel: "H", margin: 4, width: 320, color: { dark: "#000000", light: "#ffffff" } });
    const qr = await loadImage(qrData);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(1190, 1575, 300, 300);
    ctx.drawImage(qr, 1190, 1575, 300, 300);
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 17px ${fontStack}`;
    ctx.textAlign = "center";
    ctx.fillText("SCAN TO JOIN", 1340, 1915);
    ctx.fillStyle = "#a3a3a3";
    ctx.font = `500 13px ${fontStack}`;
    ctx.fillText(displayUrl, 1340, 1945);
    ctx.textAlign = "left";

    ctx.fillStyle = "#686868";
    ctx.font = `500 16px ${fontStack}`;
    ctx.fillText("VIRTUAL COMMUNITY KEEPSAKE ONLY. NOT AN EMPLOYMENT CONTRACT, LEGAL APPOINTMENT,", 110, 1875);
    ctx.fillText("OR REPRESENTATION OF A STATUTORY EXECUTIVE ROLE.", 110, 1908);
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

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = kind === "offer" ? `nothing-inc-offer-${credential.id.replace("Ø", "O")}.png` : `nothing-inc-employee-id-${credential.id.replace("Ø", "O")}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function CredentialStudio() {
  const params = useSearchParams();
  const applicationId = params.get("application") ?? "";
  const [credential, setCredential] = useState<Credential | null>(null);
  const [error, setError] = useState("");
  const [downloaded, setDownloaded] = useState<CanvasKind | null>(null);
  const [downloading, setDownloading] = useState<CanvasKind | null>(null);
  const qrRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!applicationId) return;
    const controller = new AbortController();
    fetch(`/api/members?application=${encodeURIComponent(applicationId)}`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const result = await response.json() as { member?: Credential; error?: string };
        if (!response.ok || !result.member) throw new Error(result.error || "Credential not found.");
        setCredential(result.member);
      })
      .catch((caught) => {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        setError(caught instanceof Error ? caught.message : "Credential not found.");
      });
    return () => controller.abort();
  }, [applicationId]);

  useEffect(() => {
    if (!credential || !qrRef.current) return;
    QRCode.toCanvas(qrRef.current, siteUrl, { errorCorrectionLevel: "H", margin: 4, width: 156, color: { dark: "#000000", light: "#ffffff" } });
  }, [credential]);

  if (!applicationId || error) {
    return <section className="empty-welcome"><p className="overline">NO CREDENTIAL FOUND</p><h1>YOUR TITLE<br />IS WAITING.</h1><p>{error || "Choose a title first. Nothing takes less than a minute."}</p><a className="action-button inline-action" href="/careers#join">CHOOSE MY TITLE ↗</a></section>;
  }
  if (!credential) return <div className="credential-loading">ALLOCATING NOTHING…</div>;

  async function download(kind: CanvasKind) {
    setDownloading(kind);
    await downloadCanvas(kind, credential!);
    setDownloaded(kind);
    setDownloading(null);
  }

  return (
    <section className="credential-studio">
      <div className="welcome-copy">
        <p className="overline">CONGRATULATIONS / YOU&apos;RE HIRED*</p>
        <h1>WELCOME<br />TO NOTHING.</h1>
        <p>Congratulations, <strong>{credential.name}</strong>. You are member <strong>{credential.id}</strong> of Nothing Inc.</p>
        <small>*Virtual membership only. No employment or legal appointment is created.</small>
      </div>
      <div className="credential-grid">
        <article className="offer-preview dark-document">
          <header><b>NØ</b><span>NOTHING INC.<small>无事集团</small></span><i>VIRTUAL OFFER</i></header>
          <div className="offer-body"><p>WELCOME TO NOTHING</p><h2>OFFER</h2><span>We are pleased to formally welcome <strong>{credential.name}</strong> to Nothing Inc. in the position of</span><h4>{credential.role}</h4><p>Your appointment to our virtual community takes effect immediately.</p></div>
          <footer className="offer-footer"><div><span>MEMBER ID <b>{credential.id}</b></span><span>ISSUE DATE <b>{formatDate(credential.joined)}</b></span><span>ISSUED BY <b>Office of Human Resources, Nothing Inc.</b></span><small>Virtual community keepsake only. Not an employment contract, legal appointment, or statutory executive role.</small></div><div className="offer-qr"><canvas ref={qrRef} aria-label="QR code to Nothing Inc. website" /><b>SCAN TO JOIN</b><small>{displayUrl}</small></div></footer>
        </article>
        <article className="badge-preview dark-document">
          <header><b>NØ</b><span>NOTHING INC.<small>VIRTUAL MEMBER</small></span><i>NOT REAL EMPLOYMENT</i></header>
          <div><h3>{credential.name}</h3><p>{credential.role}</p></div>
          <footer><span>{credential.id}</span><span>JOINED {formatDate(credential.joined)}</span></footer>
        </article>
      </div>
      <div className="download-actions">
        <button className="action-button" onClick={() => download("offer")} disabled={downloading !== null}>DOWNLOAD OFFER LETTER <span>{downloading === "offer" ? "GENERATING…" : "PNG ↘"}</span></button>
        <button className="action-button secondary-action" onClick={() => download("badge")} disabled={downloading !== null}>DOWNLOAD EMPLOYEE ID <span>{downloading === "badge" ? "GENERATING…" : "PNG ↘"}</span></button>
        <p aria-live="polite">{downloaded ? `${downloaded === "offer" ? "Offer letter" : "Employee ID"} downloaded.` : "Files are generated locally in your browser. Your assigned member number remains unchanged."}</p>
      </div>
    </section>
  );
}
