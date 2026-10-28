import { Component } from 'react';

/**
 * Decorative animations are optional. React Bits is vendored third-party code
 * that touches canvas, ResizeObserver, matchMedia, gsap and requestAnimationFrame.
 * If one of those APIs misbehaves in a particular browser — or a stale Vite
 * chunk fails to load — we must degrade to the static content instead of
 * blanking the whole route with the top-level error screen.
 */
export default class PolishBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    // Logged once, never rethrown: the user still gets readable content.
    console.warn('[AlgoNest] disabled animation', this.props.name, error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    const { fallback } = this.props;
    return typeof fallback === 'function' ? fallback() : (fallback ?? null);
  }
}
