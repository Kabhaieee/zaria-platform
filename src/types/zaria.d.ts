/**
 * @file zaria.d.ts
 * @description Centralized TypeScript type definitions and interfaces for the ZARIA
 * Luxury Digital Invitations platform. Provides strict type safety across pages,
 * UI components, interactive invitation templates, custom client invitations,
 * RSVP submissions, and localization utilities.
 */

import type { ReactNode } from 'react';

/**
 * Supported application locales.
 */
export type LanguageCode = 'ar' | 'en';

/**
 * Shape of the global localization context provided by `LanguageProvider`.
 */
export interface LanguageContextValue {
  /** Currently active language code ('ar' or 'en'). */
  language: LanguageCode;
  /** Toggles between Arabic ('ar') and English ('en') and persists to localStorage. */
  toggleLanguage: () => void;
  /** Resolves a dot-notated translation key (e.g., 'hero.title_1') into localized text or structured content. */
  t: <T = string>(key: string) => T;
}

/**
 * Valid identifiers for interactive invitation template designs.
 */
export type TemplateSlug =
  | 'wedding-royal'
  | 'wedding-classic'
  | 'engagement-floral'
  | 'graduation-modern'
  | 'graduation-notebook'
  | 'birthday-fun'
  | 'newborn-cute';

/**
 * Filter categories available on the Templates gallery page.
 */
export type TemplateCategory = 'all' | 'wedding' | 'graduation' | 'engagement' | 'special';

/**
 * Metadata item representing a template card in the Templates collection grid.
 */
export interface TemplateCardItem {
  /** Unique slug matching a route under `/demo/[slug]` and `/preview/[templateId]`. */
  id: TemplateSlug;
  /** One or more category identifiers used for filtering. */
  category: TemplateCategory | TemplateCategory[];
  /** Localized display name of the template card. */
  name: string;
  /** Tailwind CSS classes for the outer card surface and border. */
  style: string;
  /** Tailwind CSS classes for the inner decorative frame border. */
  innerStyle: string;
  /** Decorative emoji or symbol displayed on the card. */
  icon: string;
}

/**
 * Theme-specific styling configuration for the floating Back button in `TemplateRenderer`.
 */
export interface BackButtonThemeStyle {
  /** Tailwind CSS classes for the button background, text, border, and shadow. */
  button: string;
  /** Tailwind CSS class for the arrow icon color. */
  icon: string;
}

/**
 * Remaining time breakdown used by event countdown timers.
 */
export interface CountdownTimeLeft {
  /** Remaining whole days until the target event date. */
  days: number;
  /** Remaining hours (0-23). */
  hours: number;
  /** Remaining minutes (0-59). */
  minutes: number;
  /** Remaining seconds (0-59). */
  seconds: number;
}

/**
 * Attendance status options available in the RSVP form ("تأكيد الحضور").
 */
export type RSVPAttendanceStatus = 'attending' | 'not_attending' | 'maybe';

/**
 * State structure for the interactive template RSVP form ("تأكيد الحضور").
 */
export interface TemplateRSVPState {
  /** Full name of the invited guest. */
  name: string;
  /** Number of additional companions accompanying the guest (0 if attending alone). */
  guests: number;
  /** Selected attendance status ('attending', 'not_attending', or 'maybe'). */
  status: RSVPAttendanceStatus;
  /** Optional congratulatory note or wish submitted with the RSVP. */
  message: string;
}

/**
 * State structure for the standalone WhatsApp RSVP form component.
 */
export interface WhatsAppRSVPFormData {
  /** Full name of the invited guest. */
  name: string;
  /** Selected number of attendees as a string ('1' through '5'). */
  guests: string;
  /** Attendance selection ('attending' or 'not_attending'). */
  status: 'attending' | 'not_attending';
}

/**
 * Entry item displayed in the Wishes / Greetings guestbook section ("كلمات المهنئين").
 */
export interface GuestbookEntry {
  /** Display name of the well-wisher. */
  name: string;
  /** Congratulatory message text. */
  message: string;
  /** Tailwind background color class for the circular initial avatar. */
  avatarColor: string;
  /** First Arabic letter of the guest's name rendered inside the avatar badge. */
  avatarLetter: string;
}

/**
 * Memory entry stored in the 3D Graduation Notebook template (`GraduationNotebook`).
 */
export interface NotebookEntry {
  /** Unique numeric identifier (timestamp or seed ID). */
  id: number;
  /** Author's full name. */
  name: string;
  /** Congratulatory message or memory text. */
  message: string;
  /** Optional image URL or object URL for an uploaded photo. */
  image: string | null;
  /** ISO date string (YYYY-MM-DD). */
  date: string;
}

/**
 * Program timeline entry rendered inside invitation templates.
 */
export interface ProgramTimelineItem {
  /** Time range or timestamp string (e.g., '9:00 – 9:20'). */
  time: string;
  /** Title of the program segment. */
  event: string;
  /** Short description of the activity. */
  desc: string;
}

/**
 * Viewport dimensions used by the full-screen `react-confetti` canvas.
 */
export interface ViewportSize {
  /** Window inner width in pixels. */
  width: number;
  /** Window inner height in pixels. */
  height: number;
}

/**
 * Legal page key identifiers corresponding to keys in `translations.js`.
 */
export type LegalContentKey = 'privacy' | 'terms' | 'refund';

/**
 * Individual section within a legal policy document.
 */
export interface LegalPolicySection {
  /** Section heading title. */
  title: string;
  /** Bullet-point paragraphs belonging to the section. */
  items: string[];
}

/**
 * Structured content object for a legal policy page (Privacy, Terms, Refund).
 */
export interface LegalPolicyContent {
  /** Short badge text displayed above the title. */
  badge: string;
  /** Main policy page heading. */
  title: string;
  /** Last updated timestamp label. */
  last_updated: string;
  /** Introductory summary paragraph. */
  intro: string;
  /** Array of detailed policy sections. */
  sections: LegalPolicySection[];
}

/**
 * Data model for individual invitation records in `src/data/invitations.json`.
 */
export interface InvitationRecord {
  /** Unique URL slug for the invitation. */
  id: string;
  /** Groom's first name. */
  groomName: string;
  /** Bride's first name. */
  brideName: string;
  /** Hero cover image URL. */
  coverImage: string;
  /** ISO 8601 date-time string of the event. */
  eventDate: string;
  /** Venue details and Google Maps link. */
  location: {
    venueName: string;
    googleMapsUrl: string;
  };
  /** Couple's story paragraph. */
  story: string;
  /** Optional dress code note. */
  dressCode?: string;
  /** Feature flags controlling which sections render on the invitation page. */
  features: {
    showCountdown: boolean;
    showStory: boolean;
    enableRSVP: boolean;
  };
}

/**
 * Individual RSVP and/or wish entry submitted by a guest for a specific client invitation `slug`.
 */
export interface ClientRSVPEntry {
  /** Unique RSVP identifier. */
  id: string;
  /** Client invitation slug this RSVP belongs to. */
  slug: string;
  /** Guest's full name ("الاسم الكريم"). */
  name: string;
  /** Attendance status ('attending', 'not_attending', or 'maybe'). */
  status: RSVPAttendanceStatus;
  /** Number of accompanying companions ("عدد المرافقين"). */
  guests: number;
  /** Optional congratulatory wish ("كلمة المهنئين"). */
  message: string;
  /** Optional photo data URL/URL (used in GraduationNotebook). */
  image?: string | null;
  /** ISO 8601 timestamp when the RSVP was submitted. */
  createdAt: string;
}

/**
 * Customizable client invitation record passed via `customData` to any of the 7 master templates.
 * Any field left blank or undefined automatically falls back to the master template's showcase defaults.
 */
export interface CustomInvitationData {
  /** Unique URL identifier for `/invite/[slug]` (e.g., 'ahmad-sara'). */
  slug: string;
  /** Which of the 7 master templates to use as the visual base. */
  templateId: TemplateSlug;
  /** Groom & Bride names (e.g., 'أحمد & سارة') or main celebrant/event title. */
  hostNames?: string;
  /** Alias for `hostNames` supporting couple invitations. */
  coupleNames?: string;
  /** Custom invitation wording, blessing, or welcome poem. */
  welcomeMessage?: string;
  /** Alias for `welcomeMessage`. */
  invitationText?: string;
  /** Custom event date in YYYY-MM-DD format (or custom Arabic date string). */
  eventDate?: string;
  /** Custom event time in HH:mm format (or custom Arabic time string). */
  eventTime?: string;
  /** Hall, hotel, or reception venue name. */
  venueName?: string;
  /** Google Maps location URL. */
  locationUrl?: string;
  /** Optional custom YouTube video ID or URL; falls back to template default song if empty. */
  youtubeVideoId?: string;
  /** Optional custom note(s) (e.g., 'جنة الأطفال منازلهم' or newline-separated notes). */
  customNote?: string;
  /** Creation timestamp. */
  createdAt?: string;
  /** Last update timestamp. */
  updatedAt?: string;
  /** Optional hydrated RSVPs list attached in the Admin Dashboard view. */
  rsvps?: ClientRSVPEntry[];
  /** Optional path (from `/public`) of a custom hero background video or image (e.g. '/omar-ayat/hero.mp4'). */
  backgroundMedia?: string;
  /** Optional poster image path (from `/public`) shown before a custom background video loads. */
  backgroundPoster?: string;
  /** Optional path (from `/public`) of a custom opening intro splash screen video (e.g. '/omar-ayat/video.mp4'). */
  introMedia?: string;
  /** Optional poster image path (from `/public`) for the opening intro splash screen video. */
  introPoster?: string;
  /** Optional custom color theme override (e.g., 'burgundy' for Royal Burgundy & Warm Champagne). */
  theme?: string;
  /** Whether to hide the RSVP form section ("تأكيد الحضور"). */
  hideRsvp?: boolean;
  /** Whether to hide the guest wishes/comments section ("كلمات المهنئين"). */
  hideWishes?: boolean;
  /** Permanent demo congratulatory wishes shown in "كلمات المهنئين" for this client. */
  initialWishes?: { name: string; message: string }[];
}

/**
 * Common props for decorative SVG icon helper components in invitation templates.
 */
export interface DecorativeIconProps {
  /** Optional Tailwind CSS size/positioning classes. */
  className?: string;
  /** Optional SVG stroke/fill hex color override. */
  color?: string;
}

/**
 * Props for scroll-triggered fade-in animation wrappers.
 */
export interface FadeInWrapperProps {
  /** Child elements to animate into view. */
  children: ReactNode;
  /** Optional animation delay in seconds. */
  delay?: number;
  /** Optional additional CSS classes. */
  className?: string;
}
