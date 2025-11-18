-- Drop and recreate the extension to ensure it's in the public schema
DROP EXTENSION IF EXISTS vector CASCADE;
CREATE EXTENSION vector WITH SCHEMA public;

CREATE TABLE lecture_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lecture_id UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL,
  content TEXT NOT NULL,
  token_count INT,
  embedding vector(1536), -- OpenAI text-embedding-3-small dimensions
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(lecture_id, chunk_index)
);

CREATE INDEX idx_lecture_chunks_lecture_id 
  ON lecture_chunks(lecture_id);

CREATE INDEX idx_lecture_chunks_embedding 
  ON lecture_chunks 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

ALTER TABLE lecture_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view chunks of own lectures"
  ON lecture_chunks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lectures 
      WHERE lectures.id = lecture_chunks.lecture_id 
      AND lectures.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role full access"
  ON lecture_chunks
  USING (auth.jwt()->>'role' = 'service_role');