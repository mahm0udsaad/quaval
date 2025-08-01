-- Add missing content blocks for complete admin functionality
-- This script ensures all content blocks referenced in the admin interface exist

DO $$
DECLARE
    features_section_id INTEGER;
    about_section_id INTEGER;
    cta_section_id INTEGER;
BEGIN
    -- Get section IDs
    SELECT id INTO features_section_id FROM home_sections WHERE section_key = 'features';
    SELECT id INTO about_section_id FROM home_sections WHERE section_key = 'about';
    SELECT id INTO cta_section_id FROM home_sections WHERE section_key = 'cta';

    -- Ensure all features section blocks exist
    INSERT INTO home_content_blocks (section_id, block_key, block_type, content, sort_order) VALUES 
    (features_section_id, 'features_heading', 'text', '{"text": "Welcome", "tag": "badge"}', 1),
    (features_section_id, 'features_title', 'text', '{"text": "Why Choose Quaval Bearings"}', 2),
    (features_section_id, 'features_subtitle', 'text', '{"text": "Discover the advantages of working with industry-leading bearing specialists"}', 3)
    ON CONFLICT (section_id, block_key) DO NOTHING;

    -- Ensure all about section additional blocks exist
    INSERT INTO home_content_blocks (section_id, block_key, block_type, content, sort_order) VALUES 
    (about_section_id, 'about_policy_title', 'text', '{"text": "Our Policy", "tag": "badge"}', 12),
    (about_section_id, 'about_policy_content', 'text', '{"text": "We are committed to providing exceptional quality and service to all our customers."}', 13),
    (about_section_id, 'about_mission_title', 'text', '{"text": "Our Mission", "tag": "badge"}', 14),
    (about_section_id, 'about_mission_content', 'text', '{"text": "To deliver the highest quality bearing solutions that exceed customer expectations and drive industrial success."}', 15),
    (about_section_id, 'about_mission_benefits', 'text', '{"text": "• Industry-leading quality standards\\n• Comprehensive technical support\\n• Fast delivery and reliable service\\n• Custom solutions for unique requirements"}', 16),
    (about_section_id, 'about_history_title', 'text', '{"text": "Our History", "tag": "badge"}', 17),
    (about_section_id, 'about_history_content', 'text', '{"text": "For over 15 years, Quaval has been at the forefront of bearing technology, serving industries across North America with premium solutions and exceptional service."}', 18),
    (about_section_id, 'about_history_source', 'text', '{"text": "Established 2009 - Toronto, Canada"}', 19)
    ON CONFLICT (section_id, block_key) DO NOTHING;

    -- Ensure all CTA section blocks exist (these should already exist from main migration)
    INSERT INTO home_content_blocks (section_id, block_key, block_type, content, sort_order) VALUES 
    (cta_section_id, 'cta_heading', 'text', '{"text": "Get Started Today", "tag": "badge"}', 1),
    (cta_section_id, 'cta_title', 'text', '{"text": "Ready to Find Your Perfect Bearing Solution?"}', 2),
    (cta_section_id, 'cta_subtitle', 'text', '{"text": "Get expert advice and premium quality bearings delivered to your doorstep"}', 3),
    (cta_section_id, 'cta_feature_1', 'feature', '{"icon": "Truck", "title": "Fast Shipping", "description": "Quick delivery across North America"}', 4),
    (cta_section_id, 'cta_feature_2', 'feature', '{"icon": "CheckCircle", "title": "Quality Guaranteed", "description": "All products backed by warranty"}', 5),
    (cta_section_id, 'cta_feature_3', 'feature', '{"icon": "PenTool", "title": "Custom Solutions", "description": "Tailored to your specifications"}', 6)
    ON CONFLICT (section_id, block_key) DO NOTHING;

END $$;