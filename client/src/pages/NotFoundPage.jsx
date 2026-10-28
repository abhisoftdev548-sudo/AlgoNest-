import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { ClickSpark, GlitchText } from '../components/reactbits/index.js';
import Button from '../components/ui/Button.jsx';
import Logo from '../components/ui/Logo.jsx';
import { useIsDark } from '../store/themeStore.js';

/** Empty state polish: glitch text + click sparks, still fully readable. */
export default function NotFoundPage() {
  const isDark = useIsDark();

  return (
    <ClickSpark
      sparkColor={isDark ? '#2dd4bf' : '#0d9488'}
      sparkCount={8}
      sparkRadius={26}
      sparkSize={9}
      duration={500}
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas px-6 text-center"
    >
      <Logo size="lg" showWordmark />
      <Compass className="h-12 w-12 text-primary transition-transform duration-500 hover:rotate-45" aria-hidden="true" />

      <GlitchText
        trigger="hover"
        speed={0.8}
        intensity={0.35}
        enableShadows
        shadowColors={isDark ? ['#2dd4bf', '#a78bfa'] : ['#0d9488', '#7c3aed']}
        className="font-mono text-ink"
      >
        404
      </GlitchText>

      <div>
        <h1 className="text-xl font-semibold text-ink">This path isn’t on the map</h1>
        <p className="mt-2 max-w-sm text-sm text-muted">The link may be outdated. Let’s get you back to something solvable.</p>
      </div>
      <Link to="/"><Button className="transition-transform duration-200 hover:-translate-y-0.5">Go to home</Button></Link>
    </ClickSpark>
  );
}
