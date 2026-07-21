import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { AlertTriangle, CheckCircle, Target, Lightbulb, MapPin, Navigation } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type DistrikHasil = {
  name: string;
  skor: number;
  kepadatan: number;
  jalan: string;
  rekomendasi: string;
  color: string;
};

type AnalysisState = {
  bobotKepadatan: number;
  bobotJalan: number;
  distrikHasil: DistrikHasil[];
};

// ─── Static fallback data ─────────────────────────────────────────────────────
const distrikFallback: DistrikHasil[] = [
  { name: "Sorong Manoi",    skor: 87, kepadatan: 416.23, jalan: "Kelas II (Baik)",           rekomendasi: "Sangat Direkomendasikan", color: "#2e7d32" },
  { name: "Sorong",          skor: 85, kepadatan: 402.56, jalan: "Kelas I (Sangat Baik)",      rekomendasi: "Sangat Direkomendasikan", color: "#2e7d32" },
  { name: "Sorong Timur",    skor: 81, kepadatan: 594.55, jalan: "Kelas III (Cukup)",          rekomendasi: "Sangat Direkomendasikan", color: "#2e7d32" },
  { name: "Malaimsimsa",     skor: 75, kepadatan: 311.62, jalan: "Kelas IV (Kurang)",          rekomendasi: "Sangat Direkomendasikan", color: "#2e7d32" },
  { name: "Sorong Barat",    skor: 62, kepadatan: 293.17, jalan: "Kelas III (Cukup)",          rekomendasi: "Direkomendasikan",       color: "#558b2f" },
  { name: "Sorong Kota",     skor: 60, kepadatan: 271.60, jalan: "Kelas II (Baik)",            rekomendasi: "Direkomendasikan",       color: "#558b2f" },
  { name: "Klaurung",        skor: 55, kepadatan: 179.48, jalan: "Kelas IV (Kurang)",          rekomendasi: "Direkomendasikan",       color: "#558b2f" },
  { name: "Maladum Mes",     skor: 42, kepadatan: 93.25,  jalan: "Kelas IV (Kurang)",          rekomendasi: "Tidak Direkomendasikan", color: "#e84d2a" },
  { name: "Sorong Utara",    skor: 38, kepadatan: 29.02,  jalan: "Kelas II (Baik)",            rekomendasi: "Tidak Direkomendasikan", color: "#e84d2a" },
  { name: "Sorong Kepulauan",skor: 20, kepadatan: 65.75,  jalan: "Terbatas (Air)",             rekomendasi: "Tidak Direkomendasikan", color: "#e84d2a" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#0a1a10", border: "2px solid #1a5c2e", padding: "10px 14px", fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>
        <div style={{ color: "#4caf50", fontFamily: "'Press Start 2P', monospace", fontSize: "9px", marginBottom: "8px" }}>{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} style={{ color: p.color, marginBottom: "4px" }}>
            {p.name}: <strong>{p.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function HasilRekomendasi() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as AnalysisState | null);

  const [distrikHasil, setDistrikHasil] = useState<DistrikHasil[]>(state?.distrikHasil ?? []);
  const [isLoading, setIsLoading] = useState(!state?.distrikHasil);

  useEffect(() => {
    if (!state?.distrikHasil) {
      const fetchNames = async () => {
        try {
          const res = await fetch("/qgis/data/prbaru_1.js");
          const text = await res.text();
          const jsonStart = text.indexOf('{');
          if (jsonStart !== -1) {
            const jsonString = text.substring(jsonStart).replace(/;?\s*$/, '');
            const data = JSON.parse(jsonString);
            const names = [...new Set(data.features.map((f: any) => String(f.properties["NAME_3"] ?? "")).filter(Boolean))];
            
            const filteredFallback = distrikFallback.filter(d => names.includes(d.name));
            setDistrikHasil(filteredFallback.length > 0 ? filteredFallback : distrikFallback);
          } else {
            setDistrikHasil(distrikFallback);
          }
        } catch {
          setDistrikHasil(distrikFallback);
        } finally {
          setIsLoading(false);
        }
      };
      fetchNames();
    }
  }, [state?.distrikHasil]);

  const bobotKepadatan = state?.bobotKepadatan ?? 50;
  const bobotJalan = state?.bobotJalan ?? 50;

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f7ee", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "'Press Start 2P', monospace", color: "#1a5c2e" }}>
        MEMUAT DATA...
      </div>
    );
  }

  // Computed stats
  const skorTertinggi = distrikHasil[0];
  const rataRata = distrikHasil.length > 0 ? Math.round(distrikHasil.reduce((s, d) => s + d.skor, 0) / distrikHasil.length * 10) / 10 : 0;
  const sangatDirekomendasikan = distrikHasil.filter(d => d.skor >= 75).length;

  // Data untuk chart bar
  const chartData = distrikHasil.map(d => ({
    name: d.name.replace("Sorong ", "Srg. ").replace("Sorong", "Srg."),
    skor: d.skor,
  }));

  // Data radar untuk distrik teratas
  const radarData = [
    { subject: "Kepadatan Penduduk", A: Math.min(100, Math.round((skorTertinggi?.kepadatan ?? 0) / 6)), fullMark: 100 },
    { subject: "Akses Jalan", A: bobotJalan, fullMark: 100 },
    { subject: "Skor Gabungan", A: skorTertinggi?.skor ?? 0, fullMark: 100 },
  ];

  // Rekomendasi dinamis berdasarkan top 4 distrik
  const rekomendasiDinamis = distrikHasil.slice(0, 4).map((d, i) => {
    const icons = ["🎯", "📈", "⚖️", "🔍"];
    const tagColor = d.skor >= 75 ? "#4caf50" : d.skor >= 50 ? "#ffb300" : "#e84d2a";
    const tag = i === 0 ? "PRIORITAS UTAMA" : d.skor >= 75 ? "SANGAT DISARANKAN" : d.skor >= 50 ? "ALTERNATIF" : "PERTIMBANGAN";
    return {
      icon: icons[i],
      tag,
      color: tagColor,
      title: `[${d.name}] — ${d.rekomendasi}`,
      area: tag.charAt(0) + tag.slice(1).toLowerCase(),
      desc: `Skor kesesuaian ${d.skor}/100 dengan kepadatan ${d.kepadatan.toFixed(0)} jiwa/km² dan akses ${d.jalan.split(" (")[0]}. ${
        d.skor >= 75
          ? "Sangat direkomendasikan sebagai lokasi usaha kuliner baru."
          : d.skor >= 50
          ? "Potensial dikembangkan dengan peningkatan infrastruktur."
          : "Perlu kajian lebih lanjut sebelum membuka usaha baru."
      }`,
    };
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ee" }}>
      {/* Header with food photo strip */}
      <div style={{ background: "#0f2417", borderBottom: "4px solid #e84d2a", position: "relative" }}>
        {/* Photo strip */}
        <div style={{ display: "flex", height: "160px", overflow: "hidden", position: "relative" }}>
          {[
            "https://images.unsplash.com/photo-1739484151190-e2a73842ca13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
            "https://images.unsplash.com/photo-1562158079-e4b9ed06b62d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
            "https://images.unsplash.com/photo-1680674774705-90b4904b3a7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
            "https://images.unsplash.com/photo-1764397576287-8e5fd265353b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
            "https://images.unsplash.com/photo-1661939252817-ebb73304f4c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
            "https://images.unsplash.com/photo-1600175074394-f2f4c500f7ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
          ].map((url, i) => (
            <div key={i} style={{ flex: 1, overflow: "hidden", position: "relative" }}>
              <img
                src={url}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.45) saturate(0.8)" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "linear-gradient(rgba(76,175,80,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(76,175,80,0.07) 1px, transparent 1px)",
                  backgroundSize: "12px 12px",
                }}
              />
            </div>
          ))}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(15,36,23,0.5) 0%, rgba(15,36,23,0.85) 100%)",
              pointerEvents: "none",
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto" style={{ padding: "24px 20px 32px", position: "relative" }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", color: "#e84d2a", letterSpacing: "0.1em", marginBottom: "12px" }}>
            ▶ HASIL &amp; REKOMENDASI GIS ◀
          </div>
          <h1 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(16px, 3vw, 24px)", color: "#f0f7ee", marginBottom: "10px" }}>
            Analisis Spasial Kuliner
          </h1>
          <p style={{ color: "#4a7a5a", fontSize: "13px", maxWidth: "600px", marginBottom: "16px" }}>
            Hasil analisis Weighted Overlay GIS terhadap {distrikHasil.length} distrik Kota Sorong.{" "}
            Bobot: <strong style={{ color: "#4caf50" }}>Kepadatan {bobotKepadatan}%</strong> —{" "}
            <strong style={{ color: "#8B4513" }}>Jalan {bobotJalan}%</strong>
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "8px",
              background: "transparent",
              border: "2px solid #4caf50",
              color: "#4caf50",
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            ← KEMBALI KE PETA
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Distrik Teranalisis", value: String(distrikHasil.length), sub: "Dari Data Peta", icon: MapPin, color: "#4caf50" },
            { label: "Skor Tertinggi", value: String(skorTertinggi?.skor ?? "-"), sub: skorTertinggi?.name ?? "-", icon: Target, color: "#e84d2a" },
            { label: "Skor Rata-rata Kota", value: String(rataRata), sub: "dari 100", icon: Navigation, color: "#ffb300" },
            { label: "Sangat Direkomendasikan", value: String(sangatDirekomendasikan), sub: "Distrik", icon: CheckCircle, color: "#0e7a8a" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", border: "2px solid #1a5c2e", boxShadow: "4px 4px 0 #0f2417", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <s.icon size={16} color={s.color} />
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "7px", color: "#4a7a5a", lineHeight: 1.4 }}>
                  {s.label}
                </div>
              </div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "20px", color: s.color, marginBottom: "4px" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "11px", color: "#4a7a5a" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div style={{ background: "#fff", border: "2px solid #1a5c2e", boxShadow: "4px 4px 0 #0f2417", padding: "20px", marginBottom: "32px" }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", color: "#1a5c2e", marginBottom: "16px" }}>
            ▶ SKOR KESESUAIAN PER DISTRIK — Bobot Kepadatan {bobotKepadatan}% / Jalan {bobotJalan}%
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: "#4a7a5a", fontSize: 10 }} />
              <YAxis tick={{ fill: "#4a7a5a", fontSize: 10 }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="skor" fill="#4caf50" name="Skor Kesesuaian" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ranking table */}
        <div style={{ background: "#fff", border: "2px solid #1a5c2e", boxShadow: "4px 4px 0 #0f2417", padding: "20px", marginBottom: "32px" }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", color: "#1a5c2e", marginBottom: "16px" }}>
            ▶ RANKING DISTRIK
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0f2417" }}>
                  {["Peringkat", "Nama Distrik", "Kepadatan (jiwa/km²)", "Kelas Akses Jalan", "Skor (0-100)", "Rekomendasi"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontFamily: "'Press Start 2P', monospace", fontSize: "8px", color: "#4caf50", borderBottom: "2px solid #1a5c2e", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {distrikHasil.map((d, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #d4e8d0", background: i % 2 === 0 ? "#f8fff6" : "#fff" }}>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{
                        display: "inline-flex", width: "28px", height: "28px",
                        background: i < 3 ? "#4caf50" : i < 5 ? "#ffb300" : "#e0e0e0",
                        color: i < 5 ? "#0f2417" : "#555",
                        alignItems: "center", justifyContent: "center",
                        fontFamily: "'Press Start 2P', monospace", fontSize: "12px",
                        border: "2px solid #0f2417",
                      }}>
                        {i + 1}
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#0f2417", fontWeight: 600, fontSize: "13px" }}>{d.name}</td>
                    <td style={{ padding: "10px 12px", fontFamily: "'Press Start 2P', monospace", fontSize: "11px", color: "#0e7a8a" }}>
                      {d.kepadatan > 0 ? d.kepadatan.toFixed(1) : "-"}
                    </td>
                    <td style={{ padding: "10px 12px", fontFamily: "'Press Start 2P', monospace", fontSize: "11px", color: "#8b5e3c" }}>
                      {d.jalan.split(" (")[0]}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "13px", color: d.color }}>{d.skor}</span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ background: d.color, color: d.skor >= 75 ? "#0f2417" : "#fff", padding: "4px 8px", fontSize: "10px", fontWeight: "bold", borderRadius: "4px" }}>
                        {d.rekomendasi}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Radar + Temuan Kunci */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div style={{ background: "#fff", border: "2px solid #1a5c2e", boxShadow: "4px 4px 0 #0f2417", padding: "20px" }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", color: "#1a5c2e", marginBottom: "16px" }}>
              ▶ INDEKS PERFORMA — {(skorTertinggi?.name ?? "").toUpperCase()}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#d4e8d0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#4a7a5a", fontSize: 11 }} />
                <Radar name="Distrik" dataKey="A" stroke="#4caf50" fill="#4caf50" fillOpacity={0.3} strokeWidth={2} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: "#fff", border: "2px solid #1a5c2e", boxShadow: "4px 4px 0 #0f2417", padding: "20px" }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", color: "#1a5c2e", marginBottom: "16px" }}>
              ▶ TEMUAN KUNCI
            </div>
            {[
              {
                icon: CheckCircle, color: "#4caf50",
                text: `Distrik terbaik: ${skorTertinggi?.name ?? "-"} dengan skor ${skorTertinggi?.skor ?? "-"}/100 — kepadatan ${skorTertinggi?.kepadatan.toFixed(0) ?? "-"} jiwa/km² dan akses ${skorTertinggi?.jalan?.split(" (")[0] ?? "-"}.`,
              },
              {
                icon: AlertTriangle, color: "#ffb300",
                text: `Bobot kepadatan ${bobotKepadatan}% / jalan ${bobotJalan}%: ${distrikHasil.filter(d => d.skor < 50).length} distrik memiliki skor di bawah 50 — perlu kajian infrastruktur lebih lanjut.`,
              },
              {
                icon: Lightbulb, color: "#0e7a8a",
                text: "Kembali ke halaman peta untuk mengubah bobot dan melihat perubahan ranking berdasarkan prioritas kriteria Anda.",
              },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
                <f.icon size={16} color={f.color} style={{ flexShrink: 0, marginTop: "2px" }} />
                <p style={{ fontSize: "12px", color: "#4a7a5a", lineHeight: 1.6, margin: 0 }}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rekomendasi Dinamis */}
        <div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "11px", color: "#0f2417", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Lightbulb size={18} color="#e84d2a" />
            REKOMENDASI BERBASIS DATA
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {rekomendasiDinamis.map((r, i) => (
              <div key={i} style={{ background: "#fff", border: `2px solid ${r.color}`, boxShadow: "4px 4px 0 #0f2417", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "28px" }}>{r.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "7px", color: r.color, marginBottom: "6px", padding: "3px 8px", border: `1px solid ${r.color}`, display: "inline-block" }}>
                      {r.tag}
                    </div>
                    <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px", color: "#0f2417", lineHeight: 1.6 }}>
                      {r.title}
                    </h3>
                  </div>
                </div>
                <div style={{ fontSize: "10px", color: "#0e7a8a", fontFamily: "'Press Start 2P', monospace", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                  📍 {r.area}
                </div>
                <p style={{ fontSize: "12px", color: "#4a7a5a", lineHeight: 1.7, margin: 0 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
