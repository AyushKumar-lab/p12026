-- Create Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('SEEKER', 'LANDLORD')),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Business Profiles Table
CREATE TABLE business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  sub_category TEXT NOT NULL,
  investment_capacity INTEGER NOT NULL,
  target_customers TEXT[] DEFAULT '{}',
  preferred_city TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Properties Table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  rent INTEGER NOT NULL,
  size_sqft INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('SHOP', 'RETAIL', 'OFFICE', 'FOOD_COURT', 'WAREHOUSE', 'OTHER')),
  status TEXT DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'PENDING', 'RENTED', 'UNAVAILABLE')),
  verified BOOLEAN DEFAULT false,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  match_score INTEGER,
  badge TEXT,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Location Scores Table
CREATE TABLE location_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_name TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  foot_traffic_score INTEGER DEFAULT 0,
  competition_density INTEGER DEFAULT 0,
  demographics_score INTEGER DEFAULT 0,
  spending_power INTEGER DEFAULT 0,
  safety_score INTEGER DEFAULT 0,
  overall_score INTEGER DEFAULT 0,
  data_sources JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Inquiries Table
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  landlord_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  visit_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_rent ON properties(rent);
CREATE INDEX idx_location_scores_city ON location_scores(city);
CREATE INDEX idx_location_scores_overall ON location_scores(overall_score);
CREATE INDEX idx_inquiries_seeker ON inquiries(seeker_id);
CREATE INDEX idx_inquiries_property ON inquiries(property_id);
CREATE INDEX idx_reviews_property ON reviews(property_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow read users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow read properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Allow read inquiries" ON inquiries FOR SELECT USING (true);
