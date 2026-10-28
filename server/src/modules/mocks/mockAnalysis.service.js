import mongoose from 'mongoose';
import { MOCK_LIMITS, MOCK_STATUSES, PLATFORM_VALUES, RESOURCE_TYPE_VALUES } from '@algonest/shared';
import { Sheet } from '../../models/Sheet.js';
import { PersonalResource } from '../../models/PersonalResource.js';
import { Resource } from '../../models/Resource.js';
import { MockAttempt } from '../../models/MockAttempt.js';
import { diagnoseWeakTopics } from './mockScoring.js';
import ApiError from '../../utils/ApiError.js';

const { Types } = mongoose;

/**
 * Real, database-backed "what should I study next". No hardcoded links:
 *   - published sheets whose problems match a weak topic
 *   - the learner's own saved resources for that topic
 * Ranked by the marks actually lost in the attempt, deduped by URL.
 */
export async function buildRecommendations(attempt, actor) {
  const weak = (attempt.weakTopics ?? []).length
    ? attempt.weakTopics
    : diagnoseWeakTopics(attempt.topicStats ?? [], attempt.results ?? []);
  const topics = weak.map((entry) => entry.topic).filter(Boolean).slice(0, 8);
  if (!topics.length) return [];

  const severity = new Map(weak.map((entry) => [entry.topic, Number(entry.lostMarks ?? 0)]));
  const candidates = [];

  // Phase 6 — published directory resources for the same weak topics.
  // Skip the query entirely when Mongo is disconnected so diagnostics never
  // hang on a buffering Mongoose query (also keeps DB-free tests fast).
  if (mongoose.connection.readyState === 1) {
    const directory = await Resource.find({
      status: 'published', topic: { $in: topics }, linkStatus: { $ne: 'broken' },
    }).select('title url topic type').limit(20).lean().catch(() => []);
    for (const resource of directory) {
      candidates.push({
        title: resource.title,
        url: resource.url,
        type: RESOURCE_TYPE_VALUES.includes(resource.type) ? resource.type : 'article',
        topic: resource.topic,
        source: 'directory',
        reason: `From the reviewed resource directory — ${weak.find((entry) => entry.topic === resource.topic)?.advice ?? 'practise this topic'}`,
        weight: severity.get(resource.topic) ?? 0,
      });
    }
  }

  const sheets = await Sheet.find({
    status: { $ne: MOCK_STATUSES.ARCHIVED },
    publishedVersion: { $gt: 0 },
    topics: { $in: topics },
  }).select('title topics problems').limit(20).lean().catch(() => []);

  for (const sheet of sheets) {
    for (const problem of sheet.problems ?? []) {
      if (!topics.includes(problem.topic) || !problem.url) continue;
      candidates.push({
        title: problem.title,
        url: problem.url,
        type: 'problem',
        topic: problem.topic,
        source: 'sheet',
        reason: `From "${sheet.title}" — ${weak.find((entry) => entry.topic === problem.topic)?.advice ?? 'practise this topic'}`,
        weight: severity.get(problem.topic) ?? 0,
      });
    }
  }

  const saved = await PersonalResource.find({
    user: new Types.ObjectId(actor.id),
    $or: [{ topic: { $in: topics } }, { tags: { $in: topics } }],
  }).limit(40).lean().catch(() => []);
  for (const resource of saved) {
    candidates.push({
      title: resource.title,
      url: resource.url,
      type: RESOURCE_TYPE_VALUES.includes(resource.type) ? resource.type : 'article',
      topic: resource.topic,
      source: 'personal',
      reason: 'From your saved resources for this weak topic',
      // Personal resources are surfaced first when marks lost are equal.
      weight: (severity.get(resource.topic) ?? 0) + 0.5,
    });
  }

  const seen = new Set();
  return candidates
    .filter((item) => {
      if (!item.url || seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    })
    .sort((a, b) => b.weight - a.weight || a.title.localeCompare(b.title))
    .slice(0, MOCK_LIMITS.MAX_RECOMMENDATIONS)
    .map(({ weight, ...item }) => ({
      ...item,
      type: RESOURCE_TYPE_VALUES.includes(item.type) ? item.type : 'article',
      source: PLATFORM_VALUES.includes(item.source) ? 'sheet' : item.source,
    }));
}

/** Recompute weak topics + recommendations after the learner tags reasons. */
export async function refreshAnalysis(attempt, actor) {
  const weakTopics = diagnoseWeakTopics(attempt.topicStats ?? [], attempt.results ?? []);
  attempt.weakTopics = weakTopics;
  attempt.markModified('weakTopics');
  attempt.recommendations = await buildRecommendations(attempt, actor);
  attempt.markModified('recommendations');
  await attempt.save();
  return { weakTopics, recommendations: attempt.recommendations };
}

export async function assertAttemptOwner(id, actor) {
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid attempt id');
  const attempt = await MockAttempt.findById(id);
  if (!attempt) throw ApiError.notFound('Attempt not found');
  if (String(attempt.user) !== String(actor.id)) throw ApiError.forbidden('This attempt belongs to another learner');
  return attempt;
}
