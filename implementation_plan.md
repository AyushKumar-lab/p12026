# Niche Focus Page — Restaurants, Pharmacies & Kirana Stores

**Goal:** Create a dedicated `/niches` landing page (and three sub-pages) that speaks directly to the three highest-priority business types. Instead of a generic "AI analyzes your location", each niche page explains *exactly* what LocIntel measures for that business type, what the unique India-specific risks are, and links directly to the `/analyze` flow pre-filtered for that type.

> This is a **pure frontend** task — no new API or DB work needed. All content is hardcoded intelligence. It can be built and shipped in one session.

---

## Why This Matters (from PDF Section 03 & 16)

- "Niche down to restaurants and pharmacies first — **depth beats broad** in early markets."
- Users searching *"best location for pharmacy in Bhubaneswar"* bounce off a generic homepage. A dedicated page with pharmacy-specific scoring criteria converts.
- These three niches cover ~60% of all Tier-2/3 MSME registrations.
- Direct SEO win: targets low-difficulty keywords like `kirana store location tips india` (400-800/month) and `how to find best location for pharmacy india` (300-600/month).

---

## Pages to Build

### 1. `/niches` — Hub Page
A single landing page listing all three niche categories as large, clickable cards. Acts as the entry point from the homepage nav and from `/analyze`.

**Layout:**
- Hero: "Built for Your Business Type, Not Just Any Business"
- 3 large cards: Restaurant | Pharmacy | Kirana Store
- Each card: niche icon, tagline, 3-bullet unique factors, CTA → sub-page

---

### 2. `/niches/restaurant` — Restaurant Intelligence Page

**Sections:**
| Section | Content |
|---|---|
| Hero | "Find a Restaurant Location That Fills Tables, Not Just Space" |
| Unique Scoring Factors | 6 restaurant-specific factors (see below) |
| India-Specific Risks | Diwali/Rath Yatra foot traffic spikes, Sunday lunch rush zones, student colony dinner demand |
| What We Analyze | Visual breakdown of the 6 factors with weights |
| CTA | "Analyze a Restaurant Location" → `/analyze?type=restaurant` |

**6 Restaurant-Specific Scoring Factors:**
1. **Competitor Density** — How many restaurants within 300m/500m/1km (colour-coded saturation)
2. **Foot Traffic Proxy** — Zomato review count density in zone (high reviews = high footfall zone)
3. **Residential Population** — 1BHK/2BHK density within 1km (dinner demand = people living nearby)
4. **Office Cluster Proximity** — IT parks, government offices within 500m (lunch rush source)
5. **Festival Zone Multiplier** — Is this zone near a pilgrimage route or festival corridor?
6. **Parking & Access** — Auto stand proximity (OSM), main road frontage

---

### 3. `/niches/pharmacy` — Pharmacy Intelligence Page

**Sections:**
| Section | Content |
|---|---|
| Hero | "Pharmacies Succeed in Proximity, Not in Discovery" |
| Unique Scoring Factors | 6 pharmacy-specific factors |
| India-Specific Risks | Seasonal monsoon demand, pilgrimage corridor demand spikes |
| What We Analyze | Visual breakdown |
| CTA | "Analyze a Pharmacy Location" → `/analyze?type=pharmacy` |

**6 Pharmacy-Specific Scoring Factors:**
1. **Hospital/Clinic Proximity** — Distance to nearest hospital, clinic, diagnostic centre (Primary signal)
2. **Residential Density** — People within 500m who need regular prescriptions
3. **Competitor Pharmacy Count** — Saturation within 300m (pharmacy is proximity-sensitive)
4. **Senior Population Proxy** — Areas with older housing stock = higher prescription demand
5. **Transport Connectivity** — Bus stops, auto stands within 300m (patients travel on foot or auto)
6. **24hr Demand Potential** — Proximity to ICU/Emergency = night-time demand

---

### 4. `/niches/kirana` — Kirana Store Intelligence Page

**Sections:**
| Section | Content |
|---|---|
| Hero | "Your Kirana's Catchment Area is 300 Metres. Make It Count." |
| Unique Scoring Factors | 6 kirana-specific factors |
| India-Specific Risks | Big Bazaar/DMart effect (organised retail radius kills kiranas within 500m), weekly haat competition |
| What We Analyze | Visual breakdown |
| CTA | "Analyze a Kirana Location" → `/analyze?type=kirana` |

**6 Kirana-Specific Scoring Factors:**
1. **Residential Density (300m)** — Core catchment: households within 300m (primary revenue driver)
2. **Organised Retail Threat** — Distance to DMart, Big Bazaar, Reliance Fresh (< 500m = high risk)
3. **Competitor Kirana Count** — Number of similar stores within 300m
4. **Colony Age** — Older/established colonies = loyal regular customer base
5. **Morning Commuter Access** — Bus stops/auto stands (morning purchase behaviour)
6. **Weekly Haat Proximity** — Nearby haat markets on fixed days = temporary spike + competition

---

## Files to Create

### New Route Files

#### [NEW] `src/app/niches/page.tsx`
Hub page with 3 niche cards. Reuses [GlowCard](file:///d:/Workspace/p12026/src/app/page.tsx#67-86) pattern from [page.tsx](file:///d:/Workspace/p12026/src/app/page.tsx).

#### [NEW] `src/app/niches/restaurant/page.tsx`  
Restaurant niche deep-dive page.

#### [NEW] `src/app/niches/pharmacy/page.tsx`  
Pharmacy niche deep-dive page.

#### [NEW] `src/app/niches/kirana/page.tsx`  
Kirana store niche deep-dive page.

---

### Files to Modify

#### [MODIFY] [src/app/page.tsx](file:///d:/Workspace/p12026/src/app/page.tsx) (Homepage)
- Add a **"Built for Your Business"** section between Features and How It Works
- 3 niche cards with icons, taglines, links to `/niches/{type}`
- Add `"Niches"` link to the nav bar

#### [MODIFY] [src/app/globals.css](file:///d:/Workspace/p12026/src/app/globals.css) (if any new utility classes needed)

---

## Design Direction

- **Color coding by niche** (consistent across all pages):
  - Restaurant → `amber/orange` (warmth, food)
  - Pharmacy → `emerald/teal` (health, clean)  
  - Kirana → `blue/indigo` (trust, everyday)
- Each sub-page uses the same layout shell: hero → factors grid → India insights → CTA
- Factors are displayed as animated score cards (0-100 weight bar) using framer-motion
- Mobile-first, matches existing design system exactly

> [!IMPORTANT]
> No purple/violet colors — follow agent rules. Restaurant = amber, Pharmacy = emerald, Kirana = blue.

---

## Verification Plan

### Manual Verification (Browser)
After implementation, run the dev server:
```powershell
cd d:\Workspace\p12026
npm run dev
```
Then verify in browser at `http://localhost:3000`:

1. **`/niches`** loads — 3 cards visible, each card links to correct sub-page
2. **`/niches/restaurant`** loads — hero, 6 factors grid, India insights section, CTA button
3. **`/niches/pharmacy`** loads — same structure, different content
4. **`/niches/kirana`** loads — same structure, different content (includes DMart threat section)
5. **Homepage** — new "Built for Your Business" section appears between Features and How it Works
6. **Nav** — "Niches" link visible and routes to `/niches`
7. All CTA buttons (`/analyze?type=restaurant` etc.) navigate without 404
8. Mobile: all pages readable at 375px width (Chrome DevTools → iPhone 12)

### No automated tests exist in this project (confirmed from directory scan)
