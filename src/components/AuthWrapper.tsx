"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import Auth from "@/components/pages/Auth/Auth";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated, loading } = useAuth();

  // If still loading, show nothing
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated and not on auth page, redirect to auth
  if (!authenticated && pathname !== "/auth") {
    router.push("/auth");
    return null;
  }

  // If authenticated and on auth page, redirect to home
  if (authenticated && pathname === "/auth") {
    router.push("/home");
    return null;
  }

  // If not authenticated and on auth page, show auth component
  if (!authenticated && pathname === "/auth") {
    return <Auth />;
  }

  // If authenticated and not on auth page, show the children
  return <>{children}</>;
}
