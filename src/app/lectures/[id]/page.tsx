"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Topic = {
  id: string;
  title: string;
  summary: string | null;
  order_index: number;
  parent_topic_id: string | null;
};

type Lecture = {
  id: string;
  title: string;
  transcript: string | null;
  processing_status: string | null;
  created_at: string;
  topics: Topic[];
};

export default function LectureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchLecture = async () => {
      const { data, error } = await supabase
        .from("lectures")
        .select(
          `
                    id,
                    title,
                    transcript,
                    processing_status,
                    created_at,
                    topics (
                        id,
                        title,
                        summary,
                        order_index,
                        parent_topic_id
                    )
                `,
        )
        .eq("id", params.id)
        .single();

      if (error || !data) {
        setError("Lecture not found or you don't have access");
        setLoading(false);
        return;
      }

      // Sort topics by order_index
      const sortedTopics = (data.topics as Topic[]).sort(
        (a, b) => a.order_index - b.order_index,
      );

      setLecture({ ...data, topics: sortedTopics } as Lecture);
      setLoading(false);
    };

    fetchLecture();
  }, [params.id]);

  const toggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Loading lecture...</p>
        </div>
      </div>
    );
  }

  if (error || !lecture) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Lecture Not Found</h2>
          <p className="text-muted mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-4"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{lecture.title}</h1>
              <p className="text-muted text-sm">
                Created {formatDate(lecture.created_at)}
              </p>
            </div>

            {/* Status Badge */}
            <div>
              {lecture.processing_status === "completed" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  ✓ Completed
                </span>
              )}
              {lecture.processing_status === "processing" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  <svg
                    className="animate-spin -ml-0.5 mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Topics Section */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Topics</h2>
            <span className="text-sm text-muted">
              {lecture.topics.length}{" "}
              {lecture.topics.length === 1 ? "topic" : "topics"}
            </span>
          </div>

          {lecture.topics.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              {lecture.processing_status === "processing" ? (
                <>
                  <p className="text-muted mb-2">
                    AI is processing your lecture...
                  </p>
                  <p className="text-sm text-muted">
                    Topics will appear here shortly
                  </p>
                </>
              ) : (
                <p className="text-muted">No topics extracted yet</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {lecture.topics.map((topic, index) => (
                <div
                  key={topic.id}
                  className={`border border-border rounded-xl overflow-hidden transition-all ${
                    topic.parent_topic_id ? "ml-8" : ""
                  }`}
                >
                  <button
                    onClick={() => toggleTopic(topic.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-semibold shrink-0">
                        {index + 1}
                      </span>
                      <h3 className="font-semibold text-lg">{topic.title}</h3>
                    </div>
                    <svg
                      className={`w-5 h-5 text-muted transition-transform ${
                        expandedTopics.has(topic.id) ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {expandedTopics.has(topic.id) && topic.summary && (
                    <div className="px-6 pb-6 pt-2">
                      <div className="pl-11">
                        <p className="text-muted leading-relaxed whitespace-pre-wrap">
                          {topic.summary}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
