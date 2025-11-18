"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  const ctaHref = loading ? "#" : user ? "/upload" : "/login";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            AI-Powered Lecture
            <br />
            <span className="text-primary">Summaries for Students</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your lectures and get instant topic breakdowns, flashcards,
            and practice questions. Study smarter, not harder.
          </p>
          <Link
            href={ctaHref}
            className="inline-block px-8 py-4 bg-primary hover:bg-primary-hover text-white text-lg font-medium rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {loading
              ? "Loading..."
              : user
                ? "Upload Lecture"
                : "Get Started Free"}
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1: Topics */}
          <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary"
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
            <h3 className="text-xl font-semibold mb-3">
              Smart Topic Extraction
            </h3>
            <p className="text-muted leading-relaxed">
              Automatically break down lectures into organized topics with
              detailed summaries.
            </p>
          </div>

          {/* Feature 2: Flashcards */}
          <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">
              AI-Generated Flashcards
            </h3>
            <p className="text-muted leading-relaxed">
              Get personalized flashcards for active recall and spaced
              repetition study sessions.
            </p>
          </div>

          {/* Feature 3: Q&A */}
          <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Practice Questions & Answers
            </h3>
            <p className="text-muted leading-relaxed">
              Ask questions about your lectures and get instant answers grounded
              in your content.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload Your Lecture</h3>
            <p className="text-muted">Paste your lecture transcript or notes</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Processing</h3>
            <p className="text-muted">
              Our AI extracts topics, creates flashcards, and generates
              questions
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-lg font-semibold mb-2">Study Smarter</h3>
            <p className="text-muted">
              Review organized content and ace your exams
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 sm:p-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to transform your study routine?
          </h2>
          <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
            Join students who are learning more efficiently with AI-powered
            study tools.
          </p>
          <Link
            href={ctaHref}
            className="inline-block px-8 py-4 bg-primary hover:bg-primary-hover text-white text-lg font-medium rounded-xl transition-all hover:scale-105"
          >
            {loading
              ? "Loading..."
              : user
                ? "Go to Dashboard"
                : "Start for Free"}
          </Link>
        </div>
      </section>
    </div>
  );
}
