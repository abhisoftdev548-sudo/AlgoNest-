import { formatZodIssues } from '@algonest/shared';
import ApiError from '../utils/ApiError.js';

/**
 * Zod validation for any request part.
 *
 *   validate(loginSchema)                              // shorthand for body
 *   validate({ query: paginationSchema, params: idSchema })
 *
 * Parsed (and unknown-key-stripped) values are exposed on `req.validated`.
 * The raw body is replaced too, which prevents mass-assignment of fields that
 * are not in the contract.
 */
export function validate(contract) {
  const parts = contract?.safeParse ? { body: contract } : contract;

  if (!parts || typeof parts !== 'object') {
    throw new TypeError('validate() expects a Zod schema or a map of Zod schemas');
  }

  return (req, _res, next) => {
    const validated = { ...(req.validated ?? {}) };

    for (const [source, schema] of Object.entries(parts)) {
      if (!schema?.safeParse) {
        return next(new TypeError(`Invalid schema supplied for "${source}"`));
      }
      const result = schema.safeParse(req[source] ?? {});
      if (!result.success) {
        return next(
          ApiError.unprocessable('Validation failed', {
            errors: formatZodIssues(result.error.issues),
          }),
        );
      }
      validated[source] = result.data;
      if (source === 'body') req.body = result.data;
    }

    req.validated = validated;
    return next();
  };
}

export default validate;
