import { PAGINATION } from '@algonest/shared';

/** Uniform pagination envelope used by every Phase-2+ list endpoint. */
export function buildPagination(page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, total = 0, maxLimit = PAGINATION.MAX_LIMIT) {
  const safePage = Math.min(PAGINATION.MAX_PAGE, Math.max(1, Number(page) || 1));
  const safeLimit = Math.min(maxLimit, Math.max(1, Number(limit) || PAGINATION.DEFAULT_LIMIT));
  const totalPages = Math.ceil(total / safeLimit);
  return {
    page: safePage,
    limit: safeLimit,
    total,
    totalPages,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  };
}

/**
 * Runs a filtered Mongoose query and its count in parallel. `mapItem` keeps
 * serialization decisions in the service, never in the controller.
 */
export async function paginateQuery(filter, query, options = {}) {
  const {
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    sort = { createdAt: -1 },
    projection = null,
    populate = null,
  } = options;
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, Number(limit) || PAGINATION.DEFAULT_LIMIT));

  let list = query.find(filter, projection).sort(sort).skip((safePage - 1) * safeLimit).limit(safeLimit);
  if (populate) list = list.populate(populate);
  const [items, total] = await Promise.all([list.lean(), query.countDocuments(filter)]);
  return { items, pagination: buildPagination(safePage, safeLimit, total) };
}

export default paginateQuery;
