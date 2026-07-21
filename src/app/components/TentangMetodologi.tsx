import { Globe, CheckSquare, Users, ExternalLink } from "lucide-react";

const team = [
  { name: "Ahmad Fauzi, S.T.", role: "Ketua Tim / GIS Analyst", icon: "👨‍💻", kota: "Sorong" },
  { name: "Siti Rahmawati, S.Si.", role: "Data Scientist / Remote Sensing", icon: "👩‍🔬", kota: "Manokwari" },
  { name: "Dedi Santoso, S.P.", role: "Surveyor Lapangan", icon: "🧭", kota: "Sorong" },
  { name: "Nurul Hidayah, S.Kom.", role: "Web Developer / Data Viz", icon: "👩‍💻", kota: "Sorong" },
  { name: "Rina Melati, S.Ds.", role: "UI/UX Designer", icon: "👩‍🎨", kota: "Sorong" },
  { name: "Putri Sari, S.E.", role: "Data Entry / Administrasi", icon: "👩‍💼", kota: "Sorong" },
];

export function TentangMetodologi() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ee" }}>
      {/* Header */}
      <div style={{ background: "#0f2417", padding: "40px 20px", borderBottom: "4px solid #1a5c2e" }}>
        <div className="max-w-5xl mx-auto">
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "8px",
              color: "#4caf50",
              letterSpacing: "0.1em",
              marginBottom: "12px",
            }}
          >
            ▶ TENTANG KAMI ◀
          </div>
          <h1
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(14px, 3vw, 22px)",
              color: "#f0f7ee",
              marginBottom: "12px",
              lineHeight: 1.4,
            }}
          >
            GeoKuliner Sorong
          </h1>
          <p style={{ color: "#4a7a5a", fontSize: "14px", maxWidth: "600px", lineHeight: 1.7 }}>
            Proyek penelitian Sistem Informasi Geografis untuk pemetaan dan analisis
            ekosistem kuliner Kota Sorong, Papua Barat Daya. Mengintegrasikan data primer
            survei lapangan pada beberapa distrik dengan analisis spasial berbasis GIS.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* About project */}
        <section className="mb-12">
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "10px",
              color: "#0f2417",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Globe size={16} color="#4caf50" />
            TENTANG PROYEK
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              style={{
                background: "#fff",
                border: "2px solid #1a5c2e",
                boxShadow: "4px 4px 0 #0f2417",
                padding: "24px",
              }}
            >
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "9px",
                  color: "#4caf50",
                  marginBottom: "14px",
                }}
              >
                LATAR BELAKANG
              </div>
              <p style={{ fontSize: "13px", color: "#4a7a5a", lineHeight: 1.8 }}>
                Kota Sorong sebagai pintu gerbang wisata Raja Ampat mengalami pertumbuhan
                pesat di sektor kuliner. Namun belum ada sistem pemetaan yang komprehensif
                untuk memahami distribusi spasial dan potensi pengembangannya.
              </p>
              <p style={{ fontSize: "13px", color: "#4a7a5a", lineHeight: 1.8, marginTop: "10px" }}>
                GeoKuliner Sorong hadir sebagai platform GIS berbasis web yang memudahkan
                analisis dan visualisasi ekosistem kuliner kota untuk mendukung kebijakan
                pengembangan UMKM dan pariwisata.
              </p>
            </div>

            <div
              style={{
                background: "#fff",
                border: "2px solid #1a5c2e",
                boxShadow: "4px 4px 0 #0f2417",
                padding: "24px",
              }}
            >
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "9px",
                  color: "#4caf50",
                  marginBottom: "14px",
                }}
              >
                TUJUAN PENELITIAN
              </div>
              {[
                "Memetakan distribusi spasial kuliner pada distrik terpilih di Kota Sorong",
                "Menganalisis kesesuaian lokasi berdasarkan kepadatan penduduk dan akses jalan",
                "Memberikan rekomendasi spasial berbasis data untuk pengembangan UMKM kuliner",
                "Membangun sistem informasi geospasial interaktif sebagai alat bantu pengambilan keputusan",
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <CheckSquare size={14} color="#4caf50" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ fontSize: "12px", color: "#4a7a5a", lineHeight: 1.6 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Formula */}
        <section className="mb-12">
          <div
            style={{
              background: "#fff",
              border: "2px solid #e84d2a",
              boxShadow: "4px 4px 0 #0f2417",
              padding: "24px",
            }}
          >
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "9px",
                color: "#e84d2a",
                marginBottom: "14px",
              }}
            >
              FORMULA SKOR KESESUAIAN
            </div>
            <div
              style={{
                background: "#f8fff6",
                border: "1px dashed #4caf50",
                padding: "16px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "13px",
                color: "#0f2417",
                textAlign: "center",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Skor Kesesuaian = (Kepadatan Penduduk Ternormalisasi x Bobot Kepadatan) + (Akses Jalan Ternormalisasi x Bobot Akses Jalan)
            </div>
            <p style={{ fontSize: "12px", color: "#4a7a5a", lineHeight: 1.6 }}>
              Formula ini digunakan untuk mengkalkulasi kesesuaian lokasi di setiap distrik. Nilai yang dihasilkan berada pada rentang 0-100 dan diklasifikasikan ke dalam 3 kelas rekomendasi.
            </p>
          </div>
        </section>

        {/* Team */}
        <section className="mb-10">
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "10px",
              color: "#0f2417",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Users size={16} color="#4caf50" />
            TIM PENELITI
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {team.map((t, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "2px solid #1a5c2e",
                  boxShadow: "4px 4px 0 #0f2417",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    background: "#0f2417",
                    border: "3px solid #4caf50",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    margin: "0 auto 12px",
                    boxShadow: "3px 3px 0 #4caf50",
                  }}
                >
                  {t.icon}
                </div>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", color: "#0f2417", marginBottom: "6px", lineHeight: 1.6 }}>
                  {t.name}
                </div>
                <div style={{ fontSize: "11px", color: "#4a7a5a", marginBottom: "6px", lineHeight: 1.5 }}>
                  {t.role}
                </div>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "7px", color: "#4caf50" }}>
                  📍 {t.kota}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Citation */}
        <div
          style={{
            background: "#0f2417",
            border: "2px solid #1a5c2e",
            boxShadow: "4px 4px 0 #4caf50",
            padding: "24px",
          }}
        >
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", color: "#4caf50", marginBottom: "14px" }}>
            ▶ SITASI & REFERENSI
          </div>
          <div
            style={{
              background: "#0a1a10",
              border: "1px solid #1a5c2e",
              padding: "14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              color: "#a5d6a7",
              lineHeight: 1.7,
              marginBottom: "14px",
            }}
          >
            Fauzi, A., Rahmawati, S., Santoso, D., Hidayah, N., dkk. (2024).{" "}
            <em style={{ color: "#4caf50" }}>
              GeoKuliner Sorong: Sistem Informasi Geografis untuk Analisis Spasial Ekosistem
              Kuliner Kota Sorong, Papua Barat Daya.
            </em>{" "}
            Jurnal GIS Indonesia, 12(2), 45–62.
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {["QGIS Documentation", "PySAL Library", "OpenStreetMap Wiki"].map((ref, i) => (
              <a
                key={i}
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "8px",
                  color: "#0e7a8a",
                  textDecoration: "none",
                  border: "1px solid #0e7a8a",
                  padding: "4px 10px",
                }}
              >
                <ExternalLink size={10} />
                {ref}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
