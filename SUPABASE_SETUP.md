# Supabase setup for LocIntel (no mock data)

Your app uses **real data only** from Supabase. Use this so the properties and contact flow work.

## 1. Environment variables

In `.env.local` (or Vercel):

- `NEXT_PUBLIC_SUPABASE_URL` — your project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/public key

## 2. Database schema

Run the SQL in `supabase/setup.sql` in the Supabase SQL editor if you haven’t already. It creates:

- **users** — id, phone, email, name, type (SEEKER | LANDLORD), verified
- **properties** — id, landlord_id (→ users.id), title, location, city, latitude, longitude, rent, size_sqft, type, status, amenities (array), images (array), match_score, badge, views_count, etc.
- **inquiries** — for saving contact requests (optional; contact works via WhatsApp/Email without this)

## 3. For “Contact Owner” to work

- **users** must have **phone** and/or **email** for landlord accounts.
- **properties.landlord_id** must point to a valid **users** row (LANDLORD).
- Phone format: include country code (e.g. 919876543210 for India) so WhatsApp links work.

## 4. Property types (exact values)

Use these in **properties.type**:

- `SHOP`
- `RETAIL`
- `OFFICE`
- `FOOD_COURT`
- `WAREHOUSE`
- `OTHER`

## 5. Optional: save inquiries in Supabase

To store “Contact Owner” submissions in your DB, add an API route that inserts into **inquiries** (seeker_id, property_id, landlord_id, message, visit_date, status). The current schema requires **seeker_id** and **landlord_id**; if you want guest inquiries, add a nullable **seeker_id** or a “guest” user and update the table/API accordingly.

## 6. Seed data (optional)

Run `supabase/seed.sql` to insert sample users and properties so the properties page shows data immediately. Replace or extend with your own data.
