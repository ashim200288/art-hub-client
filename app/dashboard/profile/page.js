"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { api, uploadImage } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";

export default function Profile() {
  const { user, refresh } = useAuth();
  const [name, setName] = useState(user.name);
  const [file, setFile] = useState(null);
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const avatar = file ? await uploadImage(file) : undefined;
      await api("/auth/me", { method: "PATCH", body: { name, avatar } });
      await refresh();
      toast.success("Profile updated");
    } catch (err) { toast.error(err.message); }
    setBusy(false);
  };
  const changePw = async (e) => {
    e.preventDefault();
    try { await api("/auth/me/password", { method: "PATCH", body: pw }); toast.success("Password changed"); setPw({ currentPassword: "", newPassword: "" }); }
    catch (err) { toast.error(err.message); }
  };

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-3xl font-bold">Profile</h1>
      <form onSubmit={save} className="card p-6 space-y-4">
        <label className="block text-sm font-semibold">Full name<input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label className="block text-sm font-semibold">Email<input className="input mt-1 opacity-60" value={user.email} disabled /></label>
        <label className="block text-sm font-semibold">Profile picture<input type="file" accept="image/*" className="input mt-1" onChange={(e) => setFile(e.target.files[0])} /></label>
        <button className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : "Save changes"}</button>
      </form>
      <form onSubmit={changePw} className="card p-6 space-y-4">
        <h2 className="text-xl font-bold">Change password</h2>
        <input className="input" type="password" placeholder="Current password (leave blank for Google accounts)" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
        <input className="input" type="password" placeholder="New password" minLength={6} required value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
        <button className="btn btn-primary">Update password</button>
      </form>
    </div>
  );
}
