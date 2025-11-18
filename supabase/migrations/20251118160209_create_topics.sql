-- Topics table for hierarchical topic extraction
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lecture_id UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT,
  parent_topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Prevent orphaned parent references
  CHECK (id != parent_topic_id)
);

-- Indexes
CREATE INDEX idx_topics_lecture_id ON topics(lecture_id);
CREATE INDEX idx_topics_user_id ON topics(user_id);
CREATE INDEX idx_topics_parent_topic_id ON topics(parent_topic_id);

-- Enable RLS
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own topics"
  ON topics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own topics"
  ON topics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own topics"
  ON topics FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own topics"
  ON topics FOR DELETE
  USING (auth.uid() = user_id);

-- Service role full access
CREATE POLICY "Service role full access"
  ON topics
  USING (auth.jwt()->>'role' = 'service_role');