/*
# Fix blogs SELECT policy for anon users

The original anon SELECT policy used auth.role() which doesn't work correctly.
Replace with a simple policy: anon can only see published posts, authenticated can see all.
*/

DROP POLICY IF EXISTS "anon_select_blogs" ON blogs;

CREATE POLICY "anon_select_published_blogs" ON blogs FOR SELECT
  TO anon USING (is_published = true);

DROP POLICY IF EXISTS "admin_select_all_blogs" ON blogs;
CREATE POLICY "admin_select_all_blogs" ON blogs FOR SELECT
  TO authenticated USING (true);
