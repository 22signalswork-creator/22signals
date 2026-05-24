# 22 Signals — Video Showcase Redesign (v4 — SOLID COLOR HEADING)

## Why this version exists

v1–v3 all relied on `background-clip: text` to render the blue → black
gradient on the headline. In your browser, that technique combined with
Framer Motion's transform animations was producing **invisible text** —
the space was reserved but no glyphs rendered.

After three failed attempts to make `background-clip: text` work reliably,
**this version abandons it entirely.** The headline now uses solid colors:

- `#0A1530` (deep navy) for the structural words
- `#325FEC` (brand blue) for the emphasis words: **complex**, **data driven results.**

You get the same premium feel through type weight (700), size
(`clamp(40px, 6.5vw, 88px)`), tight letter-spacing, and the rise animation —
just without the rendering risk.

## Architectural change

Animation control moved up to the **parent**. Previously each word had its
own `whileInView` trigger. Now the parent `motion.div` owns
`whileInView="visible"` and every animated descendant uses `variants` to
follow the cascade. This is a single trigger, single failure point, much
more reliable.

The structure:

```jsx
<motion.div variants={containerStagger} initial="hidden" whileInView="visible">
  <motion.div variants={headlineGroup}>           // group for tight word stagger
    <h1>
      <span className="block">
        <WordRise word={...} />                    // uses variants, no own trigger
        ...
      </span>
    </h1>
  </motion.div>
  ...
</motion.div>
```

Inside `WordRise`:

```jsx
<span style={{ overflow: 'hidden', display: 'inline-block' }}>   // mask
  <motion.span variants={wordRise}                                // transform here
    style={{ display: 'inline-block', color: '#0A1530' or '#325FEC' }}>  // SOLID color
    {word.text}                                                   // plain text node
  </motion.span>
</span>
```

No background-clip, no gradients on animated elements — solid colors only.
The text **will** render in every browser.

## Animations still in place

- ✅ Word-by-word rise reveal (mask + translateY)
- ✅ Two-line headline layout
- ✅ Cinematic orchestrated entrance (orbs, numeral, rule, headline,
       paragraph, video, marquees, connector)
- ✅ Continuous scroll-driven parallax on background elements
- ✅ Top + bottom `PLAY OUR SHOWCASE` marquees sliding in from opposite sides
- ✅ Magnetic 3D tilt on video hover
- ✅ Native HTML5 fullscreen (no portal modal, no freeze)
- ✅ Rotating dashed ring + pulsing glow on play button

## Files changed

- `src/pages/home/components/ServicesSection.tsx` — solid color heading, variants cascade
- `src/pages/home/components/video.tsx` — native fullscreen + both marquees

## Run

```bash
npm install
npm run dev
```

## Verified

- ✅ TypeScript: clean
- ✅ Production build: clean (13s, 1.17 MB JS, 124 KB CSS)
- ✅ Bundle contains the headline text and both color codes (`#0A1530`, `#325FEC`)
