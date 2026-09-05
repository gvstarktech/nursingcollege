-- Create seo_settings table
CREATE TABLE IF NOT EXISTS public.seo_settings (
    page_path text PRIMARY KEY,
    title text NOT NULL,
    description text,
    keywords text,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on seo_settings"
    ON public.seo_settings FOR SELECT
    TO public
    USING (true);

-- Allow authenticated (admin) users to manage SEO settings
CREATE POLICY "Allow authenticated users to manage seo_settings"
    ON public.seo_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert default optimized SEO data
INSERT INTO public.seo_settings (page_path, title, description, keywords) VALUES
    ('/', 'Best Nursing College in Tamilnadu | Mahalakshmi College of Nursing Trichy', 'Join Mahalakshmi College of Nursing, the best nursing college in Tamilnadu. We offer B.Sc Nursing, GNM, and Post Basic B.Sc with 100% placement and clinical training.', 'best nursing college in tamilnadu, best nursing college in trichy, top nursing college near me, nursing admission 2026, b.sc nursing college tamilnadu'),
    ('/about', 'About Us | Best Nursing College in Tamilnadu | MCN Trichy', 'Learn about Mahalakshmi College of Nursing, recognized as the best nursing college in Tamilnadu, providing world-class healthcare education and simulation labs in Trichy.', 'about mahalakshmi nursing college, best nursing college in tamilnadu, nursing education trichy'),
    ('/courses', 'Nursing Courses | B.Sc Nursing & GNM | Best Nursing College in Tamilnadu', 'Explore our top-rated B.Sc Nursing, GNM, and Post Basic B.Sc programs. Mahalakshmi is the best nursing college in Tamilnadu for clinical exposure and career growth.', 'b.sc nursing course tamilnadu, gnm nursing trichy, best nursing college in tamilnadu courses'),
    ('/contact', 'Contact Us | Best Nursing College in Tamilnadu | Admissions Open', 'Contact Mahalakshmi College of Nursing for B.Sc Nursing admissions. Call us today to join the best nursing college in Tamilnadu.', 'contact nursing college trichy, nursing admissions tamilnadu, best nursing college in tamilnadu admission')
ON CONFLICT (page_path) DO NOTHING;
