-- Update location scores with real data

TRUNCATE TABLE location_scores;

INSERT INTO location_scores 
        (area_name, city, latitude, longitude, foot_traffic_score, competition_density, 
         demographics_score, spending_power, safety_score, overall_score)
        VALUES (
            'MG Road', 'Bangalore', 12.9716, 77.5946,
            95, 40,
            90, 92,
            85, 81
        );
INSERT INTO location_scores 
        (area_name, city, latitude, longitude, foot_traffic_score, competition_density, 
         demographics_score, spending_power, safety_score, overall_score)
        VALUES (
            'Koramangala', 'Bangalore', 12.9352, 77.6245,
            75, 20,
            90, 82,
            85, 69
        );
INSERT INTO location_scores 
        (area_name, city, latitude, longitude, foot_traffic_score, competition_density, 
         demographics_score, spending_power, safety_score, overall_score)
        VALUES (
            'Indiranagar', 'Bangalore', 12.9784, 77.6408,
            70, 40,
            90, 80,
            85, 72
        );
INSERT INTO location_scores 
        (area_name, city, latitude, longitude, foot_traffic_score, competition_density, 
         demographics_score, spending_power, safety_score, overall_score)
        VALUES (
            'Whitefield', 'Bangalore', 12.9698, 77.75,
            60, 60,
            90, 75,
            75, 71
        );
INSERT INTO location_scores 
        (area_name, city, latitude, longitude, foot_traffic_score, competition_density, 
         demographics_score, spending_power, safety_score, overall_score)
        VALUES (
            'Jayanagar', 'Bangalore', 12.9308, 77.5838,
            55, 20,
            60, 57,
            75, 51
        );
INSERT INTO location_scores 
        (area_name, city, latitude, longitude, foot_traffic_score, competition_density, 
         demographics_score, spending_power, safety_score, overall_score)
        VALUES (
            'Electronic City', 'Bangalore', 12.8458, 77.6785,
            40, 80,
            60, 50,
            75, 58
        );
INSERT INTO location_scores 
        (area_name, city, latitude, longitude, foot_traffic_score, competition_density, 
         demographics_score, spending_power, safety_score, overall_score)
        VALUES (
            'HSR Layout', 'Bangalore', 12.9121, 77.6446,
            65, 40,
            75, 70,
            75, 64
        );
INSERT INTO location_scores 
        (area_name, city, latitude, longitude, foot_traffic_score, competition_density, 
         demographics_score, spending_power, safety_score, overall_score)
        VALUES (
            'Marathahalli', 'Bangalore', 12.9591, 77.6974,
            70, 40,
            60, 65,
            75, 61
        );
INSERT INTO location_scores 
        (area_name, city, latitude, longitude, foot_traffic_score, competition_density, 
         demographics_score, spending_power, safety_score, overall_score)
        VALUES (
            'Bannerghatta Road', 'Bangalore', 12.87, 77.595,
            50, 60,
            60, 55,
            75, 57
        );
INSERT INTO location_scores 
        (area_name, city, latitude, longitude, foot_traffic_score, competition_density, 
         demographics_score, spending_power, safety_score, overall_score)
        VALUES (
            'JP Nagar', 'Bangalore', 12.9165, 77.585,
            60, 40,
            75, 67,
            75, 62
        );

-- Insert realistic properties

TRUNCATE TABLE properties CASCADE;

INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+919876543210'), 
                'Prime retail space - MG Road',
                'MG Road, Bangalore',
                'Bangalore',
                12.9716, 77.5946,
                74736, 346, 'SHOP', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power'],
                ARRAY['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80'],
                70, NULL, 0
            );
INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+919876543210'), 
                'Modern office space - MG Road',
                'MG Road, Bangalore',
                'Bangalore',
                12.9716, 77.5946,
                151020, 839, 'OFFICE', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power', 'Parking', 'Security', 'Lift', 'AC Ready'],
                ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'],
                90, 'Hot', 0
            );
INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+919876543210'), 
                'Prime retail space - Koramangala',
                'Koramangala, Bangalore',
                'Bangalore',
                12.9352, 77.6245,
                56916, 558, 'SHOP', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power'],
                ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'],
                94, 'Featured', 0
            );
INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+919876543210'), 
                'Modern office space - Koramangala',
                'Koramangala, Bangalore',
                'Bangalore',
                12.9352, 77.6245,
                56100, 660, 'OFFICE', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power', 'Parking', 'Security', 'Lift', 'AC Ready'],
                ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'],
                81, NULL, 0
            );
INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+911234567890'), 
                'Neighborhood store - Indiranagar',
                'Indiranagar, Bangalore',
                'Bangalore',
                12.9784, 77.6408,
                34720, 496, 'SHOP', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power', 'Parking', 'Security'],
                ARRAY['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80'],
                81, NULL, 0
            );
INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+911234567890'), 
                'Boutique space - Indiranagar',
                'Indiranagar, Bangalore',
                'Bangalore',
                12.9784, 77.6408,
                43400, 620, 'RETAIL', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power', 'Parking'],
                ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'],
                84, NULL, 0
            );
INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+911234567890'), 
                'Corporate office space - Whitefield',
                'Whitefield, Bangalore',
                'Bangalore',
                12.9698, 77.75,
                62865, 1143, 'OFFICE', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power', 'Parking', 'Security', 'Lift', 'AC Ready'],
                ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'],
                86, 'Hot', 0
            );
INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+919876543210'), 
                'Warehouse with storage - Whitefield',
                'Whitefield, Bangalore',
                'Bangalore',
                12.9698, 77.75,
                75350, 1370, 'WAREHOUSE', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power', 'Loading Dock', '24/7 Access', 'Security'],
                ARRAY['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'],
                93, 'Featured', 0
            );
INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+911234567890'), 
                'Commercial shop - Jayanagar',
                'Jayanagar, Bangalore',
                'Bangalore',
                12.9308, 77.5838,
                13850, 277, 'SHOP', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power', 'Parking', 'Security'],
                ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'],
                82, NULL, 0
            );
INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+919876543210'), 
                'Retail outlet - Jayanagar',
                'Jayanagar, Bangalore',
                'Bangalore',
                12.9308, 77.5838,
                19200, 384, 'RETAIL', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power', 'Parking'],
                ARRAY['https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80'],
                94, 'Featured', 0
            );
INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+919876543210'), 
                'Corporate office space - Electronic City',
                'Electronic City, Bangalore',
                'Bangalore',
                12.8458, 77.6785,
                57785, 1651, 'OFFICE', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power', 'Parking', 'Security', 'Lift', 'AC Ready'],
                ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'],
                77, NULL, 0
            );
INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+919876543210'), 
                'Warehouse with storage - Electronic City',
                'Electronic City, Bangalore',
                'Bangalore',
                12.8458, 77.6785,
                48825, 1395, 'WAREHOUSE', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power', 'Loading Dock', '24/7 Access', 'Security'],
                ARRAY['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'],
                92, 'Featured', 0
            );
INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+911234567890'), 
                'Commercial shop - HSR Layout',
                'HSR Layout, Bangalore',
                'Bangalore',
                12.9121, 77.6446,
                15660, 261, 'SHOP', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power'],
                ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'],
                90, 'Hot', 0
            );
INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+911234567890'), 
                'Retail outlet - HSR Layout',
                'HSR Layout, Bangalore',
                'Bangalore',
                12.9121, 77.6446,
                37620, 627, 'RETAIL', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power', 'Parking'],
                ARRAY['https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80'],
                76, NULL, 0
            );
INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+919876543210'), 
                'Commercial shop - Marathahalli',
                'Marathahalli, Bangalore',
                'Bangalore',
                12.9591, 77.6974,
                12555, 279, 'SHOP', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power'],
                ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'],
                88, 'Hot', 0
            );
INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+911234567890'), 
                'Retail outlet - Marathahalli',
                'Marathahalli, Bangalore',
                'Bangalore',
                12.9591, 77.6974,
                18045, 401, 'RETAIL', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power', 'Parking'],
                ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'],
                83, NULL, 0
            );
INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+911234567890'), 
                'Commercial shop - Bannerghatta Road',
                'Bannerghatta Road, Bangalore',
                'Bangalore',
                12.87, 77.595,
                11720, 293, 'SHOP', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power', 'Parking', 'Security'],
                ARRAY['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80'],
                74, NULL, 0
            );
INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+911234567890'), 
                'Retail outlet - Bannerghatta Road',
                'Bannerghatta Road, Bangalore',
                'Bangalore',
                12.87, 77.595,
                21040, 526, 'RETAIL', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power', 'Parking'],
                ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'],
                78, NULL, 0
            );
INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+919876543210'), 
                'Neighborhood store - JP Nagar',
                'JP Nagar, Bangalore',
                'Bangalore',
                12.9165, 77.585,
                25685, 467, 'SHOP', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power', 'Parking', 'Security'],
                ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'],
                77, NULL, 0
            );
INSERT INTO properties 
            (landlord_id, title, location, city, latitude, longitude, rent, size_sqft, 
             type, status, verified, amenities, images, match_score, badge, views_count)
            VALUES (
                (SELECT id FROM users WHERE phone = '+919876543210'), 
                'Boutique space - JP Nagar',
                'JP Nagar, Bangalore',
                'Bangalore',
                12.9165, 77.585,
                16500, 300, 'RETAIL', 
                'AVAILABLE', true,
                ARRAY['Water', 'Power', 'Parking'],
                ARRAY['https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80'],
                78, NULL, 0
            );

-- Generated 20 properties across 10 areas