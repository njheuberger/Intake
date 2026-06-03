# DesignSwiss Field Intake App

Private iPad-friendly intake app for capturing customer details, project requirements, site visit notes, measurements, photos, and early estimate line items.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, and Storage
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

## Phase 1 Scope

Included:

- Login/logout
- Protected app routes
- Dashboard summary
- Customer create/list/detail
- Project create/list/detail
- Site visit capture
- Estimate line item capture with calculated totals
- Private project photo upload and gallery
- Supabase SQL schema and setup notes

Not included yet:

- Invoicing
- Payment processing
- Customer portal
- AI summaries
- PDF generation
- E-signature
- Multi-user roles
