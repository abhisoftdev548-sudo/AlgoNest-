# React Bits (official JS + Tailwind variants)

These components are **vendored copies of the official React Bits source** from
[github.com/DavidHDev/react-bits](https://github.com/DavidHDev/react-bits),
commit `e12c22192ac7b4b452c5e2feb9b586d74765d696`, folder `src/tailwind/`.
Licence: **MIT + Commons Clause v1.0** — see [LICENSE.md](./LICENSE.md),
Copyright (c) 2026 David Haz. Use as part of this application is permitted;
do not resell or redistribute the components on their own.

## Installed components

### Base visuals
| Component | React Bits path | Where it is used |
| --- | --- | --- |
| `GridMotion` | `Backgrounds/GridMotion` | animated hero background grid |
| `BlurText` | `TextAnimations/BlurText` | animated hero headline |
| `ShinyText` | `TextAnimations/ShinyText` | eyebrow badges / kicker text |
| `GradientText` | `TextAnimations/GradientText` | accent words in headings |
| `StarBorder` | `Animations/StarBorder` | primary CTA button |
| `SpotlightCard` | `Components/SpotlightCard` | feature cards |

### Hover / pointer effects
| Component | React Bits path | Where it is used |
| --- | --- | --- |
| `GlareHover` | `Animations/GlareHover` | glare sweep over feature cards + hover tiles |
| `Magnet` | `Animations/Magnet` | magnetic pull on "Get started" / primary CTAs |
| `ClickSpark` | `Animations/ClickSpark` | spark burst on clicks in the hero |
| `PixelTransition` | `Animations/PixelTransition` | hover-reveal tile in the micro-interactions band |

### Animated components
| Component | React Bits path | Where it is used |
| --- | --- | --- |
| `AnimatedContent` | `Animations/AnimatedContent` | scroll/mount reveals for sections and cards |
| `CountUp` | `TextAnimations/CountUp` | animated hero stats (`replayOnHover`) |
| `DecryptedText` | `TextAnimations/DecryptedText` | hover-to-decode mono tagline |
| `GlitchText` | `TextAnimations/GlitchText` | animated "404" on the not-found empty state |

## Dependencies

| Package | Needed by |
| --- | --- |
| `motion` (`motion/react`) | `BlurText`, `CountUp`, `DecryptedText` |
| `gsap` + `gsap/ScrollTrigger` | `AnimatedContent` |

Both are declared in `client/package.json`. All other vendored components are
dependency-free. `AnimatedContent` registers `ScrollTrigger` itself; do not
register it again.

## Setup / updating (official CLI)

Official installation docs: <https://reactbits.dev/get-started/installation>.
React Bits is distributed as copy-paste source, not a runtime npm package.
Always use the **JS-TW** suffix (JavaScript + Tailwind) for this codebase:

```bash
cd client
npx shadcn@latest add @react-bits/GlareHover-JS-TW

# equivalent jsrepo form
npx jsrepo@latest add https://reactbits.dev/r/GlareHover-JS-TW
```

Older path-style jsrepo installs also work:
`npx jsrepo add https://reactbits.dev/tailwind/Animations/GlareHover`.
Other suffixes are `JS-CSS`, `TS-TW`, `TS-CSS`.

## Usage rules in this codebase

- Import from the barrel (`../../components/reactbits/index.js`), never deep paths.
  The barrel wraps every component in `PolishBoundary`: if a vendored animation
  throws (canvas/observer/gsap unsupported, stale Vite chunk), it degrades to
  static content instead of showing the global error screen. When adding a new
  component, register it there rather than importing the source directly.
- React Bits is used **only** on polish surfaces: landing page, marketing headers,
  home dashboard header/cards, auth kickers and empty states. Data-heavy screens
  (tables, forms, quiz/mock engine, admin) use plain Tailwind components.
- Pass `theme={isDark ? 'dark' : 'light'}` where a component exposes it
  (`GridMotion`, `StarBorder`, `SpotlightCard`) so light mode stays legible.
- Honour reduced motion: every installed component checks
  `prefers-reduced-motion`; our global CSS also neutralises CSS animations.
  `AnimatedContent` sets `visibility: visible` for reduced-motion users.
- Hover effects must never be the only affordance. Each `PixelTransition`,
  `GlareHover` and `DecryptedText` surface also works with keyboard focus and
  has readable static content.
