'use client';

/**
 * @file page.jsx
 * @description Dynamic route (`/demo/[slug]`) that renders live interactive previews
 * of ZARIA's digital invitation templates without marketing navigation chrome.
 */

// 1. React and Next.js core modules
import { use } from 'react';
import { notFound } from 'next/navigation';

// 3. Internal components, hooks, and utility functions
import TemplateRenderer from '@/components/templates/TemplateRenderer';

/**
 * List of supported template slugs allowed on `/demo/[slug]`.
 * @type {import('@/types/zaria').TemplateSlug[]}
 */
const VALID_TEMPLATES = [
  'wedding-royal',
  'wedding-classic',
  'engagement-floral',
  'graduation-modern',
  'birthday-fun',
  'newborn-cute',
  'graduation-notebook',
];

/**
 * Renders a full-screen interactive demo for the requested invitation template slug.
 * Triggers Next.js `notFound()` if the slug does not match a registered template.
 *
 * @param {Object} props - Route component props.
 * @param {Promise<{ slug: string }>} props.params - Asynchronous Next.js dynamic route params.
 * @returns {JSX.Element} Full-screen template demo view.
 */
export default function DemoPage({ params }) {
  // Unwrap the Next.js 15+ async route parameters promise
  const unwrappedParams = use(params);
  const { slug } = unwrappedParams;

  // Validate that the requested template slug exists in our registry
  if (!VALID_TEMPLATES.includes(/** @type {import('@/types/zaria').TemplateSlug} */ (slug))) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black w-full" dir="rtl">
      {/* Render the standalone template experience with its themed floating Back button */}
      <TemplateRenderer templateId={/** @type {import('@/types/zaria').TemplateSlug} */ (slug)} />
    </div>
  );
}
