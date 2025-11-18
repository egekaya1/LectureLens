"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href={user ? "/dashboard" : "/"}
            className="text-xl font-semibold tracking-tight hover:text-primary transition-colors"
          >
            LectureLens
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/dashboard")
                      ? "bg-secondary text-primary"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/upload"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/upload")
                      ? "bg-secondary text-primary"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  Upload
                </Link>
                <button
                  onClick={signOut}
                  className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
