"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { getStoredToken } from "@/lib/auth";
import { authApi } from "@/utils/auth-api";
import { saveAuth } from "@/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    authApi
      .me()
      .then((data) => {
        if (data.user && token) {
          saveAuth(token, data.user);
        }
        setReady(true);
      })
      .catch(() => {
        authApi.logout();
        router.replace("/login");
      });
  }, [router]);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 animate-pulse">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-slate-600 dark:text-slate-400">
            Checking session...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
