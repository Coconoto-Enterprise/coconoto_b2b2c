-- Users need a matching public profile because blog comments and likes reference blog_authors.
CREATE POLICY "Users can create their own blog profile"
ON blog_authors FOR INSERT
WITH CHECK (auth.uid() = id);
