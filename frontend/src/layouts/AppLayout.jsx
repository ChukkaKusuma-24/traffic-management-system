import { Outlet } from "react-router-dom";
import { RealtimeProvider } from "../context/RealtimeContext";
import { ErrorBoundary } from "../components/common/ErrorBoundary";
import { Navbar } from "../components/common/Navbar";
import { Sidebar } from "../components/common/Sidebar";

export function AppLayout() {
  return (
    <ErrorBoundary>
      <RealtimeProvider>
        <div className="min-h-screen bg-[#060b16] text-slate-100">
          <div className="mx-auto grid min-h-screen max-w-[1700px] grid-cols-1 lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <section className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 p-4 md:p-6 lg:p-8">
                <Outlet />
              </main>
            </section>
          </div>
        </div>
      </RealtimeProvider>
    </ErrorBoundary>
  );
}
