"use client";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

export default function GoogleBtn({ role, onDone }) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return null;
  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={async (r) => {
          try { onDone(await api("/auth/google", { method: "POST", body: { credential: r.credential, role } })); }
          catch (e) { toast.error(e.message); }
        }}
        onError={() => toast.error("Google sign-in failed")}
      />
    </div>
  );
}
