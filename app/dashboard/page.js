"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth, dashboardPath } from "@/components/AuthProvider";
import { Spinner } from "@/components/ui";
export default function Redirect() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && user) router.replace(dashboardPath(user.role)); }, [loading, user]);
  return <Spinner full />;
}
