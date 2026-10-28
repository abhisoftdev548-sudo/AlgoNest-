/** Tiny classname joiner — avoids a dependency for a five-line utility. */
export function cn(...values) {
  return values
    .flat(Infinity)
    .filter((value) => typeof value === 'string' && value.length > 0)
    .join(' ');
}

export default cn;
