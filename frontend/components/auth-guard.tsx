"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoIcon } from "@/components/brand/logo";
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
          <LogoIcon size="sm" className="animate-pulse" />
          <span className="text-slate-600 dark:text-slate-400">
            Checking session...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
