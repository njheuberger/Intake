# DesignSwiss Field Intake App

Private iPad-friendly intake app for capturing customer details, project requirements, site visit notes, measurements, photos, early estimate line items, and customer-ready proposals.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, and Storage
- Server-side proposal PDF generation
- Vercel deployment-ready

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. In Supabase, open the SQL editor and run:

```text
supabase/schema.sql
```

This creates the Phase 1 tables, enables Row Level Security, adds single-owner-friendly authenticated policies, and creates the private `project-photos` storage bucket.

If you already ran the main schema before the storage bucket was created, run this smaller storage setup file instead:

```text
supabase/storage.sql
```

This creates or updates the private `project-photos` bucket and refreshes the storage object policies.

4. In Supabase Auth, create your owner/admin user with email and password.

5. Start local development:

```bash
npm run dev
```

Open `http://localhost:3000/login`.

## Supabase Notes

- Do not expose the Supabase service role key in this app.
- The app uses only:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- The storage bucket is private. Photo previews use signed URLs.
- Current RLS policies allow any authenticated user to manage app data, which is appropriate for the Phase 1 single-owner assumption.

## Vercel Deployment

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Add the same environment variables in Vercel Project Settings.
4. Deploy.

## Install on iPad Home Screen

1. Open `https://intake.designswiss.org` in Safari.
2. Tap Share.
3. Tap Add to Home Screen.
4. Name it `DesignSwiss Intake`.
5. Open the app from the Home Screen icon.

## Proposal Generation

Project detail pages include a `Generate Proposal` action. The proposal preview page pulls the customer, project, latest site visit, estimate items, and up to four project photos into a branded DesignSwiss proposal.

From the preview page, `Download PDF` generates a server-side PDF for the authenticated user. PDFs are generated on demand and are not stored in Supabase yet.

PDF filenames use:

```text
DesignSwiss-Proposal-[ProjectName]-[Date].pdf
```

## Current Scope

Included:

- Login/logout
- Protected app routes
- Dashboard summary
- Customer create/list/detail
- Project create/list/detail
- Site visit capture
- Estimate line item capture with calculated totals
- Private project photo upload and gallery
- Proposal preview from project records
- Branded proposal PDF download
- Supabase SQL schema and setup notes

Not included yet:

- Invoicing
- Payment processing
- Customer portal
- AI summaries
- E-signature
- Multi-user roles
- Saved proposal history
