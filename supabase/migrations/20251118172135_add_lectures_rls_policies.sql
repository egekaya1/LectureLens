-- Enable RLS on lectures table
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can view their own lectures
CREATE POLICY "Enable users to view their own data only"
  ON lectures FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can insert lectures with their own user_id
CREATE POLICY "Enable insert for users based on user_id"
  ON lectures FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own lectures
CREATE POLICY "Policy with table joins"
  ON lectures FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE: Users can delete their own lectures
CREATE POLICY "Enable delete for users based on user_id"
  ON lectures FOR DELETE
  USING (auth.uid() = user_id);

-- Service role bypass for edge functions
CREATE POLICY "Service role full access"
  ON lectures
  USING (auth.jwt()->>'role' = 'service_role');