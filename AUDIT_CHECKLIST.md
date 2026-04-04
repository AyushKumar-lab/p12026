# Audit Fix Checklist (LocIntel Audit v4.0)

> Based on: **LocIntel_Audit_v4 (1).pdf** — Audit Date: 24 March 2026
> Final Score: **2.5 / 10** → Target: **7.0 / 10**
> Status: 🔴 DO NOT LAUNCH → Fix Every Item Below First

**Legend:**
- [ ] Not started
- [~] In progress
- [x] Completed
- [!] Blocked — needs action

> **Who does what:**
> - 🙋 **YOU** — manual action required (login, copy-paste, click, record)
> - 🤖 **ME** — I fix this in code when you say go

---

## 🔴 Phase 0 — CRITICAL FIXES (Day 1 — Est. Time: ~3 hrs)

> These are repeat failures flagged in all 4 audit versions. Fix these FIRST before anything else.

### 0A) Zero Counters on Homepage
- [ ] 🤖 Replace `0+ Locations Analyzed` with real dynamic count from Supabase
- [ ] 🤖 Replace `0+ Businesses Started` with live count
- [ ] 🤖 Replace `0+ Cities Covered` with live count
- [ ] 🤖 Add fallback placeholder (e.g. `500+`) until DB count is live

### 0B) Map Shows Zero Data Points
- [ ] 🤖 Debug why map pins don't load despite backend having data
- [ ] 🤖 Verify Supabase → Leaflet data pipeline (API call → GeoJSON → marker render)
- [ ] 🤖 Add console logging + error boundary for map failures
- [ ] 🙋 Test map on live URL after fix and confirm markers appear

### 0C) Blank `/Properties` Page
- [ ] 🤖 Fix broken route for `/properties` — both nav link and Hero CTA lead to blank page
- [ ] 🤖 Ensure Properties listing page renders with data or a proper empty state
- [ ] 🙋 Click "List Property" in nav and in Hero — confirm page loads

### 0D) Mobile Navigation Broken (Redmi Note 12)
- [ ] 🤖 Fix hamburger menu / nav toggle on mobile viewports (≤ 768px)
- [ ] 🤖 Test nav links open, close, and navigate correctly on mobile
- [ ] 🙋 Manually tap nav on a mobile device and confirm all links work

### 0E) Copyright Year
- [ ] 🤖 Update footer copyright from `© 2023` → `© 2026`

---

## 🟠 Phase 1 — TRUST & CREDIBILITY SPRINT (Day 2–3 — Est. Time: ~5 hrs)

> Current Trust Score: **1.5 / 10** — the lowest in the entire audit. Fix this or users won't trust the product.

### 1A) Founder Transparency
- [ ] 🙋 Provide your name, short bio, and a photo for the About page
- [ ] 🤖 Create `/about` page with Founder section, photo, mission statement
- [ ] 🤖 Add "About" link to main navigation and footer

### 1B) Contact & Support
- [ ] 🙋 Decide on a contact email (e.g. `hello@locintel.in` or personal email)
- [ ] 🤖 Add contact email to footer and About page
- [ ] 🤖 Create a minimal `/contact` page (name, email, message form)

### 1C) FAQ Page
- [ ] 🤖 Create `/faq` page covering:
  - What is LocIntel?
  - How is the score calculated?
  - Is the data accurate?
  - How do I list a property?
  - Is it free?
- [ ] 🤖 Add FAQ link to footer

### 1D) Social Proof
- [ ] 🙋 Get 5 real testimonials from early users (WhatsApp, message friends/family who tested it)
- [ ] 🤖 Add testimonials section to homepage with name, role, quote
- [ ] 🙋 Add your LinkedIn / Twitter profile link to footer

### 1E) Data Source Transparency
- [ ] 🤖 Add a subtle "Data Sources" section or tooltip explaining OSM, Census, etc.
- [ ] 🤖 Show "Last Updated" timestamp on any location reports

---

## 🟡 Phase 2 — MAP FEATURE IMPROVEMENTS (Week 1 — Est. Time: ~8 hrs)

> Current Map Score: **3.5 / 10** — core product feature, must improve.

### 2A) Marker Clustering
- [ ] 🤖 Install and integrate `Leaflet.markercluster` library
- [ ] 🤖 Configure cluster radius for dense Indian cities (Bhubaneswar, Delhi, Mumbai)
- [ ] 🤖 Test clustering does not crash on 500+ markers

### 2B) Color-Coded Pins by Business Type
- [ ] 🤖 Define icon/color scheme: Retail=🔵, Food=🟠, Services=🟢, Healthcare=🔴, etc.
- [ ] 🤖 Implement custom Leaflet `divIcon` per business type
- [ ] 🤖 Add a visible legend on the map (top-right corner)

### 2C) Map Filters
- [ ] 🤖 Add filter sidebar/toolbar: filter by business type, rating, distance
- [ ] 🤖 Implement filter state in React — update markers on filter change
- [ ] 🙋 Test filters on live map and confirm correct markers show/hide

### 2D) India-Specific Data Layers (Phase 2 Innovation)
- [ ] [ ] Add **Festival Foot Traffic** layer (Diwali, Rath Yatra, Navratri surge zones)
- [ ] [ ] Add **Pilgrimage Corridor** layer (Puri Jagannath, Vaishno Devi, Tirupati routes)
- [ ] [ ] Add **Weekly Haat Market** layer (scheduled market days per locality)
- [ ] 🙋 Source data for above from Census / local municipality / district websites

### 2E) Rent Heatmap
- [ ] 🤖 Design a color-coded heatmap overlay showing avg. monthly rent per sqft per locality
- [ ] 🙋 Source rent data: NoBroker, 99acres, MagicBricks (manual CSV export or scrape)
- [ ] 🤖 Integrate heatmap layer as a toggle on the map

---

## 🟡 Phase 3 — ANALYZE PAGE FIXES (Week 1 — Est. Time: ~4 hrs)

> Currently only Step 1 (Location) renders. Steps 2–4 fail on mid-range Android devices.

### 3A) Fix 4-Step Flow on Mobile
- [ ] 🤖 Debug Step 2–4 JavaScript failure on low-end/mid-range Android (< 4GB RAM devices)
- [ ] 🤖 Lazy-load heavy JS chunks — don't load all 4 steps at once
- [ ] 🤖 Add skeleton loaders for each step during load
- [ ] 🙋 Test the full 4-step flow on a physical Android device

### 3B) WhatsApp Button Overlap Fix
- [ ] 🤖 Reposition the floating WhatsApp bubble so it does not block the search bar on mobile
- [ ] 🤖 Use `z-index` audit to prevent future overlapping elements

### 3C) Form Validation & Error States
- [ ] 🤖 Add proper validation messages for empty/wrong inputs in the Analyze form
- [ ] 🤖 Add a friendly error state if the location lookup fails ("No data found for this area")

---

## 🔵 Phase 4 — DATA & ML UPGRADES (Week 2–3 — Est. Time: ~15 hrs)

> Current AI/ML Score: **3.5 / 10** — rule-based formula, must evolve.

### 4A) Data Source Expansion
- [ ] 🤖 Integrate **JustDial** data for Kirana / Retail density in Tier-2/3 cities
- [ ] 🤖 Integrate **Google Places API** for business ratings and review counts
- [ ] 🤖 Integrate **Zomato review count** as foot traffic proxy for F&B locations
- [ ] 🙋 Get Google Places API key (if not already set) — add to `.env`
- [ ] 🤖 Add data.gov.in datasets: population density, industrial zones, MSME clusters

### 4B) ML Model Upgrade
- [ ] 🤖 Move from rule-based scoring formula to **XGBoost** trained model
- [ ] 🤖 Build training dataset using business survival rates (1 yr / 2 yr labels)
- [ ] 🤖 Train model → export as `model.joblib` → serve via `/predict` API
- [ ] 🤖 Add model confidence score display in the UI ("Based on X businesses near you")

### 4C) Architecture Performance
- [ ] 🤖 Implement **PostGIS** extension in Supabase for fast geospatial queries
- [ ] 🤖 Add **Redis** caching layer for city-level search results
- [ ] 🤖 Target: reduce search response time from **8.2s → < 200ms**
- [ ] 🙋 Run a search on live app before and after — record response times

---

## 🔵 Phase 5 — BUSINESS MODEL ACTIVATION (Week 3–4 — Est. Time: ~10 hrs)

> Current Business Model Score: **5.0 / 10** — model exists but is not activated.

### 5A) Lead Generation (Broker Monetization)
- [ ] 🤖 Add "Get Expert Advice" CTA that captures broker lead (name, phone, city, budget)
- [ ] 🤖 Send lead data to Supabase `leads` table + email notification to admin
- [ ] 🙋 Define price per lead: Rs 500–2,000 per qualified lead
- [ ] 🙋 Reach out to 3–5 local brokers to pilot the lead-gen program

### 5B) Premium Site Selection Reports
- [ ] 🤖 Design a downloadable PDF report for any analyzed location (via jsPDF or Puppeteer)
- [ ] 🤖 Gate report download behind a Rs 499 payment (integrate Razorpay)
- [ ] 🙋 Get Razorpay API keys and share with me for integration
- [ ] 🤖 Add "Download Full Report" button on the Analyze results page

### 5C) Residential Feature — "Where Should I Live?"
- [ ] 🤖 Design a new `/residential` page for business owners (commute-to-business scoring)
- [ ] 🤖 Add rent affordability heatmap using NoBroker/99acres data
- [ ] 🤖 Add "Commute Score" for each residential locality relative to the business location

---

## 🟢 Phase 6 — SEO & VIRALITY (Week 4 — Est. Time: ~4 hrs)

### 6A) SEO Basics
- [ ] 🤖 Add unique `<title>` and `<meta description>` for every page
- [ ] 🤖 Add `<h1>` tags on every page (one per page)
- [ ] 🤖 Generate and submit `sitemap.xml` to Google Search Console
- [ ] 🤖 Add `robots.txt` with correct allow/disallow rules
- [ ] 🙋 Register the site in Google Search Console

### 6B) Shareable Reports
- [ ] 🤖 Add "Share this Analysis" button that generates a unique short URL per location
- [ ] 🤖 Each shared URL shows a public summary (no login required)
- [ ] 🤖 Add Open Graph meta tags for WhatsApp/Twitter preview cards

### 6C) WhatsApp Virality Hook
- [ ] 🤖 Add a "Send to WhatsApp" button on Analyze results page with pre-filled message
- [ ] 🤖 Message template: "I analyzed [Location] for [Business Type] — Score: X/10. Check yours: locintel.in/analyze"

---

## 📋 Progress Log

Add one entry whenever a meaningful fix is completed.

| Date | Who | What |
|------|-----|------|
| 2026-03-26 | 🤖 | AUDIT_CHECKLIST.md created from LocIntel Audit v4.0 PDF |

---

## 📊 Score Tracker

Track your progress from v4 scores to targets.

| Category | v4.0 Score | Target |
|---|---|---|
| Concept & Market Fit | 9.0/10 ✅ | 9.5/10 |
| UI/UX Design | 2.0/10 ❌ | 7.0/10 |
| Map Feature Quality | 3.5/10 ❌ | 7.5/10 |
| Technical Architecture | 5.5/10 ⚠️ | 8.0/10 |
| Data Quality & Accuracy | 3.0/10 ❌ | 7.0/10 |
| Trust & Credibility | 1.5/10 ❌ | 7.0/10 |
| Business Model | 5.0/10 ⚠️ | 7.5/10 |
| AI/ML Model Quality | 3.5/10 ❌ | 7.0/10 |
| Execution Speed | 0.5/10 ❌ | 6.0/10 |
| **FINAL SCORE** | **2.5/10** | **7.5/10** |
