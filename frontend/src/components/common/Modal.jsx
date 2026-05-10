export function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/20 bg-slate-900 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white">{title}</h4>
          <button
            type="button"
            className="rounded-md border border-white/20 px-3 py-1 text-xs"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
