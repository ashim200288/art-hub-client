"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { RowSkeleton, Table } from "@/components/ui";

export default function Users() {
  const { user: me } = useAuth();
  const [list, setList] = useState(null);
  useEffect(() => { api("/users").then(setList).catch(() => { setList([]); toast.error("Failed to load users"); }); }, []);
  const change = async (u, role) => {
    try { const r = await api(`/users/${u._id}/role`, { method: "PATCH", body: { role } }); setList(list.map((x) => (x._id === u._id ? r : x))); toast.success("Role updated"); }
    catch (e) { toast.error(e.message); }
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage users</h1>
      {list === null ? <RowSkeleton /> : (
        <Table head={["Name", "Email", "Role"]}>
          {list.map((u) => (
            <tr key={u._id}><td className="font-semibold">{u.name}</td><td>{u.email}</td>
              <td><select className="input !w-auto !py-1" value={u.role} disabled={u._id === me.id} onChange={(e) => change(u, e.target.value)} aria-label={`Role for ${u.name}`}>
                <option value="user">user</option><option value="artist">artist</option><option value="admin">admin</option></select></td></tr>
          ))}
        </Table>
      )}
    </div>
  );
}
