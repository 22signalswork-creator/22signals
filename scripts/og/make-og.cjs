/**
 * Builds the link-preview (Open Graph) images in public/og/ with Playwright.
 * Run by hand when headlines change:  node scripts/og/make-og.cjs
 * Not part of the Vercel build.
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../..");
const font = (f) => "file://" + path.join(root, "src/assets/fonts", f);
const logo = "file://" + path.join(root, "src/assets/logo.png");

const CARDS = [
  { id: "home", eyebrow: "22 Signals", title: "Ambitious ideas, <b>executed.</b>", sub: "AI, cloud, websites, growth marketing and video, under one roof." },
  { id: "services", eyebrow: "What we do", title: "One team <b>instead of ten.</b>", sub: "Strategy, AI, data and cloud, web and apps, growth marketing, creative and managed services." },
  { id: "portfolio", eyebrow: "Portfolio", title: "Selected <b>work.</b>", sub: "Websites, AI builds, search, video and live broadcast for firms worldwide." },
  { id: "about", eyebrow: "About", title: "Builders, strategists <b>and creatives.</b>", sub: "One team across AI, engineering, marketing and production." },
  { id: "locations", eyebrow: "Locations", title: "Working with firms <b>worldwide.</b>", sub: "United States, United Kingdom, Europe, the UAE and Pakistan." },
  { id: "rnd", eyebrow: "R&D", title: "The pulse of <b>innovation.</b>", sub: "What we research before it reaches client work." },
  { id: "insights", eyebrow: "Insights", title: "Guides and <b>field notes.</b>", sub: "AI, search, cloud and growth, written by the people doing the work." },
  { id: "contact", eyebrow: "Contact", title: "Let's build <b>the future.</b>", sub: "Book a 15-minute call with 22 Signals." },
];

// one card per service page, using its own name and headline
const dir = path.join(root, "content/pages");
for (const f of fs.readdirSync(dir)) {
  if (!f.startsWith("services__") || f.includes("-in-")) continue;
  const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  const slug = d.path.split("/").pop();
  CARDS.push({ id: "svc-" + slug, eyebrow: d.eyebrow || "Service", title: d.h1, sub: "22 Signals. AI, cloud, web, growth marketing and video, under one roof.", service: true });
}

const html = (c) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:A;src:url('${font("aeoniktrial-regular.otf")}')}
@font-face{font-family:AM;src:url('${font("aeoniktrial-medium.otf")}')}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;font-family:A,sans-serif;color:#fff;
 background:radial-gradient(900px 600px at 82% 115%, #10215e 0%, #050a18 55%, #02040b 100%);position:relative}
.grid{position:absolute;inset:0;opacity:.07;background-image:linear-gradient(rgba(107,146,255,.9) 1px,transparent 1px),linear-gradient(90deg,rgba(107,146,255,.9) 1px,transparent 1px);background-size:60px 60px;
 -webkit-mask-image:radial-gradient(700px 500px at 30% 40%,#000,transparent)}
svg.globe{position:absolute;right:-250px;bottom:-250px;width:760px;height:760px}
.wrap{position:absolute;left:72px;top:64px;right:${c.service ? 500 : 520}px;bottom:60px;display:flex;flex-direction:column}
.logo{height:52px;width:auto;align-self:flex-start}
.eb{margin-top:auto;display:inline-flex;align-self:flex-start;font-family:AM;font-size:15px;letter-spacing:.32em;text-transform:uppercase;color:#93b8ff;
 border:1px solid rgba(147,184,255,.45);border-radius:999px;padding:9px 18px}
h1{font-family:AM;font-weight:500;margin-top:22px;font-size:${c.service ? 50 : 66}px;line-height:1.04;letter-spacing:-.025em}
h1 b{font-weight:500;color:#6B92FF}
p{margin-top:20px;font-size:22px;line-height:1.38;color:rgba(220,230,255,.72);max-width:640px}
.url{position:absolute;right:56px;top:72px;font-size:16px;letter-spacing:.24em;text-transform:uppercase;color:rgba(220,230,255,.6)}
.bar{position:absolute;left:0;right:0;bottom:0;height:6px;background:linear-gradient(90deg,#325FEC,#93b8ff,#325FEC)}
</style></head><body>
<div class="grid"></div>
<svg class="globe" viewBox="0 0 760 760">
 <defs><clipPath id="c"><circle cx="380" cy="380" r="370"/></clipPath>
 <radialGradient id="o"><stop offset="0" stop-color="#e6edff"/><stop offset=".22" stop-color="#7ea2ff" stop-opacity=".95"/><stop offset=".6" stop-color="#325FEC" stop-opacity=".4"/><stop offset="1" stop-color="#325FEC" stop-opacity="0"/></radialGradient>
 <radialGradient id="b" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#132a78"/><stop offset="1" stop-color="#050a18"/></radialGradient></defs>
 <circle cx="380" cy="380" r="370" fill="url(#b)"/>
 <g clip-path="url(#c)"><circle cx="250" cy="230" r="230" fill="url(#o)"/>
 <g fill="none" stroke="rgba(220,230,255,.35)" stroke-width="1.4">
  <ellipse cx="380" cy="380" rx="90" ry="370"/><ellipse cx="380" cy="380" rx="200" ry="370"/><ellipse cx="380" cy="380" rx="300" ry="370"/>
  <ellipse cx="380" cy="160" rx="300" ry="40"/><ellipse cx="380" cy="270" rx="355" ry="52"/><ellipse cx="380" cy="380" rx="370" ry="58"/><ellipse cx="380" cy="490" rx="355" ry="52"/>
 </g></g>
 <circle cx="380" cy="380" r="370" fill="none" stroke="rgba(147,184,255,.7)" stroke-width="1.6"/>
</svg>
<div class="url">22signals.com</div>
<div class="wrap">
 <img class="logo" src="${logo}">
 <div class="eb">${c.eyebrow}</div>
 <h1>${c.title}</h1>
 <p>${c.sub}</p>
</div>
<div class="bar"></div>
</body></html>`;

(async () => {
  const out = path.join(root, "public/og");
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  for (const c of CARDS) {
    const tmp = path.join(out, "_tmp.html");
    fs.writeFileSync(tmp, html(c));
    await p.goto("file://" + tmp, { waitUntil: "load" });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(out, c.id + ".jpg"), type: "jpeg", quality: 88 });
  }
  fs.unlinkSync(path.join(out, "_tmp.html"));
  await b.close();
  console.log("made", CARDS.length, "images");
})();
