import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Read Vercel AI Gateway key
const gatewayKey = Deno.env.get("AI_GATEWAY_API_KEY") ?? "";

interface ProcessRequest {
  lectureId: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { lectureId } = (await req.json()) as ProcessRequest;

    if (!lectureId) {
      throw new Error("lectureId is required");
    }

    const supabase = createClient(
      Deno.env.get("NEXT_PUBLIC_SUPABASE_URL") ?? "",
      Deno.env.get("SERVICE_ROLE_KEY") ?? "",
    );

    console.log(`Processing lecture: ${lectureId}`);

    // 1. Fetch lecture
    const { data: lecture, error: fetchError } = await supabase
      .from("lectures")
      .select("id, title, transcript, user_id")
      .eq("id", lectureId)
      .single();

    if (fetchError || !lecture) {
      throw new Error(`Lecture not found: ${fetchError?.message}`);
    }

    await supabase
      .from("lectures")
      .update({ status: "processing" })
      .eq("id", lectureId);

    // 2. Chunk transcript
    const chunks = chunkTranscript(lecture.transcript || "", 500);
    console.log(`Created ${chunks.length} chunks`);

    // 3. Generate embeddings using Vercel AI Gateway
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      const embeddingResponse = await fetch(
        "https://ai-gateway.vercel.sh/v1/embeddings",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${gatewayKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "text-embedding-3-small",
            input: chunk.content,
          }),
        },
      );

      const embeddingData = await embeddingResponse.json();

      if (!embeddingResponse.ok) {
        throw new Error(`Embedding failed: ${JSON.stringify(embeddingData)}`);
      }

      await supabase.from("lecture_chunks").insert({
        lecture_id: lectureId,
        chunk_index: i,
        content: chunk.content,
        token_count: chunk.tokenCount,
        embedding: embeddingData.data[0].embedding,
      });
    }

    // 4. Extract topics using Vercel AI Gateway
    const topicPrompt = `Analyze this lecture transcript and extract 5-8 main topics.
Return ONLY a valid JSON object with this exact structure:
{"topics": [{"title": "Topic Name", "summary": "5-8 sentence in depth summary"}]}

Transcript:
${lecture.transcript?.slice(0, 8000)}`;

    const chatResponse = await fetch(
      "https://ai-gateway.vercel.sh/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${gatewayKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: topicPrompt }],
          temperature: 0.3,
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "topic_extraction",
              description: "Extract main topics from lecture transcript",
              schema: {
                type: "object",
                properties: {
                  topics: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        summary: { type: "string" },
                      },
                      required: ["title", "summary"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["topics"],
                additionalProperties: false,
              },
            },
          },
        }),
      },
    );

    const chatData = await chatResponse.json();

    if (!chatResponse.ok) {
      throw new Error(`Topic extraction failed: ${JSON.stringify(chatData)}`);
    }

    const topicsData = JSON.parse(chatData.choices[0].message.content);
    const topics = topicsData.topics || [];

    console.log(`Extracted ${topics.length} topics`);

    // 5. Insert topics
    if (Array.isArray(topics)) {
      for (let i = 0; i < topics.length; i++) {
        await supabase.from("topics").insert({
          lecture_id: lectureId,
          user_id: lecture.user_id,
          title: topics[i].title,
          summary: topics[i].summary,
          order_index: i,
        });
      }
    }

    // 6. Mark as completed
    await supabase
      .from("lectures")
      .update({
        status: "completed",
        processed_at: new Date().toISOString(),
        topic_count: topics.length,
      })
      .eq("id", lectureId);

    return new Response(
      JSON.stringify({
        success: true,
        topicCount: topics.length,
        chunksProcessed: chunks.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Processing error:", error);

    const supabase = createClient(
      Deno.env.get("NEXT_PUBLIC_SUPABASE_URL") ?? "",
      Deno.env.get("SERVICE_ROLE_KEY") ?? "",
    );

    try {
      const body = await req.json();
      const lectureId = body.lectureId;

      if (lectureId) {
        await supabase
          .from("lectures")
          .update({
            status: "failed",
            processing_error: error.message,
          })
          .eq("id", lectureId);
      }
    } catch {}

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function chunkTranscript(text: string, maxTokens: number) {
  const paragraphs = text.split(/\n\n+/);
  const chunks: { content: string; tokenCount: number }[] = [];

  let currentChunk = "";
  let currentTokens = 0;

  for (const para of paragraphs) {
    const paraTokens = Math.ceil(para.length / 4);

    if (currentTokens + paraTokens > maxTokens && currentChunk) {
      chunks.push({ content: currentChunk.trim(), tokenCount: currentTokens });
      currentChunk = para;
      currentTokens = paraTokens;
    } else {
      currentChunk += "\n\n" + para;
      currentTokens += paraTokens;
    }
  }

  if (currentChunk) {
    chunks.push({ content: currentChunk.trim(), tokenCount: currentTokens });
  }

  return chunks;
}
