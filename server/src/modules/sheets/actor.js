/** Narrow, immutable view of the caller passed into every service function. */
export function actorFrom(req) {
  return {
    id: String(req.user._id),
    role: req.user.role,
    permissions: req.auth?.permissions ?? [],
  };
}

export default actorFrom;
