export function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 text-sm text-cyan-200">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
      <span>{label}</span>
    </div>
  );
}
