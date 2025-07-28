-- Home Page CMS Migration Script
-- This script creates all necessary tables and default data for admin-controlled home page content

-- Create home page sections table
CREATE TABLE IF NOT EXISTS home_sections (
    id SERIAL PRIMARY KEY,
    section_key VARCHAR(50) UNIQUE NOT NULL,
    section_name VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create home page content blocks table
CREATE TABLE IF NOT EXISTS home_content_blocks (
    id SERIAL PRIMARY KEY,
    section_id INTEGER NOT NULL REFERENCES home_sections(id) ON DELETE CASCADE,
    block_key VARCHAR(100) NOT NULL,
    block_type VARCHAR(50) NOT NULL, -- 'text', 'image', 'icon', 'stat', 'feature', 'button'
    content JSONB NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(section_id, block_key)
);

-- Create home page content translations table
CREATE TABLE IF NOT EXISTS home_content_translations (
    id SERIAL PRIMARY KEY,
    content_block_id INTEGER NOT NULL REFERENCES home_content_blocks(id) ON DELETE CASCADE,
    locale VARCHAR(10) NOT NULL,
    translated_content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(content_block_id, locale)
);

-- Create footer content table
CREATE TABLE IF NOT EXISTS footer_content (
    id SERIAL PRIMARY KEY,
    content_key VARCHAR(100) UNIQUE NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- 'text', 'link', 'social_media', 'contact_info', 'image'
    content JSONB NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create footer content translations table
CREATE TABLE IF NOT EXISTS footer_content_translations (
    id SERIAL PRIMARY KEY,
    footer_content_id INTEGER NOT NULL REFERENCES footer_content(id) ON DELETE CASCADE,
    locale VARCHAR(10) NOT NULL,
    translated_content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(footer_content_id, locale)
);

-- Insert default home page sections
INSERT INTO home_sections (section_key, section_name, sort_order) VALUES 
('hero', 'Hero/Banner Section', 1),
('stats', 'Statistics Section', 2),
('about', 'About Section', 3),
('features', 'Features Section', 4),
('featured_products', 'Featured Products Section', 5),
('trusted_partners', 'Trusted Partners Section', 6),
('cta', 'Call to Action Section', 7)
ON CONFLICT (section_key) DO NOTHING;

-- Insert default content blocks for each section
DO $$
DECLARE
    stats_section_id INTEGER;
    about_section_id INTEGER;
    features_section_id INTEGER;
    partners_section_id INTEGER;
    cta_section_id INTEGER;
BEGIN
    -- Get section IDs
    SELECT id INTO stats_section_id FROM home_sections WHERE section_key = 'stats';
    SELECT id INTO about_section_id FROM home_sections WHERE section_key = 'about';
    SELECT id INTO features_section_id FROM home_sections WHERE section_key = 'features';
    SELECT id INTO partners_section_id FROM home_sections WHERE section_key = 'trusted_partners';
    SELECT id INTO cta_section_id FROM home_sections WHERE section_key = 'cta';

    -- Insert stats content blocks
    INSERT INTO home_content_blocks (section_id, block_key, block_type, content, sort_order) VALUES 
    (stats_section_id, 'stat_1', 'stat', '{"value": "15+", "label": "Years Experience", "color": "from-blue-500 to-blue-600"}', 1),
    (stats_section_id, 'stat_2', 'stat', '{"value": "1000+", "label": "Products Count", "color": "from-emerald-500 to-emerald-600"}', 2),
    (stats_section_id, 'stat_3', 'stat', '{"value": "500+", "label": "Clients Count", "color": "from-amber-500 to-amber-600"}', 3),
    (stats_section_id, 'stat_4', 'stat', '{"value": "99%", "label": "Satisfaction Rate", "color": "from-purple-500 to-purple-600"}', 4)
    ON CONFLICT (section_id, block_key) DO NOTHING;

    -- Insert about section content blocks
    INSERT INTO home_content_blocks (section_id, block_key, block_type, content, sort_order) VALUES 
    (about_section_id, 'about_heading', 'text', '{"text": "About Quaval", "tag": "badge"}', 1),
    (about_section_id, 'about_title', 'text', '{"text": "Leading Bearing Solutions Provider"}', 2),
    (about_section_id, 'about_highlight_1_icon', 'icon', '{"icon": "Globe"}', 3),
    (about_section_id, 'about_highlight_1_title', 'text', '{"text": "Global Reach"}', 4),
    (about_section_id, 'about_highlight_1_desc', 'text', '{"text": "Serving customers worldwide with premium bearing solutions"}', 5),
    (about_section_id, 'about_highlight_2_icon', 'icon', '{"icon": "PenTool"}', 6),
    (about_section_id, 'about_highlight_2_title', 'text', '{"text": "Custom Solutions"}', 7),
    (about_section_id, 'about_highlight_2_desc', 'text', '{"text": "Tailored bearing solutions for your specific requirements"}', 8),
    (about_section_id, 'about_image', 'image', '{"url": "https://www.quaval.ca/images/home/mission03.jpg", "alt": "Quaval Bearings Facility"}', 9),
    (about_section_id, 'about_button_1', 'button', '{"text": "Learn More", "link": "/about", "variant": "primary"}', 10),
    (about_section_id, 'about_button_2', 'button', '{"text": "Contact Us", "link": "/contact", "variant": "outline"}', 11)
    ON CONFLICT (section_id, block_key) DO NOTHING;

    -- Insert features section content blocks
    INSERT INTO home_content_blocks (section_id, block_key, block_type, content, sort_order) VALUES 
    (features_section_id, 'features_heading', 'text', '{"text": "Welcome", "tag": "badge"}', 1),
    (features_section_id, 'features_title', 'text', '{"text": "Why Choose Quaval Bearings"}', 2),
    (features_section_id, 'features_subtitle', 'text', '{"text": "Discover the advantages of working with industry-leading bearing specialists"}', 3),
    (features_section_id, 'feature_1', 'feature', '{"icon": "Award", "title": "Premium Quality", "description": "Industry-leading bearings from trusted manufacturers", "color": "bg-blue-100", "textColor": "text-blue-700", "borderColor": "border-blue-200", "hoverColor": "hover:bg-blue-50"}', 4),
    (features_section_id, 'feature_2', 'feature', '{"icon": "Clock", "title": "Fast Delivery", "description": "Quick turnaround times for all your bearing needs", "color": "bg-emerald-100", "textColor": "text-emerald-700", "borderColor": "border-emerald-200", "hoverColor": "hover:bg-emerald-50"}', 5),
    (features_section_id, 'feature_3', 'feature', '{"icon": "Shield", "title": "Expert Support", "description": "Technical expertise to help you choose the right solution", "color": "bg-purple-100", "textColor": "text-purple-700", "borderColor": "border-purple-200", "hoverColor": "hover:bg-purple-50"}', 6)
    ON CONFLICT (section_id, block_key) DO NOTHING;

    -- Insert trusted partners section content blocks
    INSERT INTO home_content_blocks (section_id, block_key, block_type, content, sort_order) VALUES 
    (partners_section_id, 'partners_heading', 'text', '{"text": "Trusted By", "tag": "badge"}', 1),
    (partners_section_id, 'partners_title', 'text', '{"text": "Industry Leaders Choose Quaval"}', 2),
    (partners_section_id, 'partner_logo_1', 'image', '{"url": "/placeholder-logo.svg", "alt": "Partner 1"}', 3),
    (partners_section_id, 'partner_logo_2', 'image', '{"url": "/placeholder-logo.svg", "alt": "Partner 2"}', 4),
    (partners_section_id, 'partner_logo_3', 'image', '{"url": "/placeholder-logo.svg", "alt": "Partner 3"}', 5),
    (partners_section_id, 'partner_logo_4', 'image', '{"url": "/placeholder-logo.svg", "alt": "Partner 4"}', 6),
    (partners_section_id, 'partner_logo_5', 'image', '{"url": "/placeholder-logo.svg", "alt": "Partner 5"}', 7),
    (partners_section_id, 'partner_logo_6', 'image', '{"url": "/placeholder-logo.svg", "alt": "Partner 6"}', 8)
    ON CONFLICT (section_id, block_key) DO NOTHING;

    -- Insert CTA section content blocks
    INSERT INTO home_content_blocks (section_id, block_key, block_type, content, sort_order) VALUES 
    (cta_section_id, 'cta_heading', 'text', '{"text": "Get Started Today", "tag": "badge"}', 1),
    (cta_section_id, 'cta_title', 'text', '{"text": "Ready to Find Your Perfect Bearing Solution?"}', 2),
    (cta_section_id, 'cta_subtitle', 'text', '{"text": "Get expert advice and premium quality bearings delivered to your doorstep"}', 3),
    (cta_section_id, 'cta_feature_1', 'feature', '{"icon": "Truck", "title": "Fast Shipping", "description": "Quick delivery across North America"}', 4),
    (cta_section_id, 'cta_feature_2', 'feature', '{"icon": "CheckCircle", "title": "Quality Guaranteed", "description": "All products backed by warranty"}', 5),
    (cta_section_id, 'cta_feature_3', 'feature', '{"icon": "PenTool", "title": "Custom Solutions", "description": "Tailored to your specifications"}', 6),
    (cta_section_id, 'cta_button_1', 'button', '{"text": "View Products", "link": "/products", "variant": "primary"}', 7),
    (cta_section_id, 'cta_button_2', 'button', '{"text": "Contact Us", "link": "/contact", "variant": "outline"}', 8)
    ON CONFLICT (section_id, block_key) DO NOTHING;
END $$;

-- Insert default footer content
INSERT INTO footer_content (content_key, content_type, content, sort_order) VALUES 
('company_logo', 'image', '{"url": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-W3AYNZkfFMTjKw4qXp4fHkySoTb6oo.png", "alt": "Quaval Bearings Logo"}', 1),
('company_tagline', 'text', '{"text": "Premium bearing solutions for industrial applications"}', 2),
('quick_links_title', 'text', '{"text": "Quick Links"}', 3),
('quick_link_products', 'link', '{"text": "Products", "url": "/products"}', 4),
('quick_link_about', 'link', '{"text": "About", "url": "/about-us"}', 5),
('quick_link_services', 'link', '{"text": "Services", "url": "/services"}', 6),
('quick_link_contact', 'link', '{"text": "Contact", "url": "/contact"}', 7),
('quick_link_resources', 'link', '{"text": "Resources", "url": "/resources"}', 8),
('contact_title', 'text', '{"text": "Contact Us"}', 9),
('contact_address_1', 'text', '{"text": "123 Industrial Way"}', 10),
('contact_address_2', 'text', '{"text": "Toronto, ON M1A 1A1"}', 11),
('contact_phone', 'text', '{"text": "(416) 555-0123"}', 12),
('newsletter_title', 'text', '{"text": "Newsletter"}', 13),
('newsletter_text', 'text', '{"text": "Stay updated with our latest products and offers"}', 14),
('newsletter_placeholder', 'text', '{"text": "Enter your email"}', 15),
('newsletter_button', 'text', '{"text": "Subscribe"}', 16),
('social_facebook', 'social_media', '{"platform": "facebook", "url": "#", "icon": "Facebook"}', 17),
('social_twitter', 'social_media', '{"platform": "twitter", "url": "#", "icon": "Twitter"}', 18),
('social_linkedin', 'social_media', '{"platform": "linkedin", "url": "#", "icon": "LinkedIn"}', 19),
('social_instagram', 'social_media', '{"platform": "instagram", "url": "#", "icon": "Instagram"}', 20),
('copyright', 'text', '{"text": "© 2024 Quaval Bearings. All rights reserved."}', 21)
ON CONFLICT (content_key) DO NOTHING;

-- Add Spanish translations for home content
DO $$
DECLARE
    content_block_record RECORD;
BEGIN
    FOR content_block_record IN 
        SELECT id, content FROM home_content_blocks 
        WHERE block_type IN ('text', 'stat', 'feature', 'button')
    LOOP
        -- Add Spanish translations based on content
        CASE 
            WHEN content_block_record.content->>'text' = 'About Quaval' THEN
                INSERT INTO home_content_translations (content_block_id, locale, translated_content)
                VALUES (content_block_record.id, 'es', '{"text": "Acerca de Quaval", "tag": "badge"}')
                ON CONFLICT (content_block_id, locale) DO NOTHING;
                
            WHEN content_block_record.content->>'text' = 'Leading Bearing Solutions Provider' THEN
                INSERT INTO home_content_translations (content_block_id, locale, translated_content)
                VALUES (content_block_record.id, 'es', '{"text": "Proveedor Líder de Soluciones de Rodamientos"}')
                ON CONFLICT (content_block_id, locale) DO NOTHING;
                
            WHEN content_block_record.content->>'text' = 'Global Reach' THEN
                INSERT INTO home_content_translations (content_block_id, locale, translated_content)
                VALUES (content_block_record.id, 'es', '{"text": "Alcance Global"}')
                ON CONFLICT (content_block_id, locale) DO NOTHING;
                
            WHEN content_block_record.content->>'text' = 'Custom Solutions' THEN
                INSERT INTO home_content_translations (content_block_id, locale, translated_content)
                VALUES (content_block_record.id, 'es', '{"text": "Soluciones Personalizadas"}')
                ON CONFLICT (content_block_id, locale) DO NOTHING;
                
            WHEN content_block_record.content->>'label' = 'Years Experience' THEN
                INSERT INTO home_content_translations (content_block_id, locale, translated_content)
                VALUES (content_block_record.id, 'es', jsonb_set(content_block_record.content, '{label}', '"Años de Experiencia"'))
                ON CONFLICT (content_block_id, locale) DO NOTHING;
                
            ELSE
                -- Continue adding more translations as needed
                NULL;
        END CASE;
    END LOOP;
END $$;

-- Add French translations for home content
DO $$
DECLARE
    content_block_record RECORD;
BEGIN
    FOR content_block_record IN 
        SELECT id, content FROM home_content_blocks 
        WHERE block_type IN ('text', 'stat', 'feature', 'button')
    LOOP
        -- Add French translations based on content
        CASE 
            WHEN content_block_record.content->>'text' = 'About Quaval' THEN
                INSERT INTO home_content_translations (content_block_id, locale, translated_content)
                VALUES (content_block_record.id, 'fr', '{"text": "À Propos de Quaval", "tag": "badge"}')
                ON CONFLICT (content_block_id, locale) DO NOTHING;
                
            WHEN content_block_record.content->>'text' = 'Leading Bearing Solutions Provider' THEN
                INSERT INTO home_content_translations (content_block_id, locale, translated_content)
                VALUES (content_block_record.id, 'fr', '{"text": "Fournisseur Leader de Solutions de Roulements"}')
                ON CONFLICT (content_block_id, locale) DO NOTHING;
                
            WHEN content_block_record.content->>'text' = 'Global Reach' THEN
                INSERT INTO home_content_translations (content_block_id, locale, translated_content)
                VALUES (content_block_record.id, 'fr', '{"text": "Portée Mondiale"}')
                ON CONFLICT (content_block_id, locale) DO NOTHING;
                
            WHEN content_block_record.content->>'text' = 'Custom Solutions' THEN
                INSERT INTO home_content_translations (content_block_id, locale, translated_content)
                VALUES (content_block_record.id, 'fr', '{"text": "Solutions Personnalisées"}')
                ON CONFLICT (content_block_id, locale) DO NOTHING;
                
            WHEN content_block_record.content->>'label' = 'Years Experience' THEN
                INSERT INTO home_content_translations (content_block_id, locale, translated_content)
                VALUES (content_block_record.id, 'fr', jsonb_set(content_block_record.content, '{label}', '"Années d''Expérience"'))
                ON CONFLICT (content_block_id, locale) DO NOTHING;
                
            ELSE
                -- Continue adding more translations as needed
                NULL;
        END CASE;
    END LOOP;
END $$;

-- Add Spanish translations for footer content
INSERT INTO footer_content_translations (footer_content_id, locale, translated_content)
SELECT 
    fc.id,
    'es' as locale,
    CASE 
        WHEN fc.content_key = 'company_tagline' THEN '{"text": "Soluciones premium de rodamientos para aplicaciones industriales"}'
        WHEN fc.content_key = 'quick_links_title' THEN '{"text": "Enlaces Rápidos"}'
        WHEN fc.content_key = 'quick_link_products' THEN '{"text": "Productos", "url": "/products"}'
        WHEN fc.content_key = 'quick_link_about' THEN '{"text": "Acerca de", "url": "/about-us"}'
        WHEN fc.content_key = 'quick_link_services' THEN '{"text": "Servicios", "url": "/services"}'
        WHEN fc.content_key = 'quick_link_contact' THEN '{"text": "Contacto", "url": "/contact"}'
        WHEN fc.content_key = 'quick_link_resources' THEN '{"text": "Recursos", "url": "/resources"}'
        WHEN fc.content_key = 'contact_title' THEN '{"text": "Contáctanos"}'
        WHEN fc.content_key = 'newsletter_title' THEN '{"text": "Boletín"}'
        WHEN fc.content_key = 'newsletter_text' THEN '{"text": "Mantente actualizado con nuestros últimos productos y ofertas"}'
        WHEN fc.content_key = 'newsletter_placeholder' THEN '{"text": "Ingresa tu email"}'
        WHEN fc.content_key = 'newsletter_button' THEN '{"text": "Suscribirse"}'
        WHEN fc.content_key = 'copyright' THEN '{"text": "© 2024 Quaval Bearings. Todos los derechos reservados."}'
        ELSE fc.content
    END as translated_content
FROM footer_content fc
WHERE fc.content_type IN ('text', 'link')
ON CONFLICT (footer_content_id, locale) DO NOTHING;

-- Add French translations for footer content
INSERT INTO footer_content_translations (footer_content_id, locale, translated_content)
SELECT 
    fc.id,
    'fr' as locale,
    CASE 
        WHEN fc.content_key = 'company_tagline' THEN '{"text": "Solutions de roulements premium pour applications industrielles"}'
        WHEN fc.content_key = 'quick_links_title' THEN '{"text": "Liens Rapides"}'
        WHEN fc.content_key = 'quick_link_products' THEN '{"text": "Produits", "url": "/products"}'
        WHEN fc.content_key = 'quick_link_about' THEN '{"text": "À Propos", "url": "/about-us"}'
        WHEN fc.content_key = 'quick_link_services' THEN '{"text": "Services", "url": "/services"}'
        WHEN fc.content_key = 'quick_link_contact' THEN '{"text": "Contact", "url": "/contact"}'
        WHEN fc.content_key = 'quick_link_resources' THEN '{"text": "Ressources", "url": "/resources"}'
        WHEN fc.content_key = 'contact_title' THEN '{"text": "Contactez-Nous"}'
        WHEN fc.content_key = 'newsletter_title' THEN '{"text": "Newsletter"}'
        WHEN fc.content_key = 'newsletter_text' THEN '{"text": "Restez informé de nos derniers produits et offres"}'
        WHEN fc.content_key = 'newsletter_placeholder' THEN '{"text": "Entrez votre email"}'
        WHEN fc.content_key = 'newsletter_button' THEN '{"text": "S''abonner"}'
        WHEN fc.content_key = 'copyright' THEN '{"text": "© 2024 Quaval Bearings. Tous droits réservés."}'
        ELSE fc.content
    END as translated_content
FROM footer_content fc
WHERE fc.content_type IN ('text', 'link')
ON CONFLICT (footer_content_id, locale) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_home_content_blocks_section_id ON home_content_blocks(section_id);
CREATE INDEX IF NOT EXISTS idx_home_content_blocks_sort_order ON home_content_blocks(sort_order);
CREATE INDEX IF NOT EXISTS idx_home_content_translations_locale ON home_content_translations(locale);
CREATE INDEX IF NOT EXISTS idx_footer_content_translations_locale ON footer_content_translations(locale);
CREATE INDEX IF NOT EXISTS idx_home_sections_sort_order ON home_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_footer_content_sort_order ON footer_content(sort_order);

-- Add update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_home_sections_updated_at BEFORE UPDATE ON home_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_home_content_blocks_updated_at BEFORE UPDATE ON home_content_blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_home_content_translations_updated_at BEFORE UPDATE ON home_content_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_footer_content_updated_at BEFORE UPDATE ON footer_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_footer_content_translations_updated_at BEFORE UPDATE ON footer_content_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 