"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Spinner } from "@/components/ui";
import ArtworkForm from "@/components/ArtworkForm";

export default function Edit() {
  const { id } = useParams();
  const [art, setArt] = useState(null);
  const [err, setErr] = useState(false);
  useEffect(() => { api(`/artworks/${id}`).then(setArt).catch(() => setErr(true)); }, [id]);
  if (err) return <p>Artwork not found.</p>;
  if (!art) return <Spinner />;
  return (<div><h1 className="text-3xl font-bold mb-6">Edit artwork</h1><ArtworkForm initial={art} /></div>);
}
