/**
 * @file src/lib/adminApiGuard.ts
 * @description Write-lock for the invitation management API (`POST`/`PUT`/`DELETE` on `/api/invitations`).
 * The lock is ON by default while `/admin` is disabled. To re-enable writes later, set the
 * server-side environment variable `ADMIN_API_ENABLED=true` (e.g. in Vercel project settings).
 */

import { NextResponse } from 'next/server';

/**
 * Returns a 403 response when invitation write operations are locked, otherwise `null`.
 */
export function lockedWriteResponse(): NextResponse | null {
  if (process.env.ADMIN_API_ENABLED === 'true') return null;
  return NextResponse.json(
    { error: 'تعديل الدعوات عبر الواجهة البرمجية معطّل حالياً.' },
    { status: 403 }
  );
}
