import { PLATFORMS, PLATFORM_LABELS, SHEET_LIMITS } from '@algonest/shared';
import { canonicalUrlKey } from '../../utils/slug.js';

/**
 * URL → structured problem. Pure functions only (no DB, no network): the
 * parser is safe to unit-test and can be reused by a future import CLI.
 *
 * SECURITY: we never fetch the URL. Only the hostname + pathname are inspected,
 * and the scheme is strictly http/https, so `javascript:`/`data:`/`file:` URLs
 * and SSRF-by-import are impossible.
 */

const RULES = [
  {
    platform: PLATFORMS.LEETCODE,
    hosts: ['leetcode.com', 'leetcode.cn'],
    title: (u) => slugSegment(u, /\/problems\/([^/]+)/) || 'LeetCode problem',
  },
  {
    platform: PLATFORMS.CODEFORCES,
    hosts: ['codeforces.com'],
    title: (u) => {
      const contest = u.pathname.match(/\/(?:problemset\/problem|contest|gym)\/([^/]+)\/(?:problem\/)?([^/]+)/i);
      return contest ? `Codeforces ${contest[1]}${contest[2].toUpperCase()}` : 'Codeforces problem';
    },
  },
  {
    platform: PLATFORMS.GEEKSFORGEEKS,
    hosts: ['geeksforgeeks.org', 'practice.geeksforgeeks.org'],
    title: (u) => slugSegment(u, /\/(?:problems|problem-of-the-day|batch)?\/?([^/]+?)(?:-\d+)?\/?$/) || 'GeeksforGeeks problem',
  },
  {
    platform: PLATFORMS.HACKERRANK,
    hosts: ['hackerrank.com'],
    title: (u) => slugSegment(u, /\/challenges\/([^/]+)/) || 'HackerRank challenge',
  },
  {
    platform: PLATFORMS.CODECHEF,
    hosts: ['codechef.com'],
    title: (u) => slugSegment(u, /\/problems\/([^/]+)/)?.toUpperCase().replace(/^/, 'CodeChef ') || 'CodeChef problem',
  },
  {
    platform: PLATFORMS.ATCODER,
    hosts: ['atcoder.jp'],
    title: (u) => slugSegment(u, /\/tasks\/([^/]+)/) || 'AtCoder task',
  },
  {
    platform: PLATFORMS.INTERVIEWBIT,
    hosts: ['interviewbit.com'],
    title: (u) => slugSegment(u, /\/problems\/([^/]+)/) || 'InterviewBit problem',
  },
  {
    platform: PLATFORMS.HACKEREARTH,
    hosts: ['hackerearth.com'],
    title: (u) => slugSegment(u, /\/problem\/([^/]+)/) || 'HackerEarth problem',
  },
  {
    platform: PLATFORMS.NEETCODE,
    hosts: ['neetcode.io'],
    title: (u) => slugSegment(u, /\/problems\/([^/]+)/) || 'NeetCode problem',
  },
  {
    platform: PLATFORMS.TAKEUFORWARD,
    hosts: ['takeuforward.org', 'takeuforward.com'],
    title: (u) => slugSegment(u, /\/([^/]+)\/?$/) || 'takeUforward problem',
  },
  {
    platform: PLATFORMS.CODESIGNAL,
    hosts: ['codesignal.com'],
    title: (u) => slugSegment(u, /\/([^/]+)\/?$/) || 'CodeSignal task',
  },
  {
    platform: PLATFORMS.SPOJ,
    hosts: ['spoj.com'],
    title: (u) => slugSegment(u, /\/problems\/([^/]+)/)?.toUpperCase().replace(/^/, 'SPOJ ') || 'SPOJ problem',
  },
  {
    platform: PLATFORMS.KATTIS,
    hosts: ['kattis.com', 'open.kattis.com'],
    title: (u) => slugSegment(u, /\/problems\/([^/]+)/) || 'Kattis problem',
  },
  {
    platform: PLATFORMS.YOUTUBE,
    hosts: ['youtube.com', 'm.youtube.com', 'youtu.be'],
    title: (u) => (u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop() || 'YouTube video'),
  },
  {
    platform: PLATFORMS.GITHUB,
    hosts: ['github.com', 'gist.github.com'],
    title: (u) => u.pathname.split('/').filter(Boolean).slice(0, 2).join('/') || 'GitHub repository',
  },
];

const TOPIC_PATTERNS = [
  [/two[-_ ]?pointer|2[-_ ]?pointer/i, 'Two Pointers'],
  [/sliding[-_ ]?window/i, 'Sliding Window'],
  [/binary[-_ ]?search|lower[-_ ]?bound/i, 'Binary Search'],
  [/dynamic[-_ ]?program|[-_]dp[-_]|^dp[-_]|knapsack|lcs[-_]|lis[-_]/i, 'Dynamic Programming'],
  [/breadth[-_ ]?first|[-_]bfs|depth[-_ ]?first|[-_]dfs|topological/i, 'BFS / DFS'],
  [/dijkstra|[-_]graph|shortest[-_]?path|union[-_]?find|mst[-_]/i, 'Graphs'],
  [/binary[-_ ]?tree|binary[-_ ]?search[-_ ]?tree|[-_]bst|traversal/i, 'Trees'],
  [/linked[-_ ]?list/i, 'Linked Lists'],
  [/stack|queue|deque/i, 'Stacks & Queues'],
  [/hash[-_ ]?map|hash[-_ ]?set|frequency[-_]/i, 'Hashing'],
  [/anagram|palindrome|subsequence|[-_]string|substring/i, 'Strings'],
  [/trie|prefix[-_ ]?tree/i, 'Tries'],
  [/heap|priority[-_ ]?queue|kth[-_]/i, 'Heaps'],
  [/interval|merge[-_ ]?intervals/i, 'Intervals'],
  [/bitwise|bit[-_ ]?manipulation|[-_]xor|bit[-_ ]?count/i, 'Bit Manipulation'],
  [/backtrack|permutation|combination|subset|n[-_]?queen/i, 'Backtracking'],
  [/greedy|jump[-_ ]?game/i, 'Greedy'],
  [/recursion/i, 'Recursion'],
  [/prime[-_]|gcd[-_]|lcm[-_]|modulo|factorial/i, 'Math'],
  [/sort[-_]|merge[-_ ]?sort|quick[-_ ]?sort/i, 'Sorting'],
  [/matrix|subarray|prefix[-_ ]?sum|two[-_ ]?sum|three[-_ ]?sum|[-_]array|array[-_]/i, 'Arrays'],
];

function slugSegment(url, regex) {
  const match = url.pathname.match(regex);
  if (!match) return '';
  return humanize(decodeURIComponent(match[1]).replace(/\.\w{1,5}$/, ''));
}

function humanize(slug) {
  const words = String(slug)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_+]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!words) return '';
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function guessTopic(text) {
  for (const [pattern, topic] of TOPIC_PATTERNS) if (pattern.test(text)) return topic;
  return 'General';
}

function guessDifficulty(text) {
  if (/[-_\s]easy[-_\s]?|\beasy\b/i.test(text)) return 'easy';
  if (/[-_\s]hard[-_\s]?|\bhard\b|[-_]dp[-_]/i.test(text)) return 'hard';
  return 'medium';
}

/** Normalise a raw URL: drop tracking params, fragments and trailing slashes. */
export function normaliseUrl(rawUrl) {
  const url = new URL(rawUrl.trim());
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only http(s) links are allowed');
  if (!url.hostname) throw new Error('Link has no host');

  const isMedia = ['youtube.com', 'youtu.be', 'm.youtube.com'].some((h) => url.hostname.endsWith(h));
  if (!isMedia) {
    for (const key of [...url.searchParams.keys()]) url.searchParams.delete(key);
  } else {
    for (const key of [...url.searchParams.keys()]) {
      if (!['v', 't', 'list', 'index'].includes(key)) url.searchParams.delete(key);
    }
  }
  url.hash = '';
  url.pathname = url.pathname.replace(/\/+$/, '') || '/';
  return url.toString().replace(/\/$/, '');
}

/**
 * @returns {{valid:boolean, url:string, title:string, platform:string,
 *   platformLabel:string, platformHost:string|null, topic:string,
 *   difficulty:string, externalId:string, reason?:string}}
 */
export function detectPlatform(rawUrl) {
  let url;
  let cleaned;
  try {
    cleaned = normaliseUrl(rawUrl);
    url = new URL(cleaned);
  } catch (error) {
    return {
      valid: false, url: String(rawUrl ?? '').slice(0, SHEET_LIMITS.MAX_URL),
      title: '', platform: PLATFORMS.GENERIC, platformLabel: PLATFORM_LABELS.generic,
      platformHost: null, topic: 'General', difficulty: 'medium', externalId: '',
      reason: error.message || 'Invalid URL',
    };
  }

  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  const rule = RULES.find((entry) => entry.hosts.some((h) => host === h || host.endsWith(`.${h}`)));
  const platform = rule?.platform ?? PLATFORMS.GENERIC;
  const slug = `${url.pathname} ${url.search}`.replace(/\//g, ' ');
  const autoTitle = rule ? rule.title(url) : (slugSegment(url, /\/([^/]+)\/?$/) || host);

  return {
    valid: true,
    url: cleaned,
    title: autoTitle.slice(0, 200) || 'Untitled problem',
    platform,
    platformLabel: PLATFORM_LABELS[platform] ?? PLATFORM_LABELS.generic,
    platformHost: host,
    topic: guessTopic(slug),
    difficulty: guessDifficulty(slug),
    // YouTube uses ?v= as the real identifier; including it prevents
    // every watch URL from collapsing into one dedupe key.
    externalId: platform === PLATFORMS.YOUTUBE && url.searchParams.get('v')
      ? `${canonicalUrlKey(cleaned)}?v=${url.searchParams.get('v')}`
      : canonicalUrlKey(cleaned),
  };
}

/**
 * Pulls URLs out of pasted text. Accepts plain lines, `Title | URL`,
 * `URL | Title`, `URL, Title`, markdown `[title](url)` and numbered lists.
 * The title is only used when it is clearly supplied by the user.
 */
export function parsePastedLinks(text) {
  const lines = String(text ?? '')
    .split(/\r?\n/)
    .slice(0, SHEET_LIMITS.MAX_PASTED_LINES);

  const items = [];
  const skipped = [];
  const seen = new Set();

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const markdown = line.match(/\[([^\]]{2,200})\]\((https?:\/\/[^\s)]+)\)/i);
    const urlMatch = line.match(/https?:\/\/[^\s<>"')\]]+/i);
    const rawUrl = markdown ? markdown[2] : urlMatch?.[0];
    if (!rawUrl) {
      if (!/^#|^\/\//.test(line)) skipped.push({ line: line.slice(0, 200), reason: 'No http(s) link found' });
      continue;
    }

    // Trailing punctuation from prose ("…/two-sum.") is not part of the URL.
    const tidyUrl = markdown ? rawUrl : rawUrl.replace(/[.,;:!?]+$/, '');
    let detected;
    try {
      detected = detectPlatform(tidyUrl);
    } catch {
      skipped.push({ line: line.slice(0, 200), reason: 'Malformed link' });
      continue;
    }
    if (!detected.valid) {
      skipped.push({ line: line.slice(0, 200), reason: detected.reason });
      continue;
    }

    const withoutUrl = line.replace(rawUrl, '').replace(/^[\[\(]|[\]\)]$/g, '').trim();
    const explicitTitle = markdown
      ? markdown[1].trim()
      : withoutUrl.replace(/^[-*\d.)\s|,:]+|[|,:]+$/g, '').trim();
    if (explicitTitle && explicitTitle.length >= 2 && explicitTitle.length <= 200) {
      detected.title = explicitTitle;
    }

    if (seen.has(detected.externalId)) {
      skipped.push({ line: line.slice(0, 200), reason: 'Duplicate link' });
      continue;
    }
    seen.add(detected.externalId);
    items.push(detected);
  }

  return { items, skipped, total: lines.length };
}

export default detectPlatform;
