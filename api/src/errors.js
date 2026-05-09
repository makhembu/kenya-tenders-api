export const ERRORS = {
  MISSING_API_KEY: { code: 'MISSING_API_KEY', status: 401, message: 'Authorization header is missing or malformed.' },
  INVALID_API_KEY: { code: 'INVALID_API_KEY', status: 401, message: 'The provided API key is invalid or expired.' },
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', status: 400, message: 'Invalid request body.' },
  NOT_FOUND: { code: 'NOT_FOUND', status: 404, message: 'The requested resource was not found.' },
  IDEMPOTENCY_CONFLICT: { code: 'IDEMPOTENCY_CONFLICT', status: 409, message: 'Idempotency key reused with a different request body.' },
  RATE_LIMITED: { code: 'RATE_LIMITED', status: 429, message: 'Too many requests. Please slow down.' },
  UPSTREAM_ERROR: { code: 'UPSTREAM_ERROR', status: 502, message: 'The upstream provider (Safaricom) returned an error.' },
  UPSTREAM_TIMEOUT: { code: 'UPSTREAM_TIMEOUT', status: 504, message: 'The upstream provider (Safaricom) timed out.' },
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', status: 500, message: 'An internal server error occurred.' }
};

export function errorResponse(errorObj, field = null) {
  const body = {
    error: {
      code: errorObj.code,
      message: errorObj.message
    }
  };
  if (field) body.error.field = field;
  
  return new Response(JSON.stringify(body), {
    status: errorObj.status,
    headers: { 'Content-Type': 'application/json' }
  });
}
