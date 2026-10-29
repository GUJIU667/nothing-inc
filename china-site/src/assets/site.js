import QRCode from "qrcode";

const githubPages = location.hostname === "gujiu667.github.io";
const basePath = githubPages ? "/nothing-inc" : "";
const apiBase = githubPages ? "https://nothing-inc-cn.pages.dev" : "";
// Updated only after the independent deployment passed mainland carrier checks.
const qrSiteUrl = "https://nothing-inc-cn.pages.dev/";
const qrDisplayUrl = "nothing-inc-cn.pages.dev";
const fontStack = '"Geist","Inter","Noto Sans SC","Microsoft YaHei",Arial,sans-serif';

const roles = [
  ["CEO", "首席执行官", "Sets the direction. Everyone else remains equally in charge."],
  ["Chief Slacking Officer", "首席摸鱼官", "Advances the disciplined practice of appearing thoughtfully unavailable."],
  ["Chief Nothing Officer", "首席无事官", "Protects Nothing from the unnecessary introduction of Something."],
  ["Global Sleep Director", "全球睡眠战略总监", "Coordinates rest across borders, time zones, and calendar invitations."],
  ["VP of Doing Nothing", "无所事事业部副总裁", "Scales inactivity with executive precision and measurable calm."],
  ["Chief Financial Freedom Officer", "首席财富自由官", "Maintains an ambitious portfolio of zero-dollar opportunities."],
  ["Head of Talent Rejection", "人才拒绝事务负责人", "Rejects rejection and welcomes every qualified human immediately."],
  ["Chief Unemployment Officer", "首席失业官", "Leads the strategic transition from busy to meaningfully unoccupied."],
  ["Director of Strategic Procrastination", "战略拖延总监", "Ensures every urgent matter receives the delay it deserves."],
  ["Chief Work-Life Balance Officer", "首席工作生活平衡官", "Keeps the balance firmly weighted toward life."],
  ["Intern", "实习生", "Holds exactly the same organizational level as the CEO."],
];

function route(path) { return `${basePath}${path}`; }

function installShell() {
  const page = document.body.dataset.page || "";
  document.querySelector("#site-header").innerHTML = `
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="disclaimer" role="note">A VIRTUAL COMMUNITY · NOT REAL EMPLOYMENT / 非真实雇佣关系</div>
    <header class="site-header"><a class="brand" href="${route("/")}" aria-label="Nothing Inc. home"><span class="brand-symbol">NØ</span><span class="brand-name">NOTHING INC.<small>无事集团</small></span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation"><span>MENU</span><i aria-hidden="true"></i></button><nav id="primary-navigation" class="primary-nav" aria-label="Primary navigation"><a href="${route("/")}" ${page === "home" ? 'aria-current="page"' : ""}>HOME</a><a href="${route("/about/")}" ${page === "about" ? 'aria-current="page"' : ""}>ABOUT</a><a href="${route("/careers/")}" ${page === "careers" ? 'aria-current="page"' : ""}>CAREERS</a><a href="${route("/careers/#join")}">JOIN US</a></nav></header>`;
  document.querySelector("#site-footer").innerHTML = `<footer class="site-footer"><div><strong>NOTHING INC.</strong><span>无事集团 · A VIRTUAL COMMUNITY</span></div><nav aria-label="Footer navigation"><a href="${route("/about/")}">About</a><a href="${route("/careers/")}">Careers</a><a href="${route("/careers/#join")}">Join Us</a></nav><p>Do Nothing. Be Everything.</p><small>© ${new Date().getFullYear()} Nothing Inc. No accounts. Minimal data. Virtual membership only.</small></footer>`;
  document.querySelectorAll("[data-route]").forEach((link) => { link.href = route(link.dataset.route); });
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  toggle.addEventListener("click", () => { const open = !nav.classList.contains("is-open"); nav.classList.toggle("is-open", open); toggle.setAttribute("aria-expanded", String(open)); toggle.querySelector("span").textContent = open ? "CLOSE" : "MENU"; });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => nav.classList.remove("is-open")));
}

function setupCareers() {
  const list = document.querySelector("#role-list");
  if (!list) return;
  list.innerHTML = roles.map(([title, zh, description], index) => `<label class="role-option ${index === 0 ? "selected" : ""}"><input type="radio" name="role" value="${title}" ${index === 0 ? "checked" : ""}><span><strong>${title}</strong><small>${zh}</small><em>${description}</em></span></label>`).join("") + `<label class="role-option"><input type="radio" name="role" value="CUSTOM"><span><strong>Custom Title</strong><small>自定义职位</small><em>Invent a reasonable identity that HR never thought to reject.</em></span></label>`;
  const customField = document.querySelector("#custom-field");
  list.addEventListener("change", () => { list.querySelectorAll(".role-option").forEach((label) => label.classList.toggle("selected", label.querySelector("input").checked)); customField.hidden = list.querySelector("input:checked").value !== "CUSTOM"; });

  const form = document.querySelector("#join-form");
  const errorNode = document.querySelector("#join-error");
  const button = document.querySelector("#join-submit");
  let applicationId = null;
  let busy = false;
  const showError = (message) => { errorNode.textContent = message; errorNode.hidden = false; };
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy) return;
    const name = document.querySelector("#nickname").value.trim().replace(/\s+/g, " ");
    const selected = list.querySelector("input:checked").value;
    const role = selected === "CUSTOM" ? document.querySelector("#custom-role").value.trim().replace(/\s+/g, " ") : selected;
    const validText = /^[\p{L}\p{N}\p{M} .,'’&()\-·]+$/u;
    if (name.length < 2 || name.length > 24) return showError("请输入 2–24 个字符的昵称 / Enter a nickname between 2 and 24 characters.");
    if (role.length < 2 || role.length > 42) return showError("请输入 2–42 个字符的职位 / Enter a title between 2 and 42 characters.");
    if (!validText.test(name) || !validText.test(role)) return showError("请仅使用文字、数字和常见标点 / Please use letters, numbers, spaces, and basic punctuation.");
    errorNode.hidden = true; busy = true; button.disabled = true; button.textContent = "ALLOCATING YOUR NUMBER…"; applicationId ||= crypto.randomUUID();
    try {
      const response = await fetch(`${apiBase}/api/members`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ applicationId, name, role, custom: selected === "CUSTOM" }) });
      const result = await response.json();
      if (!response.ok || !result.member) { if (response.status === 409) applicationId = null; throw new Error(result.error || "Application could not be completed."); }
      button.textContent = "CONGRATULATIONS — YOU'RE HIRED";
      setTimeout(() => location.assign(`${route("/welcome/")}?application=${encodeURIComponent(result.member.applicationId)}`), 500);
    } catch (error) { busy = false; button.disabled = false; button.textContent = "ONE-CLICK ONBOARDING ↗"; showError(error.message || "Nothing encountered something. Please try again."); }
  });
}

function formatDate(value) { return new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "2-digit", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
function fitText(ctx, text, maxWidth, startSize, minSize, weight = 700) { let size = startSize; while (size > minSize) { ctx.font = `${weight} ${size}px ${fontStack}`; if (ctx.measureText(text).width <= maxWidth) break; size -= 2; } return size; }
function loadImage(src) { return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src; }); }

async function downloadCredential(kind, credential) {
  const offer = kind === "offer"; const canvas = document.createElement("canvas"); canvas.width = offer ? 1600 : 1200; canvas.height = offer ? 2100 : 760; const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#080808"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.strokeStyle = "#2a2a2a"; ctx.lineWidth = 2; ctx.strokeRect(42, 42, canvas.width - 84, canvas.height - 84); ctx.fillStyle = "#fff";
  if (offer) {
    ctx.font = `700 42px ${fontStack}`; ctx.fillText("NØ", 110, 145); ctx.font = `600 24px ${fontStack}`; ctx.fillText("NOTHING INC. / 无事集团", 205, 140); ctx.fillStyle = "#a3a3a3"; ctx.font = `500 18px ${fontStack}`; ctx.fillText("VIRTUAL COMMUNITY DOCUMENT · NOT AN EMPLOYMENT CONTRACT", 110, 188); ctx.fillStyle = "#fff"; ctx.font = `700 150px ${fontStack}`; ctx.fillText("OFFER", 110, 465); ctx.fillStyle = "#a3a3a3"; ctx.font = `500 24px ${fontStack}`; ctx.fillText("WELCOME TO NOTHING", 112, 530); ctx.fillStyle = "#fff"; ctx.font = `500 31px ${fontStack}`; ctx.fillText("Congratulations,", 110, 700); const ns = fitText(ctx, credential.name, 1380, 82, 44); ctx.font = `700 ${ns}px ${fontStack}`; ctx.fillText(credential.name, 110, 795); ctx.fillStyle = "#a3a3a3"; ctx.font = `500 27px ${fontStack}`; ctx.fillText("We are pleased to formally welcome you to Nothing Inc. in the position of", 110, 905); ctx.fillStyle = "#fff"; const rs = fitText(ctx, credential.role, 1380, 62, 34); ctx.font = `700 ${rs}px ${fontStack}`; ctx.fillText(credential.role, 110, 1005); ctx.fillStyle = "#a3a3a3"; ctx.font = `500 26px ${fontStack}`; ctx.fillText("Your appointment to our virtual community takes effect immediately.", 110, 1100); ctx.fillStyle = "#fff"; ctx.font = `700 58px ${fontStack}`; ctx.fillText("DO NOTHING.", 110, 1320); ctx.fillText("BE EVERYTHING.", 110, 1395); ctx.strokeStyle = "#363636"; ctx.beginPath(); ctx.moveTo(110, 1530); ctx.lineTo(1490, 1530); ctx.stroke(); ctx.fillStyle = "#a3a3a3"; ctx.font = `600 19px ${fontStack}`; ctx.fillText("MEMBER ID", 110, 1605); ctx.fillText("ISSUE DATE", 110, 1660); ctx.fillText("ISSUED BY", 110, 1715); ctx.fillStyle = "#fff"; ctx.font = `600 23px ${fontStack}`; ctx.fillText(credential.id, 300, 1605); ctx.fillText(formatDate(credential.joined).toUpperCase(), 300, 1660); ctx.fillText("OFFICE OF HUMAN RESOURCES, NOTHING INC.", 300, 1715);
    const data = await QRCode.toDataURL(qrSiteUrl, { errorCorrectionLevel: "H", margin: 4, width: 320, color: { dark: "#000000", light: "#ffffff" } }); const qr = await loadImage(data); ctx.fillStyle = "#fff"; ctx.fillRect(1190, 1575, 300, 300); ctx.drawImage(qr, 1190, 1575, 300, 300); ctx.font = `700 17px ${fontStack}`; ctx.textAlign = "center"; ctx.fillText("SCAN TO JOIN", 1340, 1915); ctx.fillStyle = "#a3a3a3"; ctx.font = `500 13px ${fontStack}`; ctx.fillText(qrDisplayUrl, 1340, 1945); ctx.textAlign = "left"; ctx.fillStyle = "#686868"; ctx.font = `500 16px ${fontStack}`; ctx.fillText("VIRTUAL COMMUNITY KEEPSAKE ONLY. NOT AN EMPLOYMENT CONTRACT, LEGAL APPOINTMENT,", 110, 1875); ctx.fillText("OR REPRESENTATION OF A STATUTORY EXECUTIVE ROLE.", 110, 1908);
  } else {
    ctx.font = `700 46px ${fontStack}`; ctx.fillText("NØ", 70, 110); ctx.font = `600 20px ${fontStack}`; ctx.fillText("NOTHING INC. / 无事集团", 162, 105); ctx.fillStyle = "#a3a3a3"; ctx.font = `500 16px ${fontStack}`; ctx.fillText("VIRTUAL MEMBER ID", 70, 152); ctx.fillStyle = "#fff"; const ns = fitText(ctx, credential.name, 760, 72, 38); ctx.font = `700 ${ns}px ${fontStack}`; ctx.fillText(credential.name, 70, 350); ctx.fillStyle = "#a3a3a3"; const rs = fitText(ctx, credential.role, 760, 34, 22, 500); ctx.font = `500 ${rs}px ${fontStack}`; ctx.fillText(credential.role, 70, 410); ctx.fillStyle = "#fff"; ctx.font = `600 18px ${fontStack}`; ctx.fillText(credential.id, 70, 635); ctx.fillStyle = "#a3a3a3"; ctx.font = `500 15px ${fontStack}`; ctx.fillText(`JOINED ${formatDate(credential.joined).toUpperCase()}`, 760, 635); ctx.fillText("NOT REAL EMPLOYMENT", 945, 105);
  }
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png")); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = offer ? `nothing-inc-offer-${credential.id.replace("Ø", "O")}.png` : `nothing-inc-employee-id-${credential.id.replace("Ø", "O")}.png`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function setupWelcome() {
  const studio = document.querySelector("#credential-studio"); if (!studio) return;
  const loading = document.querySelector("#credential-loading"); const error = document.querySelector("#credential-error"); const application = new URLSearchParams(location.search).get("application");
  if (!application) { loading.hidden = true; error.hidden = false; return; }
  try {
    const response = await fetch(`${apiBase}/api/members?application=${encodeURIComponent(application)}`, { cache: "no-store" }); const result = await response.json(); if (!response.ok || !result.member) throw new Error(result.error || "Credential not found."); const c = result.member;
    studio.innerHTML = `<div class="welcome-copy"><p class="overline">CONGRATULATIONS / YOU'RE HIRED*</p><h1>WELCOME<br>TO NOTHING.</h1><p>Congratulations, <strong>${c.name}</strong>. You are member <strong>${c.id}</strong> of Nothing Inc.</p><small>*Virtual membership only. No employment or legal appointment is created.</small></div><div class="credential-grid"><article class="offer-preview dark-document"><header><b>NØ</b><span>NOTHING INC.<small>无事集团</small></span><i>VIRTUAL OFFER</i></header><div class="offer-body"><p>WELCOME TO NOTHING</p><h2>OFFER</h2><span>We are pleased to formally welcome <strong>${c.name}</strong> to Nothing Inc. in the position of</span><h4>${c.role}</h4><p>Your appointment to our virtual community takes effect immediately.</p></div><footer class="offer-footer"><div><span>MEMBER ID <b>${c.id}</b></span><span>ISSUE DATE <b>${formatDate(c.joined)}</b></span><span>ISSUED BY <b>Office of Human Resources, Nothing Inc.</b></span><small>Virtual community keepsake only. Not an employment contract, legal appointment, or statutory executive role.</small></div><div class="offer-qr"><canvas aria-label="QR code to Nothing Inc. website"></canvas><b>SCAN TO JOIN</b><small>${qrDisplayUrl}</small></div></footer></article><article class="badge-preview dark-document"><header><b>NØ</b><span>NOTHING INC.<small>VIRTUAL MEMBER</small></span><i>NOT REAL EMPLOYMENT</i></header><div><h3>${c.name}</h3><p>${c.role}</p></div><footer><span>${c.id}</span><span>JOINED ${formatDate(c.joined)}</span></footer></article></div><div class="download-actions"><button class="action-button" data-download="offer">DOWNLOAD OFFER LETTER <span>PNG ↘</span></button><button class="action-button secondary-action" data-download="badge">DOWNLOAD EMPLOYEE ID <span>PNG ↘</span></button><p aria-live="polite">Files are generated locally in your browser. Your assigned member number remains unchanged.</p></div>`;
    await QRCode.toCanvas(studio.querySelector(".offer-qr canvas"), qrSiteUrl, { errorCorrectionLevel: "H", margin: 4, width: 156, color: { dark: "#000000", light: "#ffffff" } });
    studio.querySelectorAll("[data-download]").forEach((button) => button.addEventListener("click", async () => { button.disabled = true; await downloadCredential(button.dataset.download, c); button.disabled = false; studio.querySelector(".download-actions p").textContent = `${button.dataset.download === "offer" ? "Offer letter" : "Employee ID"} downloaded.`; }));
    loading.hidden = true; studio.hidden = false;
  } catch (caught) { loading.hidden = true; error.hidden = false; document.querySelector("#credential-error-text").textContent = caught.message || "Credential not found."; }
}

installShell();
setupCareers();
setupWelcome();
