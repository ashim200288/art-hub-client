"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { api, money } from "@/lib/api";
import { Sk } from "@/components/ui";

const COLORS = ["#2f3ddb", "#7c5cff", "#e8431f", "#0b8f7a", "#f4a62a", "#5b6070"];

export default function Analytics() {
  const [s, setS] = useState(null);
  useEffect(() => { api("/admin/stats").then(setS).catch(() => setS(false)); }, []);
  if (s === false) return <p>Could not load analytics.</p>;
  const cards = s && [["Total users", s.totalUsers], ["Total artists", s.totalArtists], ["Artworks sold", s.totalSold], ["Total revenue", money(s.totalRevenue)]];
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {(cards || [1, 2, 3, 4]).map((c, i) => c.length ? (
          <div key={c[0]} className="card p-5"><p className="text-sm text-muted">{c[0]}</p><p className="text-3xl font-display font-extrabold mt-1">{c[1]}</p></div>
        ) : <Sk key={i} className="h-24" />)}
      </div>
      {s && (
        <div className="grid xl:grid-cols-2 gap-4">
          <div className="card p-5"><h2 className="font-bold mb-4">Revenue by month</h2>
            <div className="h-72"><ResponsiveContainer><BarChart data={s.monthly}><CartesianGrid strokeDasharray="3 3" stroke="var(--line)" /><XAxis dataKey="month" stroke="var(--muted)" /><YAxis stroke="var(--muted)" /><Tooltip /><Bar dataKey="revenue" fill="#2f3ddb" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
          </div>
          <div className="card p-5"><h2 className="font-bold mb-4">Artworks by category</h2>
            <div className="h-72"><ResponsiveContainer><PieChart><Pie data={s.byCategory} dataKey="value" nameKey="name" outerRadius={100} label>{s.byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
          </div>
        </div>
      )}
    </div>
  );
}
