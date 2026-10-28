import { createElement } from 'react';
import PolishBoundary from '../common/PolishBoundary.jsx';

/**
 * Wraps a vendored React Bits component in a local error boundary.
 *
 * The fallback is deliberately boring but complete: the same text, link or
 * children with the same class names, so layout and content survive even when
 * gsap / canvas / observers fail. This keeps the "React Bits for polish only"
 * rule honest — animations never become a single point of failure.
 */

// Components that render a block wrapper in their normal implementation.
const BLOCK = new Set([
  'BlurText', 'SpotlightCard', 'ClickSpark', 'GlareHover', 'Magnet',
  'PixelTransition', 'AnimatedContent',
]);

// Purely decorative: nothing is lost if we drop it.
const DECORATIVE = new Set(['GridMotion']);

function staticFallback(name, props) {
  if (DECORATIVE.has(name)) return null;

  const Tag = props.as || (BLOCK.has(name) ? 'div' : 'span');
  const passthrough = { className: props.className, style: props.style };

  // StarBorder is used with `as={Link} to="/register"`; keep navigation alive.
  if (typeof Tag !== 'string') {
    if (props.to) passthrough.to = props.to;
    if (props.href) passthrough.href = props.href;
  }

  let content = props.children ?? props.text ?? props.firstContent ?? null;
  if (content == null && typeof props.to !== 'string' && props.to != null) {
    // CountUp: render the final number rather than an empty placeholder.
    content = `${props.to}${props.suffix ?? ''}`;
  }

  return createElement(Tag, passthrough, content);
}

export default function withSafeFallback(name, Component) {
  function SafeBitsComponent(props) {
    return createElement(
      PolishBoundary,
      { name, fallback: () => staticFallback(name, props) },
      createElement(Component, props),
    );
  }

  SafeBitsComponent.displayName = `Safe(${name})`;
  return SafeBitsComponent;
}
