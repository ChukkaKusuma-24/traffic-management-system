import { useCallback, useState } from "react";
import { apiService } from "../../services/apiService";
import { GlassCard } from "./GlassCard";
import { Modal } from "./Modal";

export function IncidentReportModal({ isOpen, onClose, junctionId, junctionName }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!title.trim() || !description.trim()) {
        setMessage("Please fill in all fields");
        return;
      }

      setLoading(true);
      try {
        const payload = {
          title,
          description,
          severity,
          junctionId,
          reportedBy: localStorage.getItem("userId") || "anonymous",
        };
        await apiService.createIncident(payload);
        setMessage("Report submitted successfully!");
        setTimeout(() => {
          setTitle("");
          setDescription("");
          setSeverity("MEDIUM");
          setMessage("");
          onClose();
        }, 1500);
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    },
    [title, description, severity, junctionId, onClose]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Traffic Issue">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div
            className={`rounded-lg p-3 text-sm ${
              message.includes("Error")
                ? "bg-red-500/20 text-red-200"
                : "bg-green-500/20 text-green-200"
            }`}
          >
            {message}
          </div>
        )}

        {junctionName && (
          <div className="rounded-lg bg-white/5 p-3">
            <p className="text-sm text-slate-400">Junction</p>
            <p className="font-semibold text-white">{junctionName}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Issue Title</label>
          <input
            type="text"
            placeholder="e.g., Accident, Road damage, Signal malfunction"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
          <textarea
            placeholder="Provide details about the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            rows={4}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none disabled:opacity-50 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Severity Level</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none disabled:opacity-50"
          >
            <option value="LOW">Low - Minor inconvenience</option>
            <option value="MEDIUM">Medium - Noticeable impact</option>
            <option value="HIGH">High - Significant disruption</option>
            <option value="CRITICAL">Critical - Immediate danger</option>
          </select>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-white/20 px-4 py-2 text-white hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
