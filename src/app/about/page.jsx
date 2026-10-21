/**
 * @file page.jsx
 * @description Server page component for the "About Us" route (`/about`).
 * Exports localized SEO metadata and renders the interactive `AboutClient` view.
 */

// 3. Internal components, hooks, and utility functions
import AboutClient from './AboutClient';

/**
 * SEO metadata for the About Us page.
 * @type {import('next').Metadata}
 */
export const metadata = {
  title: 'من نحن | ZARIA',
  description: 'في زاريا (ZARIA)، نؤمن بأن كل مناسبة سعيدة تبدأ من لحظة الدعوة. منصة متخصصة في تصميم وابتكار الدعوات الإلكترونية الفاخرة.',
};

/**
 * Renders the About Us route.
 *
 * @returns {JSX.Element} The AboutClient component.
 */
export default function AboutPage() {
  return <AboutClient />;
}
