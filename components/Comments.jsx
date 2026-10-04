"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, date } from "@/lib/api";
import { useAuth } from "./AuthProvider";

export default function Comments({ artworkId }) {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [purchased, setPurchased] = useState(false);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(null);

  const load = () => api(`/artworks/${artworkId}/comments`).then(setList).catch(() => {});
  useEffect(() => { load(); }, [artworkId]);
  useEffect(() => {
    if (user) api(`/artworks/${artworkId}/purchased`).then((r) => setPurchased(r.purchased)).catch(() => {});
    else setPurchased(false);
  }, [user, artworkId]);

  const post = async (e) => {
    e.preventDefault();
    try { await api(`/artworks/${artworkId}/comments`, { method: "POST", body: { comment: text } }); setText(""); load(); }
    catch (err) { toast.error(err.message); }
  };
  const save = async (id) => {
    try { await api(`/comments/${id}`, { method: "PUT", body: { comment: editing.text } }); setEditing(null); load(); }
    catch (err) { toast.error(err.message); }
  };
  const del = async (id) => {
    if (!confirm("Delete this comment?")) return;
    try { await api(`/comments/${id}`, { method: "DELETE" }); load(); } catch (err) { toast.error(err.message); }
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold">Comments ({list.length})</h2>
      {purchased ? (
        <form onSubmit={post} className="mt-4 flex gap-2">
          <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Share what you think of this piece" required />
          <button className="btn btn-primary">Post</button>
        </form>
      ) : (
        <p className="mt-3 text-sm text-muted">Only people who bought this artwork can leave a comment.</p>
      )}
      <ul className="mt-5 space-y-3">
        {list.map((c) => (
          <li key={c._id} className="card p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">{c.userId?.name}</span><span className="text-muted">{date(c.createdAt)}</span>
            </div>
            {editing?.id === c._id ? (
              <div className="mt-2 flex gap-2">
                <input className="input" value={editing.text} onChange={(e) => setEditing({ ...editing, text: e.target.value })} />
                <button className="btn btn-primary" onClick={() => save(c._id)}>Save</button>
                <button className="btn btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              </div>
            ) : <p className="mt-1">{c.comment}</p>}
            {user && c.userId?._id === user.id && editing?.id !== c._id && (
              <div className="mt-2 flex gap-3 text-sm">
                <button className="text-brand font-semibold" onClick={() => setEditing({ id: c._id, text: c.comment })}>Edit</button>
                <button className="text-hot font-semibold" onClick={() => del(c._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
