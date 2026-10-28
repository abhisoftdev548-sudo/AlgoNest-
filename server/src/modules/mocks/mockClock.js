import { MOCK_LIMITS, MOCK_TIMER_MODES } from '@algonest/shared';

/**
 * Server-authoritative time. All functions take an explicit `now` (ms epoch)
 * so they are deterministic in tests and never read a client-supplied clock.
 */

export const toMs = (value) => new Date(value).getTime();

export function totalDurationSeconds(sections = []) {
  return sections.reduce((sum, section) => sum + (Number(section.durationMinutes) || 0) * 60, 0);
}

/**
 * Hard backstop for the whole attempt. In sectional mode a small grace per
 * transition covers a slow reconnection without letting an attempt live forever.
 */
export function globalDeadline(startedAt, sections = [], timerMode = MOCK_TIMER_MODES.SECTIONAL) {
  const seconds = totalDurationSeconds(sections);
  const grace = timerMode === MOCK_TIMER_MODES.SECTIONAL
    ? Math.max(0, sections.length - 1) * MOCK_LIMITS.TRANSITION_GRACE_SECONDS
    : 0;
  return toMs(startedAt) + (seconds + grace) * 1000;
}

/** A section's deadline can never extend beyond the attempt's hard backstop. */
export function sectionDeadline(enteredAt, durationMinutes, hardDeadline) {
  const candidate = toMs(enteredAt) + (Number(durationMinutes) || 0) * 60_000;
  return Math.min(candidate, toMs(hardDeadline));
}

export function isExpired(deadline, now = Date.now()) {
  return toMs(deadline) <= now;
}

export function remainingSeconds(deadline, now = Date.now()) {
  return Math.max(0, Math.round((toMs(deadline) - now) / 1000));
}

/**
 * Which deadline governs this attempt right now. In global mode it is always
 * the attempt deadline; in sectional mode it is the earlier of the current
 * section deadline and the attempt backstop.
 */
export function effectiveDeadline(attempt, now = Date.now()) {
  const hard = toMs(attempt.expiresAt);
  const section = attempt.sectionStates?.find((state) => state.status === 'active');
  const soft = section?.expiresAt ? toMs(section.expiresAt) : hard;
  return Math.min(hard, soft);
}

export function effectiveRemainingSeconds(attempt, now = Date.now()) {
  return remainingSeconds(effectiveDeadline(attempt, now), now);
}

/**
 * Credit one server-observed focus window to a question.
 *
 * The client only reports WHICH question is active; it never sends a duration.
 * We open a window on first sight, close the previous one on every heartbeat,
 * and cap a single window so a disconnected tab cannot inflate the metric.
 *
 * @returns {{firstSeenAt: Date|null, lastSeenAt: Date|null, accumulatedSeconds: number}}
 */
export function creditFocusWindow(entry, now = Date.now(), { open = false } = {}) {
  const current = {
    firstSeenAt: entry?.firstSeenAt ?? null,
    lastSeenAt: entry?.lastSeenAt ?? null,
    accumulatedSeconds: Number(entry?.accumulatedSeconds ?? 0) || 0,
  };
  if (!open) {
    // Closing: charge the time since the last heartbeat, then clear the window.
    if (current.lastSeenAt) {
      const elapsed = Math.max(0, Math.min(MOCK_LIMITS.MAX_FOCUS_WINDOW_SECONDS, (now - toMs(current.lastSeenAt)) / 1000));
      current.accumulatedSeconds = Math.round((current.accumulatedSeconds + elapsed) * 10) / 10;
    }
    current.lastSeenAt = null;
    return current;
  }

  const nowDate = new Date(now);
  if (!current.firstSeenAt) current.firstSeenAt = nowDate;
  if (current.lastSeenAt) {
    const elapsed = Math.max(0, Math.min(MOCK_LIMITS.MAX_FOCUS_WINDOW_SECONDS, (now - toMs(current.lastSeenAt)) / 1000));
    current.accumulatedSeconds = Math.round((current.accumulatedSeconds + elapsed) * 10) / 10;
  }
  current.lastSeenAt = nowDate;
  return current;
}

/** Section states for a freshly started attempt. */
export function initialSectionStates(sections = [], startedAt, timerMode, hardDeadline) {
  // Global mode: every section shares ONE clock. Marking them all active keeps
  // effectiveDeadline() == the hard backstop and makes all questions visible.
  if (timerMode === MOCK_TIMER_MODES.GLOBAL) {
    return sections.map((section, index) => ({
      sectionId: String(section._id ?? section.id ?? index),
      title: section.title,
      durationMinutes: Number(section.durationMinutes) || 0,
      order: index,
      status: 'active',
      startedAt: startedAt,
      expiresAt: new Date(toMs(hardDeadline)),
      submittedAt: null,
    }));
  }
  return sections.map((section, index) => {
    const active = index === 0;
    const enteredAt = active ? startedAt : null;
    return {
      sectionId: String(section._id ?? section.id ?? index),
      title: section.title,
      durationMinutes: Number(section.durationMinutes) || 0,
      order: index,
      status: active ? 'active' : 'pending',
      startedAt: enteredAt,
      expiresAt: active ? new Date(sectionDeadline(enteredAt, section.durationMinutes, hardDeadline)) : null,
      submittedAt: null,
    };
  });
}

/** Advance to the next section (or finish). Mutates a plain states array. */
export function advanceSection(states, now = Date.now(), hardDeadline, endedStatus = 'submitted') {
  const index = states.findIndex((state) => state.status === 'active');
  if (index < 0) return { states, finished: true, next: null };
  states[index] = { ...states[index], status: endedStatus, submittedAt: new Date(now) };
  const nextIndex = index + 1;
  if (nextIndex >= states.length) return { states, finished: true, next: null };
  const enteredAt = new Date(now);
  states[nextIndex] = {
    ...states[nextIndex],
    status: 'active',
    startedAt: enteredAt,
    expiresAt: new Date(sectionDeadline(enteredAt, states[nextIndex].durationMinutes, hardDeadline)),
  };
  return { states, finished: false, next: states[nextIndex] };
}
