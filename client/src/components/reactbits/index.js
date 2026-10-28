/**
 * Vendored React Bits components (official JS + Tailwind variants).
 * See README.md in this folder for provenance, licence and update instructions.
 * Only import these on polish surfaces (landing, home, empty states, headers).
 *
 * Every export is wrapped in a local PolishBoundary: an animation that fails in
 * an unsupported browser degrades to static content instead of triggering the
 * global "Something broke on this screen" fallback.
 */
import withSafeFallback from './safe.js';

import BlurTextSource from './BlurText.jsx';
import GradientTextSource from './GradientText.jsx';
import GridMotionSource from './GridMotion.jsx';
import ShinyTextSource from './ShinyText.jsx';
import SpotlightCardSource from './SpotlightCard.jsx';
import StarBorderSource from './StarBorder.jsx';
import ClickSparkSource from './ClickSpark.jsx';
import GlareHoverSource from './GlareHover.jsx';
import MagnetSource from './Magnet.jsx';
import PixelTransitionSource from './PixelTransition.jsx';
import AnimatedContentSource from './AnimatedContent.jsx';
import CountUpSource from './CountUp.jsx';
import DecryptedTextSource from './DecryptedText.jsx';
import GlitchTextSource from './GlitchText.jsx';

// Backgrounds / text (Phase 1)
export const BlurText = withSafeFallback('BlurText', BlurTextSource);
export const GradientText = withSafeFallback('GradientText', GradientTextSource);
export const GridMotion = withSafeFallback('GridMotion', GridMotionSource);
export const ShinyText = withSafeFallback('ShinyText', ShinyTextSource);
export const SpotlightCard = withSafeFallback('SpotlightCard', SpotlightCardSource);
export const StarBorder = withSafeFallback('StarBorder', StarBorderSource);

// Hover / pointer interactions
export const ClickSpark = withSafeFallback('ClickSpark', ClickSparkSource);
export const GlareHover = withSafeFallback('GlareHover', GlareHoverSource);
export const Magnet = withSafeFallback('Magnet', MagnetSource);
export const PixelTransition = withSafeFallback('PixelTransition', PixelTransitionSource);

// Scroll / mount / text animations
export const AnimatedContent = withSafeFallback('AnimatedContent', AnimatedContentSource);
export const CountUp = withSafeFallback('CountUp', CountUpSource);
export const DecryptedText = withSafeFallback('DecryptedText', DecryptedTextSource);
export const GlitchText = withSafeFallback('GlitchText', GlitchTextSource);
