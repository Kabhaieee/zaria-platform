/**
 * @file src/app/templates/page.jsx
 * @description Server route page for the ZARIA Templates Collection gallery (`/templates`).
 * Defines SEO metadata and renders the interactive `TemplatesClient` component.
 */

import TemplatesClient from './TemplatesClient';

/**
 * Page-level SEO metadata for the Templates Collection page.
 * @type {import('next').Metadata}
 */
export const metadata = {
  title: 'Templates Collection | ZARIA',
  description: 'Explore our exclusive collection of luxury digital invitation templates for weddings, graduations, and special events.',
};

/**
 * TemplatesPage Server Component
 *
 * @returns {JSX.Element} The rendered Templates Collection page.
 */
export default function TemplatesPage() {
  return <TemplatesClient />;
}
