import { Link } from "react-router";
import { MapPin, ArrowRight, ChevronRight } from "lucide-react";

const stats = [
  { label: "Fokus Analisis", value: "Spasial", icon: "🗺️", color: "#e84d2a" },
  { label: "Kriteria Utama", value: "2", icon: "⚖️", color: "#0e7a8a" },
  { label: "Skor Kesesuaian", value: "0-100", icon: "🎯", color: "#8b5e3c" },
  { label: "Data Terbuka", value: "100%", icon: "✅", color: "#1a5c2e" },
];

const features = [
  {
    icon: "👥",
    title: "Peta Kepadatan Penduduk",
    desc: "Visualisasi choropleth kepadatan penduduk pada area terpilih di Kota Sorong sebagai dasar analisis kesesuaian lokasi.",
    color: "#1a5c2e",
  },
  {
    icon: "🛣️",
    title: "Peta Akses Jalan",
    desc: "Analisis jaringan dan kelas jalan untuk menilai aksesibilitas tiap distrik terhadap potensi pelanggan.",
    color: "#0e7a8a",
  },
  {
    icon: "🎯",
    title: "Skor Kesesuaian Lokasi",
    desc: "Kombinasi kepadatan penduduk dan akses jalan menghasilkan skor 0-100 untuk merekomendasikan lokasi terbaik membuka usaha kuliner.",
    color: "#e84d2a",
  },
  {
    icon: "⚖️",
    title: "Pembobotan Kriteria",
    desc: "Sesuaikan bobot antar kriteria secara interaktif — simulasikan skenario analisis berbeda dan lihat perubahan ranking distrik secara langsung.",
    color: "#8b5e3c",
  },
];

const highlights = [
  { area: "Sorong Utara", count: 92, topFood: "Skor 92/100", rank: 1 },
  { area: "Sorong Manoi", count: 87, topFood: "Skor 87/100", rank: 2 },
  { area: "Sorong Timur", count: 81, topFood: "Skor 81/100", rank: 3 },
];

const pixelBorder = {
  border: "2px solid #1a5c2e",
  boxShadow: "4px 4px 0 #0f2417",
};

const pixelBorderRed = {
  border: "2px solid #e84d2a",
  boxShadow: "4px 4px 0 #8b1a0d",
};

const heroPhotos = [
  "https://images.unsplash.com/photo-1622572771591-6ca7813cc39d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1664337873053-840ea51d271d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1545830016-b441e357919d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1638569099509-2f46eb4bb94e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1496114212242-bac8bd9de53d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
];

export function Beranda() {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <section
        style={{
          background: "#0f2417",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Photo strip background */}
        <div style={{ display: "flex", height: "420px", overflow: "hidden", position: "relative" }}>
          {heroPhotos.map((url, i) => (
            <div key={i} style={{ flex: 1, overflow: "hidden", position: "relative" }}>
              <img
                src={url}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.35) saturate(0.7)" }}
              />
              {/* Pixel grid on each photo */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "linear-gradient(rgba(76,175,80,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(76,175,80,0.06) 1px, transparent 1px)",
                  backgroundSize: "14px 14px",
                }}
              />
            </div>
          ))}
          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(15,36,23,0.45) 0%, rgba(15,36,23,0.75) 60%, rgba(15,36,23,0.97) 100%)",
              pointerEvents: "none",
            }}
          />
          {/* Red bottom border line */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: "#e84d2a" }} />
        </div>

        {/* Hero content overlaid on photos */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 20px",
          }}
        >
          {/* Decorative pixel dino */}
          <div className="absolute right-8 top-8 opacity-15 hidden lg:block">
            <svg width="120" height="120" viewBox="0 0 40 40" fill="none" style={{ imageRendering: "pixelated" }}>
              <rect x="10" y="4" width="20" height="20" fill="#4caf50"/>
              <rect x="14" y="6" width="12" height="6" fill="#2e7d32"/>
              <rect x="22" y="8" width="4" height="2" fill="#fff"/>
              <rect x="24" y="8" width="2" height="2" fill="#333"/>
              <rect x="10" y="20" width="4" height="12" fill="#4caf50"/>
              <rect x="20" y="20" width="4" height="12" fill="#4caf50"/>
              <rect x="26" y="20" width="8" height="6" fill="#4caf50"/>
              <rect x="6" y="14" width="6" height="6" fill="#4caf50"/>
              <rect x="12" y="32" width="4" height="4" fill="#4caf50"/>
              <rect x="20" y="32" width="4" height="4" fill="#4caf50"/>
            </svg>
          </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 mb-6"
            style={{
              background: "rgba(76,175,80,0.15)",
              border: "2px solid #4caf50",
              padding: "6px 14px",
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "8px",
              color: "#4caf50",
              letterSpacing: "0.08em",
            }}
          >
            <span style={{ animation: "pulse 2s infinite" }}>◉</span>
            <span>SISTEM AKTIF — 2024</span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Press Start 2P', monospace",
              color: "#f0f7ee",
              fontSize: "clamp(20px, 4vw, 36px)",
              lineHeight: 1.4,
              marginBottom: "8px",
              textShadow: "4px 4px 0 #0a1a10",
            }}
          >
            GEO<span style={{ color: "#4caf50" }}>KULINER</span>
          </h1>
          <h2
            style={{
              fontFamily: "'Press Start 2P', monospace",
              color: "#e84d2a",
              fontSize: "clamp(12px, 2.5vw, 18px)",
              lineHeight: 1.4,
              marginBottom: "24px",
              textShadow: "3px 3px 0 #5a1a0d",
            }}
          >
            SORONG
          </h2>

          <p
            style={{
              color: "#a5d6a7",
              fontSize: "15px",
              lineHeight: 1.7,
              maxWidth: "600px",
              margin: "0 auto 32px",
            }}
          >
            Sistem Informasi Geografis (GIS) untuk pemetaan dan analisis spasial kuliner
            Kota Sorong, Papua Barat Daya — menampilkan kesesuaian lokasi berdasarkan
            kepadatan penduduk dan akses jalan.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 24px",
                background: "#4caf50",
                color: "#0f2417",
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "10px",
                textDecoration: "none",
                border: "2px solid #2e7d32",
                boxShadow: "4px 4px 0 #1a4a1a",
                transition: "transform 0.1s, box-shadow 0.1s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(2px, 2px)";
                e.currentTarget.style.boxShadow = "2px 2px 0 #1a4a1a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0, 0)";
                e.currentTarget.style.boxShadow = "4px 4px 0 #1a4a1a";
              }}
            >
              <MapPin size={14} />
              BUKA PETA
            </Link>
            <Link
              to="/hasil"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 24px",
                background: "transparent",
                color: "#4caf50",
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "10px",
                textDecoration: "none",
                border: "2px solid #4caf50",
                boxShadow: "4px 4px 0 #1a4a1a",
                transition: "transform 0.1s, box-shadow 0.1s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(2px, 2px)";
                e.currentTarget.style.boxShadow = "2px 2px 0 #1a4a1a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0, 0)";
                e.currentTarget.style.boxShadow = "4px 4px 0 #1a4a1a";
              }}
            >
              LIHAT HASIL
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ background: "#0f2417", padding: "0" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                padding: "24px 20px",
                textAlign: "center",
                borderRight: i < 3 ? "1px solid #1a5c2e" : "none",
                borderBottom: i < 2 ? "1px solid #1a5c2e" : "none",
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "4px" }}>{s.icon}</div>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "22px",
                  color: s.color,
                  marginBottom: "4px",
                }}
              >
                {s.value}
              </div>
              <div style={{ color: "#4a7a5a", fontSize: "11px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "60px 20px", background: "#f0f7ee" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "8px",
                color: "#e84d2a",
                letterSpacing: "0.1em",
                marginBottom: "12px",
              }}
            >
              ▶ FITUR UTAMA ◀
            </div>
            <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "18px", color: "#0f2417" }}>
              Apa yang bisa kamu lakukan?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "2px solid #1a5c2e",
                  boxShadow: "4px 4px 0 #0f2417",
                  padding: "24px 20px",
                  transition: "transform 0.1s, box-shadow 0.1s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translate(-2px, -2px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "6px 6px 0 #0f2417";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translate(0, 0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "4px 4px 0 #0f2417";
                }}
              >
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>{f.icon}</div>
                <h3
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "11px",
                    color: f.color,
                    marginBottom: "10px",
                    lineHeight: 1.5,
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ color: "#4a7a5a", fontSize: "12px", lineHeight: 1.7 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Areas */}
      <section style={{ padding: "60px 20px", background: "#e8f5e4" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "8px",
                color: "#0e7a8a",
                letterSpacing: "0.1em",
                marginBottom: "12px",
              }}
            >
              ▶ STATISTIK HIGHLIGHT ◀
            </div>
            <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "16px", color: "#0f2417" }}>
              Simulasi Skor Kesesuaian Lokasi
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {highlights.map((h, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "2px solid #1a5c2e",
                  boxShadow: "4px 4px 0 #0f2417",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: i === 0 ? "#e84d2a" : i === 1 ? "#1a5c2e" : "#0e7a8a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "18px",
                    color: "#fff",
                    flexShrink: 0,
                    border: "2px solid #0f2417",
                  }}
                >
                  {h.rank}
                </div>
                <div className="flex-1">
                  <div
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: "12px",
                      color: "#0f2417",
                      marginBottom: "6px",
                    }}
                  >
                    {h.area}
                  </div>
                  <div style={{ color: "#4a7a5a", fontSize: "12px" }}>
                    <strong>{h.topFood}</strong>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: "20px",
                      color: i === 0 ? "#e84d2a" : i === 1 ? "#1a5c2e" : "#0e7a8a",
                    }}
                  >
                    {h.count}
                  </div>
                  <div style={{ color: "#4a7a5a", fontSize: "11px" }}>skor kesesuaian</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/hasil"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                background: "#0e7a8a",
                color: "#fff",
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "9px",
                textDecoration: "none",
                border: "2px solid #0a5a68",
                boxShadow: "4px 4px 0 #0f2417",
              }}
            >
              LIHAT SEMUA HASIL
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Photo gallery strip */}
      <section style={{ background: "#0f2417", padding: "48px 20px" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "8px",
                color: "#e84d2a",
                letterSpacing: "0.1em",
                marginBottom: "10px",
              }}
            >
              ▶ KULINER KOTA SORONG ◀
            </div>
            <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "14px", color: "#f0f7ee" }}>
              Ragam Kuliner yang Menanti
            </h2>
          </div>

          {/* Photo grid */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "180px 180px", gap: "6px", marginBottom: "6px" }}>
            {/* Big left photo */}
            <div style={{ gridRow: "1 / 3", position: "relative", overflow: "hidden", border: "2px solid #1a5c2e" }}>
              <img
                src="https://images.unsplash.com/photo-1622572771591-6ca7813cc39d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
                alt="Kuliner Sorong"
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.85) brightness(0.9)" }}
              />
              <div style={{ position: "absolute", bottom: "12px", left: "12px", background: "rgba(15,36,23,0.85)", border: "2px solid #4caf50", padding: "6px 12px" }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", color: "#4caf50" }}>STREET FOOD</div>
              </div>
            </div>
            {/* Top middle */}
            <div style={{ position: "relative", overflow: "hidden", border: "2px solid #1a5c2e" }}>
              <img
                src="https://images.unsplash.com/photo-1529563021893-cc83c992d75d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
                alt="Kuliner Sorong"
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.85) brightness(0.9)" }}
              />
            </div>
            {/* Top right */}
            <div style={{ position: "relative", overflow: "hidden", border: "2px solid #1a5c2e" }}>
              <img
                src="https://images.unsplash.com/photo-1664337873053-840ea51d271d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
                alt="Kuliner Sorong"
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.85) brightness(0.9)" }}
              />
            </div>
            {/* Bottom middle */}
            <div style={{ position: "relative", overflow: "hidden", border: "2px solid #1a5c2e" }}>
              <img
                src="https://images.unsplash.com/photo-1638569099509-2f46eb4bb94e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
                alt="Kuliner Sorong"
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.85) brightness(0.9)" }}
              />
            </div>
            {/* Bottom right */}
            <div style={{ position: "relative", overflow: "hidden", border: "2px solid #1a5c2e" }}>
              <img
                src="https://images.unsplash.com/photo-1496114212242-bac8bd9de53d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
                alt="Kuliner Sorong"
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.85) brightness(0.9)" }}
              />
            </div>
          </div>

          {/* Horizontal filmstrip */}
          <div style={{ display: "flex", gap: "6px", overflow: "hidden" }}>
            {[
              "https://images.unsplash.com/photo-1545830016-b441e357919d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
              "https://images.unsplash.com/photo-1582607285869-08536f2fcb96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
              "https://images.unsplash.com/photo-1568882041008-c0954e91caba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
            ].map((url, i) => (
              <div key={i} style={{ flex: 1, height: "90px", overflow: "hidden", border: "2px solid #1a5c2e", position: "relative" }}>
                <img
                  src={url}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.75) brightness(0.85)" }}
                />
                {/* Scanline effect */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini map preview */}
      <section style={{ padding: "60px 20px", background: "#0f2417" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "8px",
                color: "#4caf50",
                letterSpacing: "0.1em",
                marginBottom: "12px",
              }}
            >
              ▶ PRATINJAU PETA ◀
            </div>
            <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "16px", color: "#f0f7ee" }}>
              Pratinjau Peta Kesesuaian Lokasi
            </h2>
            <p style={{ color: "#4a7a5a", fontSize: "12px", marginTop: "8px" }}>
              Visualisasi skor kesesuaian pada distrik-distrik di Kota Sorong
            </p>
          </div>

          {/* Simplified pixel map */}
          <div
            style={{
              border: "3px solid #1a5c2e",
              boxShadow: "6px 6px 0 #4caf50",
              background: "#1a3a50",
              position: "relative",
              overflow: "hidden",
              height: "280px",
            }}
          >
            {/* Grid */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "linear-gradient(rgba(76,175,80,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(76,175,80,0.1) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* SVG map of Sorong area */}
            <svg width="100%" height="100%" viewBox="0 0 600 280" style={{ position: "absolute", inset: 0 }}>
              {/* Ocean/water base */}
              <rect width="600" height="280" fill="#1a3a50"/>

              {/* Main land masses - stylized Sorong (Choropleth colors) */}
              {/* Sorong Utara - Sangat Sesuai */}
              <polygon points="80,60 200,40 320,50 380,80 400,140 360,200 280,220 180,210 100,180 60,120" fill="#4caf50" opacity="0.9" stroke="#0f2417" strokeWidth="2"/>
              {/* Sorong Manoi - Cukup Sesuai */}
              <polygon points="320,50 420,30 480,60 500,100 460,130 400,140 380,80" fill="#ffb300" opacity="0.9" stroke="#0f2417" strokeWidth="2"/>
              {/* Sorong Barat - Kurang Sesuai */}
              <polygon points="60,120 100,180 80,220 40,200 30,150" fill="#e84d2a" opacity="0.85" stroke="#0f2417" strokeWidth="2"/>

              {/* Islands */}
              <ellipse cx="520" cy="180" rx="40" ry="25" fill="#ffb300" opacity="0.8" stroke="#0f2417" strokeWidth="2"/>
              <ellipse cx="560" cy="240" rx="20" ry="12" fill="#e84d2a" opacity="0.7" stroke="#0f2417" strokeWidth="2"/>
              <ellipse cx="30" cy="250" rx="25" ry="15" fill="#4caf50" opacity="0.7" stroke="#0f2417" strokeWidth="2"/>

              {/* Roads */}
              <line x1="80" y1="120" x2="380" y2="130" stroke="#0f2417" strokeWidth="2" strokeDasharray="6,3"/>
              <line x1="200" y1="60" x2="200" y2="210" stroke="#0f2417" strokeWidth="1.5" strokeDasharray="4,3"/>

              {/* Area labels */}
              <text x="150" y="88" fill="#0f2417" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SRG UTARA</text>
              <text x="260" y="110" fill="#0f2417" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SRG MANOI</text>
              <text x="330" y="90" fill="#0f2417" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SRG TIMUR</text>
              <text x="185" y="185" fill="#0f2417" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SRG SELATAN</text>
              <text x="100" y="120" fill="#0f2417" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SRG BARAT</text>

              {/* Compass */}
              <g transform="translate(555, 30)">
                <circle cx="0" cy="0" r="16" fill="#0f2417" stroke="#4caf50" strokeWidth="1.5"/>
                <text x="0" y="-6" fill="#4caf50" fontSize="8" textAnchor="middle" fontFamily="monospace">N</text>
                <line x1="0" y1="-4" x2="0" y2="4" stroke="#4caf50" strokeWidth="1.5"/>
                <polygon points="0,-12 -3,-3 3,-3" fill="#e84d2a"/>
              </g>
            </svg>

            {/* Legend */}
            <div
              style={{
                position: "absolute",
                bottom: "12px",
                right: "12px",
                background: "rgba(15,36,23,0.9)",
                border: "2px solid #1a5c2e",
                padding: "10px 14px",
                fontSize: "10px",
                color: "#a5d6a7",
              }}
            >
              {[
                { color: "#e84d2a", label: "Kurang Sesuai" },
                { color: "#ffb300", label: "Cukup Sesuai" },
                { color: "#4caf50", label: "Sangat Sesuai" },
              ].map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <div style={{ width: "12px", height: "12px", background: l.color, border: "1px solid #0f2417" }} />
                  <span>{l.label}</span>
                </div>
              ))}
            </div>

            {/* Corner labels */}
            <div
              style={{
                position: "absolute",
                top: "8px",
                left: "12px",
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "8px",
                color: "#4caf50",
              }}
            >
              KOTA SORONG — PAPUA BARAT DAYA
            </div>
          </div>

          <div className="text-center mt-6">
            <Link
              to="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "#4caf50",
                color: "#0f2417",
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "9px",
                textDecoration: "none",
                border: "2px solid #2e7d32",
                boxShadow: "4px 4px 0 #1a4a1a",
              }}
            >
              BUKA PETA INTERAKTIF
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
