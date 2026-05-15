import type { Request } from 'express';

export const LOCAL_USER_ID = 'local-user';

export function getCurrentUserId(request: Request): string {
  const rawHeader = request.headers['x-user-id'];
  const value = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : LOCAL_USER_ID;
}
