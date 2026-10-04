"use client";
export default function Error({ reset }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Something went wrong. Reload.</h1>
      <p className="text-muted mt-2">An unexpected error stopped this page from loading.</p>
      <button onClick={() => { reset(); location.reload(); }} className="btn btn-primary mt-6">Reload</button>
    </div>
  );
}
