"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/sign-in?redirect=/dashboard');
        return;
      }

      // Redirect to role-specific dashboard
      switch (user?.role) {
        case 'client':
          router.push('/dashboard/client');
          break;
        case 'pro':
          router.push('/dashboard/professional');
          break;
        case 'franchise':
          router.push('/dashboard/franchise');
          break;
        case 'admin':
          router.push('/dashboard/admin');
          break;
        default:
          // If role is undefined or unknown, redirect to client dashboard
          router.push('/dashboard/client');
          break;
      }
    }
  }, [isLoading, isAuthenticated, user?.role, router]);

  // Show loading state while determining where to redirect
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex items-center space-x-2">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-lg text-muted-foreground">Loading dashboard...</span>
      </div>
    </div>
  );
}