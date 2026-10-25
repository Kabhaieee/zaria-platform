/**
 * @file src/app/admin/page.tsx
 * @description `/admin` is TEMPORARILY DISABLED. Every visit is redirected to the home page.
 *
 * The full dashboard implementation is preserved untouched in
 * `src/components/admin/AdminDashboardView.tsx`.
 *
 * To re-enable the dashboard later, replace the body of this file with:
 *
 * ```tsx
 * import AdminDashboardView from '@/components/admin/AdminDashboardView';
 * export default function AdminPage() {
 *   return <AdminDashboardView />;
 * }
 * ```
 */

import { redirect } from 'next/navigation';

export default function AdminPage() {
  redirect('/');
}
