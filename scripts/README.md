# Live Data Collector for Business Location Intelligence

This service collects real-time location data and updates the Supabase database automatically.

## Data Sources (100% FREE - No Credit Card Required!)

1. **OpenStreetMap Overpass API** ⭐ PRIMARY
   - **100% FREE** - No account, no API key, no credit card ever!
   - Real business data (restaurants, shops, offices)
   - No rate limits for reasonable use
   - Updates every hour automatically

2. **Google Places API** (Optional - only if you add key later)
   - Requires billing account with credit card
   - Better data quality but not required

3. **Simulated Data** (Fallback)
   - Time-based foot traffic patterns
   - Rent market fluctuations
   - Always works as backup

## Deployment to Render.com (FREE)

### Step 1: Get Supabase Service Role Key (2 minutes)

1. Go to **Supabase Dashboard**
2. Click **"Project Settings"** (gear icon)
3. Go to **"API"** section
4. Copy **`service_role key`** (starts with `eyJhbG...`)
   - This is FREE - just an auth token, no billing

### Step 2: Create Render Account

1. Go to **https://render.com**
2. Sign up with **GitHub**
3. It's FREE for background workers

### Step 3: Deploy Background Worker

1. In Render Dashboard, click **"New +"**
2. Select **"Background Worker"**
3. Connect your GitHub repo (p12026 project)
4. Configure:
   ```
   Name: location-collector
   Runtime: Python 3
   Build Command: cd scripts && pip install -r requirements.txt
   Start Command: cd scripts && python live_data_collector.py --schedule
   Plan: Free
   ```
5. Add Environment Variables:
   ```
   SUPABASE_URL=https://orkbquujvumukzfgm-rqb.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
   
   **That's it! No Google API key needed - OpenStreetMap is free!**

6. Click **"Create Background Worker"**

### Step 4: Verify It's Working

1. In Render Dashboard → Click your worker → **"Logs"** tab
2. You should see:
   ```
   🚀 Starting Live Data Collection
   🗺️  OpenStreetMap: 45 businesses near MG Road
   ✅ Updated MG Road: Overall Score = 78
   ✅ Updated Koramangala: Overall Score = 69
   ...
   ```

3. Go to **Supabase** → **Table Editor** → **location_scores**
4. Check that `updated_at` timestamps are recent

## Local Testing (No Keys Needed!)

```bash
cd scripts
pip install -r requirements.txt

# Run once (for testing)
python live_data_collector.py

# Run continuously (like production)
python live_data_collector.py --schedule
```

You should see OpenStreetMap fetching real business data:
```
🗺️  OpenStreetMap: 45 businesses near MG Road
🗺️  OpenStreetMap: 62 businesses near Koramangala
```

## What Data Gets Updated?

Every hour, the collector updates:
- **Foot Traffic Score** - Based on real business count + time of day
- **Competition Density** - Number of nearby businesses
- **Rent Estimates** - Market rate with daily fluctuations
- **Overall Score** - Combined location intelligence score

All data sources are tracked in the `data_sources` JSON column.

## Optional: Add Google API Later (Not Required!)

If you want even better data quality, you can add Google Places API later:

1. Set up billing at https://console.cloud.google.com
2. Get API key
3. Add to Render environment:
   ```
   GOOGLE_PLACES_API_KEY=your_google_key
   ```

The collector will automatically use Google if available, fallback to OpenStreetMap otherwise.

