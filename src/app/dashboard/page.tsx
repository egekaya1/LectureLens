"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type Lecture = {
  id: string;
  title: string;
  transcript: string | null;
  processing_status: string | null;
  created_at: string;
  topics?: Array<{
    id: string;
    title: string;
  }>;
};

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let mounted = true;

    const fetchLectures = async () => {
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
                        title
                    )
                `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (mounted && !error) {
        setLectures(data || []);
      }
      setLoading(false);
    };

    fetchLectures();

    // Set up realtime subscription for status updates
    const channel = supabase
      .channel("lectures-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lectures",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchLectures();
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getStatusBadge = (status: string | null) => {
    const statusConfig = {
      pending: {
        color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        text: "Pending",
      },
      processing: {
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        text: "Processing",
      },
      completed: {
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        text: "Completed",
      },
      failed: {
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        text: "Failed",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {status === "processing" && (
          <svg
            className="animate-spin -ml-0.5 mr-1.5 h-3 w-3"
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
        )}
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Loading your lectures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Lectures</h1>
            <p className="text-muted">
              {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"}{" "}
              total
            </p>
          </div>
          <Link
            href="/upload"
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            Upload Lecture
          </Link>
        </div>

        {/* Empty State */}
        {lectures.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-16 text-center">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-muted"
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
            <h3 className="text-xl font-semibold mb-2">No lectures yet</h3>
            <p className="text-muted mb-6">
              Upload your first lecture to get started with AI-powered study
              tools
            </p>
            <Link
              href="/upload"
              className="inline-block px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
            >
              Upload Your First Lecture
            </Link>
          </div>
        ) : (
          /* Lecture Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lectures.map((lecture) => (
              <div
                key={lecture.id}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
              >
                <Link href={`/lectures/${lecture.id}`} className="block">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 flex-1">
                      {lecture.title}
                    </h3>
                    <svg
                      className="w-5 h-5 text-muted group-hover:text-primary transition-colors flex-shrink-0 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    {getStatusBadge(lecture.processing_status)}
                  </div>

                  {/* Topics Count */}
                  {lecture.processing_status === "completed" &&
                    lecture.topics && (
                      <div className="mb-4 flex items-center gap-2 text-sm">
                        <svg
                          className="w-4 h-4 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <span className="text-foreground font-medium">
                          {lecture.topics.length}{" "}
                          {lecture.topics.length === 1 ? "topic" : "topics"}{" "}
                          extracted
                        </span>
                      </div>
                    )}

                  {/* Topics List (if completed) */}
                  {lecture.processing_status === "completed" &&
                    lecture.topics &&
                    lecture.topics.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-muted mb-2">
                          Topics:
                        </p>
                        <ul className="space-y-1">
                          {lecture.topics.slice(0, 3).map((topic) => (
                            <li
                              key={topic.id}
                              className="text-sm text-muted flex items-start gap-2"
                            >
                              <span className="text-primary mt-1">•</span>
                              <span className="line-clamp-1">
                                {topic.title}
                              </span>
                            </li>
                          ))}
                          {lecture.topics.length > 3 && (
                            <li className="text-sm text-muted italic">
                              +{lecture.topics.length - 3} more
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Processing Message */}
                  {lecture.processing_status === "processing" && (
                    <p className="text-sm text-muted mb-4">
                      AI is analyzing your lecture and extracting topics...
                    </p>
                  )}

                  {/* Failed Message */}
                  {lecture.processing_status === "failed" && (
                    <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                      Processing failed. Please try re-uploading.
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-muted">
                      {formatDate(lecture.created_at)}
                    </span>
                    {lecture.processing_status === "completed" && (
                      <span className="text-xs font-medium text-primary group-hover:underline">
                        View Details →
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
