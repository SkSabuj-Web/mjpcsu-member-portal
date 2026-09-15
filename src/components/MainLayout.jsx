
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <div className="animate-[fadeIn_0.4s_ease-out]">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Small global animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-\\[fadeIn_0\\.4s_ease-out\\] {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default MainLayout;

