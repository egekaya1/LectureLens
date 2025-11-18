"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processingStatus, setProcessingStatus] = useState("");
  const router = useRouter();

  async function save() {
    setError("");
    setProcessingStatus("");

    if (!title.trim()) {
      setError("Please enter a title for your lecture");
      return;
    }

    if (!text.trim()) {
      setError("Please enter the lecture transcript");
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You must be logged in to upload lectures");
      setLoading(false);
      return;
    }

    // Insert lecture
    const { data, error: insertError } = await supabase
      .from("lectures")
      .insert({
        title: title.trim(),
        transcript: text.trim(),
        user_id: user.id,
        processing_status: "pending",
      })
      .select();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      setError("Failed to create lecture");
      setLoading(false);
      return;
    }

    const lectureId = data[0].id;

    // Trigger processing via edge function
    setProcessingStatus("Starting AI processing...");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const edgeFunctionUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(
        "https://",
        "https://",
      ).replace(".supabase.co", ".supabase.co/functions/v1");

      const response = await fetch(`${edgeFunctionUrl}/process-lecture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ lectureId }),
      });

      if (!response.ok) {
        console.error("Edge function error:", await response.text());
        setProcessingStatus("Lecture saved! Processing will start shortly.");
      } else {
        setProcessingStatus("Lecture saved and processing started!");
      }
    } catch (err) {
      console.error("Failed to trigger processing:", err);
      setProcessingStatus("Lecture saved! Processing will start shortly.");
    }

    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Lecture</h1>
          <p className="text-muted">
            Paste your lecture transcript and let AI extract topics, create
            flashcards, and generate study materials
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {processingStatus && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">
                {processingStatus}
              </p>
            </div>
          )}

          {/* Title Input */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Lecture Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to Biology - Cell Structure"
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              disabled={loading}
            />
          </div>

          {/* Transcript Input */}
          <div className="mb-6">
            <label
              htmlFor="transcript"
              className="block text-sm font-medium mb-2"
            >
              Lecture Transcript
            </label>
            <textarea
              id="transcript"
              rows={16}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your lecture notes or transcript here..."
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-mono text-sm resize-y"
              disabled={loading}
            />
            <p className="text-xs text-muted mt-2">{text.length} characters</p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              onClick={save}
              disabled={loading}
              className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Upload and Process Lecture"}
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              disabled={loading}
              className="px-6 py-3 bg-secondary hover:bg-border text-foreground font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 p-6 bg-secondary/50 rounded-xl">
          <h3 className="font-semibold mb-3">Tips for Best Results:</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Include as much detail as possible in your transcript</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                Processing typically takes 30-60 seconds depending on lecture
                length
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                AI will automatically extract topics, create flashcards, and
                generate practice questions
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
