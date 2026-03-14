-- Seed data for Business Location Intelligence Platform

-- Insert sample users
INSERT INTO users (phone, email, name, type, verified) VALUES
('+911234567890', 'rajesh@example.com', 'Rajesh Sharma', 'LANDLORD', true),
('+919876543210', 'priya@example.com', 'Priya Patel', 'LANDLORD', true),
('+919988776655', 'fahad@example.com', 'Fahad Khan', 'SEEKER', true),
('+917777888999', 'amit@example.com', 'Amit Kumar', 'SEEKER', true);

-- Insert business profiles for seekers
INSERT INTO business_profiles (user_id, category, sub_category, investment_capacity, target_customers, preferred_city) VALUES
((SELECT id FROM users WHERE phone = '+919988776655'), 'Food & Beverage', 'Tea Stall', 150000, ARRAY['Students', 'Office Workers'], 'Bangalore'),
((SELECT id FROM users WHERE phone = '+917777888999'), 'Retail', 'Clothing Store', 500000, ARRAY['Families', 'Young Adults'], 'Bangalore');

-- Insert location scores for Bangalore areas
INSERT INTO location_scores (area_name, city, latitude, longitude, foot_traffic_score, competition_density, demographics_score, spending_power, safety_score, overall_score) VALUES
('MG Road', 'Bangalore', 12.9716, 77.5946, 90, 60, 80, 85, 75, 85),
('Koramangala', 'Bangalore', 12.9352, 77.6245, 75, 70, 85, 80, 80, 78),
('Indiranagar', 'Bangalore', 12.9784, 77.6408, 70, 75, 75, 75, 85, 72),
('Whitefield', 'Bangalore', 12.9698, 77.7500, 60, 50, 70, 70, 80, 65),
('Jayanagar', 'Bangalore', 12.9308, 77.5838, 55, 80, 65, 60, 75, 60),
('Electronic City', 'Bangalore', 12.8458, 77.6785, 40, 30, 50, 45, 70, 35);

-- Insert sample properties
INSERT INTO properties (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, type, status, verified, amenities, images, match_score, badge, views_count) VALUES
((SELECT id FROM users WHERE phone = '+911234567890'), 
 'Prime Commercial Space - MG Road', 
 'MG Road, Bangalore, Karnataka 560001', 
 'Bangalore', 12.9716, 77.5946, 25000, 450, 'SHOP', 'AVAILABLE', true, 
 ARRAY['Water', 'Power', 'Parking'], 
 ARRAY['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80'], 
 95, 'Featured', 0),

((SELECT id FROM users WHERE phone = '+911234567890'), 
 'Street Facing Retail Space', 
 'Koramangala 5th Block, Bangalore', 
 'Bangalore', 12.9352, 77.6245, 18000, 320, 'RETAIL', 'AVAILABLE', true, 
 ARRAY['Water', 'Power'], 
 ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'], 
 88, 'Hot', 0),

((SELECT id FROM users WHERE phone = '+919876543210'), 
 'Food Court Stall - Phoenix Marketcity', 
 'Phoenix Marketcity, Whitefield Road, Bangalore', 
 'Bangalore', 12.9898, 77.7265, 35000, 200, 'FOOD_COURT', 'AVAILABLE', true, 
 ARRAY['Water', 'Power', 'Security'], 
 ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'], 
 92, NULL, 0),

((SELECT id FROM users WHERE phone = '+919876543210'), 
 'Modern Office Space - IT Hub', 
 'Electronic City Phase 1, Bangalore', 
 'Bangalore', 12.8458, 77.6785, 42000, 850, 'OFFICE', 'AVAILABLE', true, 
 ARRAY['Water', 'Power', 'Parking', 'Security'], 
 ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'], 
 85, 'Premium', 0),

((SELECT id FROM users WHERE phone = '+911234567890'), 
 'Budget Shop - Jayanagar', 
 'Jayanagar 4th Block, Bangalore', 
 'Bangalore', 12.9308, 77.5838, 12000, 280, 'SHOP', 'AVAILABLE', true, 
 ARRAY['Water', 'Power'], 
 ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'], 
 75, NULL, 0),

((SELECT id FROM users WHERE phone = '+919876543210'), 
 'Warehouse with Loading Dock', 
 'Whitefield Industrial Area, Bangalore', 
 'Bangalore', 12.9698, 77.7500, 55000, 2000, 'WAREHOUSE', 'AVAILABLE', true, 
 ARRAY['Power', 'Parking', 'Loading Dock'], 
 ARRAY['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'], 
 70, NULL, 0);

-- Insert sample inquiry
INSERT INTO inquiries (seeker_id, property_id, landlord_id, message, visit_date, status) VALUES
((SELECT id FROM users WHERE phone = '+919988776655'),
 (SELECT id FROM properties WHERE title = 'Prime Commercial Space - MG Road'),
 (SELECT id FROM users WHERE phone = '+911234567890'),
 'Hi, I am interested in this property for my tea stall business. Is it available for a 2-year lease?',
 NOW() + INTERVAL '7 days',
 'PENDING');
