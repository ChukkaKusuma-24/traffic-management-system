import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function HealthLineChart({ data }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Line type="monotone" dataKey="cpu" stroke="#f43f5e" strokeWidth={2} />
          <Line type="monotone" dataKey="memory" stroke="#22d3ee" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
