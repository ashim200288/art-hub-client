"use client";
import { useEffect, useState } from "react";
import { api, money, date } from "@/lib/api";
import { RowSkeleton, Table } from "@/components/ui";

export default function Transactions() {
  const [list, setList] = useState(null);
  useEffect(() => { api("/transactions").then(setList).catch(() => setList([])); }, []);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All transactions</h1>
      {list === null ? <RowSkeleton /> : (
        <Table head={["Transaction ID", "Type", "Buyer email", "Artist email", "Amount", "Date"]}>
          {list.map((t) => <tr key={t._id}><td className="font-mono text-xs">{t._id}</td><td className="capitalize">{t.type}</td><td>{t.user?.email}</td><td>{t.artist?.email || "—"}</td><td>{money(t.amount)}</td><td>{date(t.createdAt)}</td></tr>)}
        </Table>
      )}
    </div>
  );
}
