import mongoose from 'mongoose';
import { RESOURCE_EVENT_TYPES as E } from '@algonest/shared';
import { Resource } from '../../models/Resource.js';
import { ResourceEvent } from '../../models/ResourceEvent.js';

const { Types } = mongoose;

const COUNTER = {
  [E.VIEW]: 'viewCount',
  [E.SAVE]: 'saveCount',
  [E.START]: 'startCount',
  [E.COMPLETION]: 'completionCount',
};

/**
 * Write one analytics fact and bump the denormalised counter atomically.
 * `view` is deduplicated per (resource, user, day) by a partial unique index;
 * a duplicate insert is swallowed so a page refresh cannot inflate numbers.
 */
export async function recordEvent(resource, type, actor, now = new Date()) {
  const counter = COUNTER[type];
  if (!counter || !resource?._id) return { recorded: false, reason: 'unknown event' };
  const dayKey = new Date(now).toISOString().slice(0, 10);
  try {
    await ResourceEvent.create({
      resource: resource._id,
      creator: resource.author?._id ?? resource.author,
      user: actor?.id ? new Types.ObjectId(actor.id) : null,
      type,
      dayKey,
    });
  } catch (error) {
    if (error?.code === 11000 && type === E.VIEW) return { recorded: false, reason: 'duplicate view' };
    throw error;
  }
  await Resource.updateOne({ _id: resource._id }, { $inc: { [counter]: 1 } });
  return { recorded: true, type, dayKey };
}

/** Aggregate an array of raw events into totals + a daily series. Pure. */
export function summariseEvents(events = [], days = 30, now = new Date()) {
  const totals = { view: 0, save: 0, start: 0, completion: 0 };
  const perResource = new Map();
  const seriesMap = new Map();
  const start = new Date(now);
  start.setUTCHours(0, 0, 0, 0);
  for (let index = days - 1; index >= 0; index -= 1) {
    const key = new Date(start.getTime() - index * 86_400_000).toISOString().slice(0, 10);
    seriesMap.set(key, { date: key, view: 0, save: 0, start: 0, completion: 0 });
  }
  for (const event of events) {
    const type = event.type;
    if (!(type in totals)) continue;
    const count = Number.isFinite(Number(event.count)) ? Number(event.count) : 1;
    totals[type] += count;
    const row = seriesMap.get(event.dayKey);
    if (row) row[type] += count;
    const key = String(event.resource);
    const stat = perResource.get(key) ?? { resource: key, view: 0, save: 0, start: 0, completion: 0, total: 0 };
    stat[type] += count;
    stat.total += count;
    perResource.set(key, stat);
  }
  return {
    totals,
    series: [...seriesMap.values()],
    topResources: [...perResource.values()].sort((a, b) => b.total - a.total).slice(0, 8),
  };
}

export default recordEvent;
