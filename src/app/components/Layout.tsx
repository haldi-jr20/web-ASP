import { NavLink, Outlet, useLocation } from "react-router";
import { MapPin, BarChart2, FileText, Info, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Beranda", icon: MapPin, exact: true },
  { to: "/dashboard", label: "Peta Analisis", icon: BarChart2, exact: false },
  { to: "/hasil", label: "Hasil & Rekomendasi", icon: FileText, exact: false },
  { to: "/tentang", label: "Tentang", icon: Info, exact: false },
];

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif", background: "#f0f7ee" }}>
      {/* Header */}
      <header style={{ background: "#0f2417", borderBottom: "4px solid #e84d2a", fontFamily: "'Press Start 2P', monospace" }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Pixel dino logo */}
            <div className="relative" style={{ width: 40, height: 40 }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                {/* Pixel dino */}
                <rect x="10" y="4" width="20" height="20" fill="#4caf50"/>
                <rect x="14" y="6" width="12" height="6" fill="#2e7d32"/>
                <rect x="22" y="8" width="4" height="2" fill="#fff"/>
                <rect x="24" y="8" width="2" height="2" fill="#333"/>
                <rect x="10" y="20" width="4" height="12" fill="#4caf50"/>
                <rect x="20" y="20" width="4" height="12" fill="#4caf50"/>
                <rect x="26" y="20" width="8" height="6" fill="#4caf50"/>
                <rect x="6" y="14" width="6" height="6" fill="#4caf50"/>
              </svg>
            </div>
            <div>
              <div style={{ color: "#4caf50", fontSize: "10px", letterSpacing: "0.05em" }}>GEO</div>
              <div style={{ color: "#fff", fontSize: "12px", letterSpacing: "0.05em" }}>KULINER</div>
              <div style={{ color: "#e84d2a", fontSize: "8px", letterSpacing: "0.1em" }}>SORONG</div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 12px",
                  fontSize: "9px",
                  letterSpacing: "0.05em",
                  color: isActive ? "#0f2417" : "#a5d6a7",
                  background: isActive ? "#4caf50" : "transparent",
                  border: isActive ? "2px solid #4caf50" : "2px solid transparent",
                  boxShadow: isActive ? "3px 3px 0 #2e7d32" : "none",
                  textDecoration: "none",
                  transition: "all 0.1s",
                  imageRendering: "pixelated",
                })}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.classList.contains("active")) {
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = "#4caf50";
                  }
                }}
                onMouseLeave={(e) => {
                  const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
                  if (!isActive) {
                    e.currentTarget.style.color = "#a5d6a7";
                    e.currentTarget.style.borderColor = "transparent";
                  }
                }}
              >
                <Icon size={12} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: "#4caf50", background: "none", border: "2px solid #4caf50", padding: "6px", cursor: "pointer" }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div style={{ borderTop: "2px solid #2e7d32", background: "#0a1a10" }}>
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setMenuOpen(false)}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 16px",
                  fontSize: "9px",
                  letterSpacing: "0.05em",
                  color: isActive ? "#4caf50" : "#a5d6a7",
                  background: isActive ? "rgba(76,175,80,0.1)" : "transparent",
                  borderLeft: isActive ? "4px solid #4caf50" : "4px solid transparent",
                  textDecoration: "none",
                })}
              >
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: "#0f2417", borderTop: "4px solid #1a5c2e", padding: "16px", fontFamily: "'Press Start 2P', monospace" }}>
        <div className="max-w-7xl mx-auto text-center" style={{ color: "#4a7a5a", fontSize: "8px", lineHeight: "1.8" }}>
          <div style={{ color: "#4caf50", marginBottom: "4px" }}>▓ GeoKuliner Sorong © 2024 ▓</div>
          <div>Sistem Informasi Geografis Kuliner Kota Sorong, Papua Barat Daya</div>
        </div>
      </footer>
    </div>
  );
}
