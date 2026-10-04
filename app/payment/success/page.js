"use client";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { Spinner } from "@/components/ui";

function Confirm() {
  const sid = useSearchParams().get("session_id");
  const { user, loading, refresh } = useAuth();
  const [state, setState] = useState({ status: "loading" });
  const ran = useRef(false);

  useEffect(() => {
    if (loading || ran.current) return;
    if (!user || !sid) { setState({ status: "error", message: "We couldn't find your payment session." }); return; }
    ran.current = true;
    api("/payments/confirm", { method: "POST", body: { sessionId: sid } })
      .then((r) => { setState({ status: "ok", ...r }); refresh(); })
      .catch((e) => setState({ status: "error", message: e.message }));
  }, [loading, user, sid]);

  if (state.status === "loading") return <Spinner full />;
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-4xl font-bold">{state.status === "ok" ? "Payment successful" : "Payment problem"}</h1>
      <p className="mt-3 text-muted">
        {state.status === "ok"
          ? state.kind === "subscription" ? `You're now on the ${state.tier} plan.` : "The artwork is yours. Find it in your dashboard."
          : state.message}
      </p>
      <Link href="/dashboard/user" className="btn btn-primary mt-8">Go to dashboard</Link>
    </div>
  );
}
export default function Page() { return <Suspense><Confirm /></Suspense>; }
