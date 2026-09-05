/*
# Mahalakshmi College of Allied Health Science - Initial Schema

## Overview
Creates all tables needed to run the college website with admin panel.

## New Tables

### 1. `admissions`
Stores student admission applications submitted via the public website.
- `id` - UUID primary key
- `full_name` - Applicant's full name
- `email` - Email address
- `phone` - Phone number
- `dob` - Date of birth
- `gender` - Gender
- `address` - Full address
- `city` / `state` / `pincode` - Location
- `course_applied` - Course they applied for
- `qualification` - Highest qualification
- `percentage` - Marks percentage
- `board` - Board/University name
- `aadhar` - Aadhar number
- `category` - General/OBC/SC/ST
- `message` - Additional message
- `status` - Application status (pending/reviewed/accepted/rejected)
- `created_at` - Submission timestamp

### 2. `contacts`
Stores messages from the Contact Us form.
- `id` - UUID primary key
- `name` - Sender name
- `email` - Sender email
- `phone` - Phone number
- `subject` - Message subject
- `message` - Message body
- `is_read` - Whether admin has read the message
- `created_at` - Submission timestamp

### 3. `blogs`
Blog posts managed by admin and displayed publicly.
- `id` - UUID primary key
- `title` - Blog title
- `slug` - URL-friendly slug
- `excerpt` - Short summary
- `content` - Full HTML/markdown content
- `image_url` - Cover image URL
- `category` - Blog category
- `author` - Author name
- `is_published` - Published/draft status
- `published_at` - Publication timestamp
- `created_at` / `updated_at` - Timestamps

### 4. `page_content`
Stores editable content blocks for each website page.
- `id` - UUID primary key
- `page` - Which page (home, about, courses, campus, fees, contact)
- `section` - Section identifier within the page
- `title` - Section title
- `subtitle` - Section subtitle
- `content` - Main content text
- `extra_data` - JSONB for flexible structured data
- `updated_at` - Last updated timestamp

## Security
- RLS enabled on all tables.
- Public (anon) can INSERT to admissions and contacts.
- Public (anon) can SELECT published blogs and page_content.
- Admin (authenticated) has full CRUD on all tables.
- No user-scoped isolation needed — single admin setup.
*/

-- Admissions table
CREATE TABLE IF NOT EXISTS admissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  dob date,
  gender text,
  address text,
  city text,
  state text,
  pincode text,
  course_applied text NOT NULL,
  qualification text,
  percentage text,
  board text,
  aadhar text,
  category text,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_admissions" ON admissions;
CREATE POLICY "anon_insert_admissions" ON admissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_admissions" ON admissions;
CREATE POLICY "admin_select_admissions" ON admissions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_admissions" ON admissions;
CREATE POLICY "admin_update_admissions" ON admissions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_admissions" ON admissions;
CREATE POLICY "admin_delete_admissions" ON admissions FOR DELETE
  TO authenticated USING (true);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contacts" ON contacts;
CREATE POLICY "anon_insert_contacts" ON contacts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_contacts" ON contacts;
CREATE POLICY "admin_select_contacts" ON contacts FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_contacts" ON contacts;
CREATE POLICY "admin_update_contacts" ON contacts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_contacts" ON contacts;
CREATE POLICY "admin_delete_contacts" ON contacts FOR DELETE
  TO authenticated USING (true);

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  image_url text,
  category text,
  author text DEFAULT 'Admin',
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_blogs" ON blogs;
CREATE POLICY "anon_select_blogs" ON blogs FOR SELECT
  TO anon, authenticated USING (is_published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_insert_blogs" ON blogs;
CREATE POLICY "admin_insert_blogs" ON blogs FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_blogs" ON blogs;
CREATE POLICY "admin_update_blogs" ON blogs FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_blogs" ON blogs;
CREATE POLICY "admin_delete_blogs" ON blogs FOR DELETE
  TO authenticated USING (true);

-- Page content table
CREATE TABLE IF NOT EXISTS page_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  section text NOT NULL,
  title text,
  subtitle text,
  content text,
  extra_data jsonb,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page, section)
);

ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_page_content" ON page_content;
CREATE POLICY "anon_select_page_content" ON page_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_page_content" ON page_content;
CREATE POLICY "admin_insert_page_content" ON page_content FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_page_content" ON page_content;
CREATE POLICY "admin_update_page_content" ON page_content FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_page_content" ON page_content;
CREATE POLICY "admin_delete_page_content" ON page_content FOR DELETE
  TO authenticated USING (true);

-- Seed default page content
INSERT INTO page_content (page, section, title, subtitle, content, extra_data) VALUES
('home', 'hero', 'Mahalakshmi College of Allied Health Science', 'Shaping the Future of Healthcare Education', 'Excellence in Allied Health Sciences education since inception. We provide comprehensive nursing and health science programs with state-of-the-art facilities and experienced faculty.', '{"cta_primary": "Apply Now", "cta_secondary": "Learn More"}'),
('home', 'stats', 'Our Achievements', NULL, NULL, '{"stats": [{"label": "Students", "value": "2"}, {"label": "Average CGPA", "value": "3.50"}, {"label": "Graduates", "value": "95"}]}'),
('home', 'about_snippet', 'About Our College', 'A Legacy of Healthcare Excellence', 'Mahalakshmi College of Allied Health Science is a premier institution dedicated to training the next generation of healthcare professionals. Our programs blend theoretical knowledge with practical skills to produce competent, compassionate caregivers.', NULL),
('about', 'hero', 'About Us', 'Excellence in Healthcare Education', 'Mahalakshmi College of Allied Health Science has been at the forefront of allied health education, producing skilled professionals who serve communities across the nation.', NULL),
('about', 'vision_mission', 'Vision & Mission', NULL, NULL, '{"vision": "To be a globally recognized institution in allied health sciences education, research, and community service.", "mission": "To provide quality education in allied health sciences through innovative teaching methodologies, practical training, and ethical values."}'),
('about', 'principal_message', 'Principal''s Message', 'Dr. S. Mahalakshmi, Principal', 'Welcome to Mahalakshmi College of Allied Health Science. Our institution stands committed to providing world-class healthcare education. We believe in nurturing not just skilled professionals, but compassionate individuals who will make a difference in the healthcare ecosystem. Our faculty, infrastructure, and curriculum are designed to meet global standards while remaining rooted in our cultural values.', NULL),
('courses', 'hero', 'Our Courses', 'Comprehensive Allied Health Science Programs', 'Explore our wide range of undergraduate and postgraduate programs designed to meet the evolving needs of the healthcare industry.', NULL),
('campus', 'hero', 'Our Campus', 'A World-Class Learning Environment', 'Experience our state-of-the-art campus facilities designed to provide the best educational and recreational environment for our students.', NULL),
('fees', 'hero', 'Online Fee Payment', 'Quick, Safe & Secure Payment Portal', 'Pay your tuition fees, hostel fees, and other charges online through our secure payment gateway. All major payment methods accepted.', NULL),
('contact', 'hero', 'Contact Us', 'We''re Here to Help', 'Reach out to us for admissions, course information, or any other queries. Our team is ready to assist you.', NULL),
('contact', 'info', 'Get In Touch', NULL, NULL, '{"address": "Mahalakshmi College of Allied Health Science, Trichy-Salem Highway, Thodayur Post, Melpathu village, Mannachanallur Talak, Trichy - 621213.", "phone": "+91 73588 73106", "email": "admin@mahalakshmicollegeofalliedhealthscience.com", "hours": "Mon-Sat: 9:00 AM - 5:00 PM"}')
ON CONFLICT (page, section) DO NOTHING;

-- Seed sample blog posts
INSERT INTO blogs (title, slug, excerpt, content, image_url, category, author, is_published, published_at) VALUES
('The Future of Nursing: Trends Shaping Healthcare in 2024', 'future-of-nursing-2024', 'Discover the key trends reshaping the nursing profession and how Mahalakshmi College is preparing students for tomorrow''s healthcare challenges.', '<p>The nursing profession is undergoing a transformative period with technological advancements, changing patient demographics, and evolving healthcare systems. At Mahalakshmi College of Allied Health Science, we are at the forefront of preparing our students for these changes.</p><h2>Key Trends</h2><p>1. Telehealth and digital health technologies are becoming integral to nursing practice. Nurses now need to be proficient in using electronic health records, telemedicine platforms, and health monitoring devices.</p><p>2. Specialized nursing roles are expanding. From oncology nursing to critical care and mental health nursing, specialization opens up exciting career pathways.</p><p>3. Evidence-based practice continues to be paramount. Our curriculum emphasizes research skills so graduates can critically evaluate and apply the latest evidence to patient care.</p>', 'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=800', 'Nursing', 'Dr. Priya Nair', true, now() - interval '5 days'),
('Allied Health Sciences: A Gateway to Diverse Healthcare Careers', 'allied-health-sciences-careers', 'Allied health sciences offer a diverse range of career opportunities beyond traditional medicine. Explore the exciting paths available to our graduates.', '<p>Allied health sciences encompass a vast array of healthcare disciplines that support, facilitate, and complement the work of physicians and nurses. Choosing a career in allied health sciences can be incredibly rewarding, both personally and professionally.</p><h2>Career Opportunities</h2><p>Our graduates go on to work in hospitals, clinics, rehabilitation centers, research institutions, and community health organizations. The demand for allied health professionals continues to grow as the population ages and healthcare becomes more complex.</p><p>Programs at Mahalakshmi College include Medical Laboratory Technology, Radiography, Physiotherapy, Medical Records, and Nursing — each offering unique and vital contributions to patient care.</p>', 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800', 'Career', 'Prof. Anjali Menon', true, now() - interval '12 days'),
('Campus Life at Mahalakshmi: Beyond the Classroom', 'campus-life-mahalakshmi', 'College life is more than just studies. Discover the vibrant campus life, extracurricular activities, and community events at our institution.', '<p>At Mahalakshmi College of Allied Health Science, we believe that holistic development is as important as academic excellence. Our campus buzzes with activity year-round, offering students a rich and fulfilling college experience.</p><h2>Student Activities</h2><p>From cultural festivals to sports tournaments, health camps to community outreach programs, there is always something happening on campus. Our student council actively organizes events that build leadership, teamwork, and social responsibility.</p><p>The college also has well-equipped sports facilities, a library with thousands of volumes, and dedicated spaces for arts and cultural activities. We want every student to find their passion and develop it alongside their professional skills.</p>', 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=800', 'Campus Life', 'Admin', true, now() - interval '20 days')
ON CONFLICT (slug) DO NOTHING;
