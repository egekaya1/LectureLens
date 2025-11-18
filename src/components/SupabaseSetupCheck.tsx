"use client";

import { useEffect, useState } from "react";

export default function SupabaseSetupCheck() {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConfig = () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (
        !url ||
        !key ||
        url === "your-project-url" ||
        key === "your-anon-key"
      ) {
        setIsConfigured(false);
      } else {
        setIsConfigured(true);
      }
    };

    checkConfig();
  }, []);

  if (isConfigured === null) return null;
  if (isConfigured) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-lg z-50">
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <svg
            className="w-5 h-5 text-yellow-600 dark:text-yellow-500"
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
        <div>
          <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
            Supabase Not Configured
          </h4>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2">
            To use authentication and database features:
          </p>
          <ol className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1 list-decimal list-inside">
            <li>Start Docker Desktop</li>
            <li>
              Run:{" "}
              <code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">
                supabase start
              </code>
            </li>
            <li>
              Run:{" "}
              <code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">
                supabase status
              </code>
            </li>
            <li>
              Copy values to{" "}
              <code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">
                .env.local
              </code>
            </li>
            <li>Restart dev server</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
