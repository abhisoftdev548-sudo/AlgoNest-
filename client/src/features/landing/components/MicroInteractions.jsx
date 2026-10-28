import { ArrowUpRight, MousePointer2, Sparkles, WandSparkles } from 'lucide-react';
import {
  AnimatedContent, ClickSpark, DecryptedText, GlareHover, Magnet, PixelTransition,
} from '../../../components/reactbits/index.js';
import { useIsDark } from '../../../store/themeStore.js';

/**
 * Polish-only band that puts the React Bits hover components to work on real
 * product copy. Every tile is keyboard reachable and readable without hover.
 */
export default function MicroInteractions() {
  const isDark = useIsDark();
  const teal = isDark ? '#2dd4bf' : '#0d9488';
  const purple = isDark ? '#a78bfa' : '#7c3aed';

  return (
    <section id="interactions" className="border-b border-line bg-surface/40">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <AnimatedContent distance={28} duration={0.7} trigger="scroll" once>
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Micro-interactions</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              A little motion, a lot of <span className="text-primary">focus</span>.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Hover, move or tap anywhere in these cards. The effects are decorative — never required to read the content.
            </p>
          </div>
        </AnimatedContent>

        <AnimatedContent
          distance={40}
          duration={0.7}
          trigger="scroll"
          stagger={0.12}
          once
          className="mt-10 grid gap-5 md:grid-cols-3"
        >
          {/* 1 — GlareHover */}
          <GlareHover
            width="100%"
            height="100%"
            borderRadius="16px"
            borderColor="transparent"
            background="var(--ag-surface)"
            glareColor={teal}
            glareOpacity={0.4}
            glareSize={38}
            glareAngle={-35}
            transitionDuration={600}
            className="min-h-[270px] w-full border border-line"
          >
            <div className="flex h-full w-full flex-col justify-between p-6 text-left">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <MousePointer2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-ink">Glare on hover</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  A light sweep follows your cursor across every sheet and feature card. Subtle by design, never blinding.
                </p>
              </div>
            </div>
          </GlareHover>

          {/* 2 — Magnet + ClickSpark */}
          <div className="relative flex min-h-[270px] w-full flex-col justify-between rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/12 text-accent">
              <WandSparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-ink">Magnetic pull + click spark</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Primary actions lean toward your pointer and burst into sparks when you commit.
              </p>
            </div>
            <div className="mt-5 h-14 w-full">
              <ClickSpark
                sparkColor={purple}
                sparkCount={10}
                sparkRadius={26}
                sparkSize={10}
                sparkWidth={2}
                duration={520}
                className="flex h-full w-full items-center justify-center"
              >
                <Magnet magnetStrength={3} maxOffset={12} padding={28}>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-surface-2 px-4 text-sm font-semibold text-ink transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <Sparkles className="h-4 w-4" aria-hidden="true" /> Try the pull
                  </button>
                </Magnet>
              </ClickSpark>
            </div>
          </div>

          {/* 3 — PixelTransition */}
          <PixelTransition
            firstContent={
              <div className="flex h-full w-full flex-col justify-between bg-surface p-6 text-left">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-warning/12 text-warning">
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink">Hover to reveal</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">Focus or hover this card to flip the pixel grid.</p>
                </div>
              </div>
            }
            secondContent={
              <div className="flex h-full w-full flex-col justify-between bg-primary/10 p-6 text-left">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink">Today’s first task</h3>
                  <p className="mt-2 font-mono text-xs text-primary">arrays → two_sum → easy → 20 min</p>
                </div>
              </div>
            }
            gridSize={9}
            pixelColor={teal}
            pixelShape="rounded"
            animationStepDuration={0.32}
            aspectRatio="4 / 3"
            className="w-full"
            style={{ width: '100%', borderRadius: 16, border: '1px solid var(--ag-line)' }}
          />
        </AnimatedContent>

        <div className="mt-9 text-center">
          <DecryptedText
            text="SMALL INTERACTIONS · ZERO DISTRACTIONS"
            animateOn="hover"
            speed={35}
            maxIterations={12}
            useOriginalCharsOnly
            className="font-mono text-[11px] font-semibold tracking-[0.18em] text-muted"
            encryptedClassName="text-primary"
            parentClassName="inline-block cursor-pointer rounded-md px-2 py-1"
          />
        </div>
      </div>
    </section>
  );
}
