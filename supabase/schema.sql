-- =============================================================================
-- ZARIA PLATFORM — Cloud Database Schema (PostgreSQL / Supabase / Neon)
-- =============================================================================
-- Instructions:
-- Run this SQL script in your Supabase SQL Editor or Neon / Vercel Postgres
-- console to provision the platform-wide tables and indexes.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. guestbook_wishes Table
-- Stores congratulatory wishes and memories from both the venue entrance QR
-- (/guestbook/[slug]) and inline invitation wish forms across all events.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.guestbook_wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(120) NOT NULL,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guestbook_wishes_slug_created_at
  ON public.guestbook_wishes (slug, created_at DESC);

-- -----------------------------------------------------------------------------
-- 2. rsvp_responses Table
-- Stores guest attendance confirmations across all client invitations.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rsvp_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(120) NOT NULL,
  guest_name TEXT NOT NULL,
  attending BOOLEAN NOT NULL DEFAULT TRUE,
  guests_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvp_responses_slug_created_at
  ON public.rsvp_responses (slug, created_at DESC);

-- -----------------------------------------------------------------------------
-- Row Level Security (RLS) Policies for Supabase
-- Allows anonymous guests to insert and read wishes/RSVPs via the API.
-- -----------------------------------------------------------------------------
ALTER TABLE public.guestbook_wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'guestbook_wishes' AND policyname = 'Allow public read guestbook_wishes'
  ) THEN
    CREATE POLICY "Allow public read guestbook_wishes"
      ON public.guestbook_wishes FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'guestbook_wishes' AND policyname = 'Allow public insert guestbook_wishes'
  ) THEN
    CREATE POLICY "Allow public insert guestbook_wishes"
      ON public.guestbook_wishes FOR INSERT
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'rsvp_responses' AND policyname = 'Allow public read rsvp_responses'
  ) THEN
    CREATE POLICY "Allow public read rsvp_responses"
      ON public.rsvp_responses FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'rsvp_responses' AND policyname = 'Allow public insert rsvp_responses'
  ) THEN
    CREATE POLICY "Allow public insert rsvp_responses"
      ON public.rsvp_responses FOR INSERT
      WITH CHECK (true);
  END IF;
END
$$;
