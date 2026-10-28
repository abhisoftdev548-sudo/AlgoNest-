import mongoose from 'mongoose';
import { AdminAuditLog } from '../models/AdminAuditLog.js';

/** Append-only record for privileged mutations. Call after the domain write. */
export async function recordAdminAudit({ actor, action, targetType, targetId, summary = '', metadata = {}, request = null }) {
  // Domain services are exercised with in-memory doubles in unit tests. Live
  // HTTP mutations are behind dbGuard, so a disconnected write is never valid.
  if (mongoose.connection.readyState !== 1) return null;
  return AdminAuditLog.create({
    actor: actor?._id ?? actor?.id ?? actor,
    action,
    targetType,
    targetId: String(targetId),
    summary,
    metadata,
    requestId: request?.id ?? request?.requestId ?? '',
    ip: request?.ip ?? '',
  });
}

export default recordAdminAudit;
