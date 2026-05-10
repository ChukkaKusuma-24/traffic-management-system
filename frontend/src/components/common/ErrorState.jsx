export function ErrorState({ message }) {
  return (
    <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
      {message || "Something went wrong."}
    </div>
  );
}
