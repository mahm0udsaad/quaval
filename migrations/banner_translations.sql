-- Create the banner_translations table
CREATE TABLE IF NOT EXISTS banner_translations (
    id SERIAL PRIMARY KEY,
    banner_id INTEGER NOT NULL REFERENCES banners(id) ON DELETE CASCADE,
    locale VARCHAR(10) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    button_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(banner_id, locale)
);

-- Example translations for banner with ID 35
-- English data is already in the banners table:
-- INSERT INTO "public"."banners" ("id", "title", "description", "button_text", "button_link", "image")
-- VALUES ('35', 'Premium Quality Bearings', 'Discover our extensive range of high-quality industrial bearings', 'Shop Now', '/products', 'https://www.quaval.ca/images/home/slider/06.jpg');

-- Spanish translations for banner ID 35
INSERT INTO banner_translations (banner_id, locale, title, description, button_text)
VALUES 
    (35, 'es', 'Rodamientos de Calidad Premium', 'Descubra nuestra amplia gama de rodamientos industriales de alta calidad', 'Comprar Ahora');

-- French translations for banner ID 35
INSERT INTO banner_translations (banner_id, locale, title, description, button_text)
VALUES 
    (35, 'fr', 'Roulements de Qualité Supérieure', 'Découvrez notre large gamme de roulements industriels de haute qualité', 'Acheter Maintenant');

-- If you have additional banners, add their translations below:

-- Example for banner ID 36 (adjust the banner_id to match your actual data)
-- Spanish translations
INSERT INTO banner_translations (banner_id, locale, title, description, button_text)
VALUES 
    (36, 'es', 'Distribuidor Exclusivo de Kinex', 'Rodamientos europeos premium ahora disponibles en todo Canadá', 'Más Información');

-- French translations
INSERT INTO banner_translations (banner_id, locale, title, description, button_text)
VALUES 
    (36, 'fr', 'Distributeur Exclusif de Kinex', 'Roulements européens de qualité supérieure maintenant disponibles partout au Canada', 'En Savoir Plus');

-- Example for banner ID 37 (adjust the banner_id to match your actual data)
-- Spanish translations
INSERT INTO banner_translations (banner_id, locale, title, description, button_text)
VALUES 
    (37, 'es', 'Experiencia Técnica', 'Nuestros ingenieros le ayudan a encontrar las soluciones de rodamientos perfectas para su aplicación', 'Contáctenos');

-- French translations
INSERT INTO banner_translations (banner_id, locale, title, description, button_text)
VALUES 
    (37, 'fr', 'Expertise Technique', 'Nos ingénieurs vous aident à trouver les solutions de roulements parfaites pour votre application', 'Contactez-Nous');

-- Make sure to replace the banner IDs with the actual IDs from your database
-- You can find your banner IDs by running: SELECT id FROM banners; 