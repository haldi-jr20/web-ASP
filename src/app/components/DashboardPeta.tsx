import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Layers, ZoomIn, ZoomOut, Maximize2, Search, RefreshCw } from "lucide-react";
import type L from "leaflet";

// ─── Scoring constants ──────────────────────────────────────────────────────
const MIN_KEPADATAN = 0;
const MAX_KEPADATAN = 600;

const DISTRICT_KEPADATAN: Record<string, number> = {
  "Sorong Barat":    293.17,
  "Maladum Mes":     93.25,
  "Sorong Kepulauan": 65.75,
  "Sorong Timur":    594.55,
  "Sorong Utara":    29.02,
  "Sorong":          402.56,
  "Sorong Manoi":    416.23,
  "Klaurung":        179.48,
  "Malaimsimsa":     311.62,
  "Sorong Kota":     271.60,
};

const DISTRICT_JALAN: Record<string, string> = {
  "Sorong":          "Kelas I (Sangat Baik)",
  "Sorong Manoi":    "Kelas II (Baik)",
  "Sorong Utara":    "Kelas II (Baik)",
  "Sorong Selatan":  "Kelas III (Cukup)",
  "Sorong Barat":    "Kelas III (Cukup)",
  "Sorong Timur":    "Kelas III (Cukup)",
  "Malaimsimsa":     "Kelas IV (Kurang)",
  "Maladum Mes":     "Kelas IV (Kurang)",
  "Sorong Kepulauan":"Terbatas (Air)",
  "Sorong Kota":     "Kelas II (Baik)",
};

const JALAN_SCORES: Record<string, number> = {
  "Kelas I (Sangat Baik)": 100,
  "Kelas II (Baik)": 80,
  "Kelas III (Cukup)": 60,
  "Kelas IV (Kurang)": 40,
  "Terbatas (Air)": 20,
};

function computeScore(name: string, bobotKepadatan: number) {
  const kepadatan = DISTRICT_KEPADATAN[name] ?? 1000;
  const jalan     = DISTRICT_JALAN[name]     ?? "Kelas III (Cukup)";
  const bobotJalan = 100 - bobotKepadatan;
  const normalKepadatan = Math.min(100, Math.max(0, ((kepadatan - MIN_KEPADATAN) / (MAX_KEPADATAN - MIN_KEPADATAN)) * 100));
  const normalJalan = JALAN_SCORES[jalan] ?? 50;
  const skor = Math.round((normalKepadatan * bobotKepadatan) / 100 + (normalJalan * bobotJalan) / 100);
  const skorKepadatan = Math.round(normalKepadatan);
  let color = "#e84d2a";
  let rekomendasi = "Tidak Direkomendasikan";
  if (skor >= 75) { color = "#2e7d32"; rekomendasi = "Sangat Direkomendasikan"; }
  else if (skor >= 50) { color = "#558b2f"; rekomendasi = "Direkomendasikan"; }
  return { name, kepadatan, jalan, skor, skorKepadatan, skorJalan: normalJalan, color, rekomendasi };
}

const skorList = ["Semua Skor", "Sangat Sesuai (75-100)", "Cukup Sesuai (50-75)", "Kurang Sesuai (0-50)"];

const layerDefs = [
  { id: "kepadatan", label: "Kepadatan Penduduk",          active: true, color: "#4caf50" },
  { id: "jalan",     label: "Jaringan Jalan",              active: true, color: "#8B4513" },
  { id: "sungai",    label: "Sungai",                      active: true, color: "#1565c0" },
  { id: "eksisting", label: "Titik Usaha Kuliner",         active: true, color: "#e84d2a" },
];

const jenisCategories = [
  { label: "Titik Usaha Kuliner", color: "#2196f3" },
];

function getKulinerColor(jenis: string): string {
  return "#2196f3";
}

const SORONG_CENTER: [number, number] = [-0.876, 131.270];
const SORONG_ZOOM = 12;

const categoryColors: Record<string, string> = {
  "Kurang Sesuai (0-50)":  "#e84d2a",
  "Cukup Sesuai (50-75)":  "#558b2f",
  "Sangat Sesuai (75-100)":"#2e7d32",
};

// ─── GeoJSON types ───────────────────────────────────────────────────────────
type GeoFeature = { type: string; properties: Record<string, unknown>; geometry: { type: string; coordinates: unknown } };
type GeoCollection = { type: string; features: GeoFeature[] };

export function DashboardPeta() {
  const [selectedSkor, setSelectedSkor] = useState("Semua Skor");
  const [selectedKecamatan, setSelectedKecamatan] = useState("Semua Distrik");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [layers, setLayers] = useState(layerDefs);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bobotKepadatan, setBobotKepadatan] = useState(50);
  const [pendingBobot, setPendingBobot] = useState(50);
  const [recalcKey, setRecalcKey] = useState(0);
  const [tileStyle, setTileStyle] = useState<"satellite" | "dark" | "topo">("satellite");
  const [cursorCoord, setCursorCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(SORONG_ZOOM);
  const [mapReady, setMapReady] = useState(false);
  const [districtNames, setDistrictNames] = useState<string[]>([]);

  const mapRef         = useRef<HTMLDivElement>(null);
  const leafletMapRef  = useRef<L.Map | null>(null);
  const tileLayerRef   = useRef<L.TileLayer | null>(null);
  const districtLayerRef  = useRef<L.Layer[]>([]);
  const roadLayerRef      = useRef<L.Layer | null>(null);
  const riverLayerRef     = useRef<L.Layer | null>(null);
  const kulinerLayerRef   = useRef<L.Layer[]>([]);
  const geojsonDataRef    = useRef<{ districts: GeoCollection | null; roads: GeoCollection | null; rivers: GeoCollection | null; kuliner: GeoCollection | null }>({
    districts: null, roads: null, rivers: null, kuliner: null,
  });

  const bobotJalan = 100 - bobotKepadatan;

  // Layer active states
  const kepadatanActive = layers.find(l => l.id === "kepadatan")?.active ?? true;
  const jalanActive     = layers.find(l => l.id === "jalan")?.active ?? true;
  const sungaiActive    = layers.find(l => l.id === "sungai")?.active ?? true;
  const eksistingActive = layers.find(l => l.id === "eksisting")?.active ?? true;

  // All districts with scores, filtered by what's actually in the GeoJSON
  const allDistricts = useMemo(
    () => {
      const keys = districtNames.length > 0
        ? Object.keys(DISTRICT_KEPADATAN).filter(k => districtNames.includes(k))
        : Object.keys(DISTRICT_KEPADATAN);
      return keys.map(name => computeScore(name, bobotKepadatan));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recalcKey, bobotKepadatan, districtNames]
  );

  const distrikList = useMemo(() => ["Semua Distrik", ...districtNames], [districtNames]);

  const filteredDistricts = useMemo(() => allDistricts.filter(d => {
    let skorMatch = true;
    if (selectedSkor === "Sangat Sesuai (75-100)") skorMatch = d.skor >= 75;
    else if (selectedSkor === "Cukup Sesuai (50-75)") skorMatch = d.skor >= 50 && d.skor < 75;
    else if (selectedSkor === "Kurang Sesuai (0-50)") skorMatch = d.skor < 50;
    const kecMatch = selectedKecamatan === "Semua Distrik" || d.name === selectedKecamatan;
    const searchMatch = searchQuery === "" || d.name.toLowerCase().includes(searchQuery.toLowerCase());
    return skorMatch && kecMatch && searchMatch;
  }), [allDistricts, selectedSkor, selectedKecamatan, searchQuery]);

  const selectedDistrict = selectedName ? allDistricts.find(d => d.name === selectedName) ?? null : null;

  const toggleLayer = (id: string) => setLayers(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l));

  const navigate = useNavigate();

  const handleRunAnalysis = () => {
    const bobotFinal = pendingBobot;
    setBobotKepadatan(bobotFinal);
    setRecalcKey(k => k + 1);
    setSelectedName(null);

    // Hitung skor hanya untuk distrik yang ada di GeoJSON (atau fallback ke semua)
    const keys = districtNames.length > 0 
      ? Object.keys(DISTRICT_KEPADATAN).filter(k => districtNames.includes(k))
      : Object.keys(DISTRICT_KEPADATAN);

    const distrikHasil = keys.map(name => {
      const result = computeScore(name, bobotFinal);
      return {
        name: result.name,
        skor: result.skor,
        kepadatan: result.kepadatan,
        jalan: result.jalan,
        rekomendasi: result.rekomendasi,
        color: result.color,
      };
    }).sort((a, b) => b.skor - a.skor);

    navigate("/hasil", {
      state: {
        bobotKepadatan: bobotFinal,
        bobotJalan: 100 - bobotFinal,
        distrikHasil,
      },
    });
  };

  // ─── Load GeoJSON data files ──────────────────────────────────────────────
  useEffect(() => {
    async function loadGeoJSON(url: string, varName: string): Promise<GeoCollection | null> {
      try {
        const res = await fetch(url);
        const text = await res.text();
        const jsonStart = text.indexOf('{');
        if (jsonStart === -1) return null;
        const jsonString = text.substring(jsonStart).replace(/;?\s*$/, '');
        return JSON.parse(jsonString) as GeoCollection;
      } catch { return null; }
    }

    Promise.all([
      loadGeoJSON("/qgis/data/prbaru_1.js", "json_prbaru_1"),
      loadGeoJSON("/qgis/data/JALAN_LN_50K_2.js", "json_JALAN_LN_50K_2"),
      loadGeoJSON("/qgis/data/SUNGAI_AR_50K_4.js", "json_SUNGAI_AR_50K_4"),
      loadGeoJSON("/qgis/data/lokasi_3.js", "json_lokasi_3"),
    ]).then(([districts, roads, rivers, kuliner]) => {
      geojsonDataRef.current = { districts, roads, rivers, kuliner };
      if (districts) {
        const names = [...new Set(
          districts.features
            .map(f => String(f.properties["NAME_3"] ?? ""))
            .filter(Boolean)
        )].sort();
        setDistrictNames(names);
      }
      // Always trigger layer re-render after data is loaded
      setRecalcKey(k => k + 1);
    });
  }, []);

  // ─── Initialize Leaflet map ───────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    import("leaflet").then(Leaflet => {
      const L = Leaflet.default;

      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: SORONG_CENTER,
        zoom:   SORONG_ZOOM,
        zoomControl: false,
      });

      // Custom panes for z-ordering
      map.createPane("riverPane");
      (map.getPane("riverPane") as HTMLElement).style.zIndex = "340";
      map.createPane("districtPane");
      (map.getPane("districtPane") as HTMLElement).style.zIndex = "350";
      map.createPane("roadPane");
      (map.getPane("roadPane") as HTMLElement).style.zIndex = "360";
      map.createPane("kulinerPane");
      (map.getPane("kulinerPane") as HTMLElement).style.zIndex = "420";

      // Satellite base tile (Esri World Imagery — same as QGIS screenshot)
      const tile = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles &copy; Esri", maxZoom: 20 }
      );
      tile.addTo(map);

      L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

      map.on("mousemove", e => setCursorCoord({ lat: e.latlng.lat, lng: e.latlng.lng }));
      map.on("mouseout", () => setCursorCoord(null));
      map.on("zoomend", () => setZoomLevel(map.getZoom()));

      leafletMapRef.current = map;
      tileLayerRef.current  = tile;
      setMapReady(true);
      // Trigger layer render now that map is ready (data may already be loaded)
      setRecalcKey(k => k + 1);
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        tileLayerRef.current  = null;
        setMapReady(false);
      }
    };
  }, []);

  // ─── Update tile layer when tileStyle changes ─────────────────────────────
  useEffect(() => {
    if (!leafletMapRef.current || !tileLayerRef.current) return;
    import("leaflet").then(Leaflet => {
      const L   = Leaflet.default;
      const map = leafletMapRef.current!;
      tileLayerRef.current!.remove();

      const configs: Record<string, { url: string; options: L.TileLayerOptions }> = {
        satellite: {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          options: { attribution: "Tiles &copy; Esri", maxZoom: 20 },
        },
        dark: {
          url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          options: { attribution: "&copy; OSM &copy; CARTO", subdomains: "abcd", maxZoom: 20 },
        },
        topo: {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
          options: { attribution: "Tiles &copy; Esri", maxZoom: 19 },
        },
      };

      const cfg  = configs[tileStyle] ?? configs.satellite;
      const tile = L.tileLayer(cfg.url, cfg.options);
      tile.addTo(map);
      tileLayerRef.current = tile;
    });
  }, [tileStyle]);

  // ─── Render district choropleth polygons ──────────────────────────────────
  useEffect(() => {
    if (!leafletMapRef.current || !mapReady) return;
    const { districts } = geojsonDataRef.current;

    import("leaflet").then(Leaflet => {
      const L   = Leaflet.default;
      const map = leafletMapRef.current!;

      districtLayerRef.current.forEach(l => l.remove());
      districtLayerRef.current = [];

      if (!kepadatanActive || !districts) return;

      const scoreMap: Record<string, { color: string; skor: number; rekomendasi: string }> = {};
      allDistricts.forEach(d => { scoreMap[d.name] = { color: d.color, skor: d.skor, rekomendasi: d.rekomendasi }; });

      const filterSet = new Set(filteredDistricts.map(d => d.name));

      (L.geoJSON as (data: unknown, options: L.GeoJSONOptions) => L.GeoJSON)(districts, {
        style: (feature) => {
          const name  = String(feature?.properties?.["NAME_3"] ?? "");
          const score = scoreMap[name];
          const inFilter = filterSet.has(name);
          return {
            pane:        "districtPane",
            fillColor:   score ? score.color : "transparent",
            fillOpacity: inFilter ? 0.35 : 0.05,
            color:       "#ffffff",
            weight:      1.5,
            opacity:     inFilter ? 0.7 : 0.2,
          };
        },
        onEachFeature: (feature, layer) => {
          const name  = String(feature?.properties?.["NAME_3"] ?? "");
          const score = scoreMap[name];
          if (score) {
            layer.bindTooltip(
              `<div style="font-family:'Inter',sans-serif;font-size:12px;background:#0f2417;color:#fff;border:1.5px solid ${score.color};padding:5px 10px;border-radius:2px;">
                <strong style="color:${score.color}">${name}</strong><br/>
                Skor: <b>${score.skor}/100</b><br/>
                <span style="color:#a5d6a7;font-size:10px">${score.rekomendasi}</span>
              </div>`,
              { sticky: true, className: "district-tooltip" }
            );
            layer.on("click", () => {
              setSelectedName(prev => prev === name ? null : name);
            });
            layer.on("mouseover", function () {
              (layer as L.Path).setStyle({ weight: 3, fillOpacity: 0.55 });
            });
            layer.on("mouseout", function () {
              const inFilter = filterSet.has(name);
              (layer as L.Path).setStyle({
                weight: 1.5,
                fillOpacity: inFilter ? 0.35 : 0.05,
              });
            });
          }
          districtLayerRef.current.push(layer);
        },
      }).addTo(map);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDistricts, filteredDistricts, mapReady, kepadatanActive]);

  // ─── Render road network ──────────────────────────────────────────────────
  useEffect(() => {
    if (!leafletMapRef.current || !mapReady) return;
    const { roads } = geojsonDataRef.current;

    import("leaflet").then(Leaflet => {
      const L   = Leaflet.default;
      const map = leafletMapRef.current!;

      if (roadLayerRef.current) { roadLayerRef.current.remove(); roadLayerRef.current = null; }
      if (!jalanActive || !roads) return;

      roadLayerRef.current = (L.geoJSON as (data: unknown, options: L.GeoJSONOptions) => L.GeoJSON)(roads, {
        style: () => ({
          pane:   "roadPane",
          color:  "#ffeb3b", // Bright yellow
          weight: 2.5,
          opacity: 1,
        }),
      }).addTo(map);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, jalanActive, recalcKey]);

  // ─── Render rivers ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!leafletMapRef.current || !mapReady) return;
    const { rivers } = geojsonDataRef.current;

    import("leaflet").then(Leaflet => {
      const L   = Leaflet.default;
      const map = leafletMapRef.current!;

      if (riverLayerRef.current) { riverLayerRef.current.remove(); riverLayerRef.current = null; }
      if (!sungaiActive || !rivers) return;

      riverLayerRef.current = (L.geoJSON as (data: unknown, options: L.GeoJSONOptions) => L.GeoJSON)(rivers, {
        style: () => ({
          pane:    "riverPane",
          color:   "#1565c0",
          weight:  1.5,
          opacity: 0.7,
        }),
      }).addTo(map);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, sungaiActive, recalcKey]);

  // ─── Render kuliner eksisting markers ─────────────────────────────────────
  useEffect(() => {
    if (!leafletMapRef.current || !mapReady) return;
    const { kuliner } = geojsonDataRef.current;

    import("leaflet").then(Leaflet => {
      const L   = Leaflet.default;
      const map = leafletMapRef.current!;

      kulinerLayerRef.current.forEach(m => m.remove());
      kulinerLayerRef.current = [];

      if (!eksistingActive || !kuliner) return;

      kuliner.features.forEach(f => {
        const coords = (f.geometry as { type: string; coordinates: [number, number] }).coordinates;
        const [lng, lat] = coords;
        const name  = String(f.properties["Column 1"] ?? "");
        const jenis = String(f.properties["Column 8"] ?? "Restaurant");
        const rating = f.properties["Column 3"] ? Number(f.properties["Column 3"]).toFixed(1) : "-";
        const color = getKulinerColor(jenis);

        const marker = L.circleMarker([lat, lng], {
          radius: 6,
          fillColor: color,
          color: "#fff",
          weight: 1.5,
          fillOpacity: 0.9,
          pane: "kulinerPane",
        });

        marker.bindTooltip(
          `<div style="font-family:'Inter',sans-serif;font-size:11px;background:#0a1a10;border:1px solid ${color};color:#e8e8e8;padding:5px 10px;border-radius:2px;max-width:200px;">
            <strong style="color:${color};">● ${name}</strong><br/>
            <span style="color:#9a9a9a;">${jenis}</span><br/>
            <span style="color:#ffb300;">★ ${rating}</span>
          </div>`,
          { className: "kuliner-tooltip", direction: "top", offset: [0, -6] }
        );
        marker.addTo(map);
        kulinerLayerRef.current.push(marker);
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eksistingActive, mapReady, recalcKey]);

  // ─── Fly to selected district ─────────────────────────────────────────────
  useEffect(() => {
    if (!leafletMapRef.current || selectedKecamatan === "Semua Distrik") return;
    // Fly to the district's bounds using geojson data
    const { districts } = geojsonDataRef.current;
    if (!districts) return;
    import("leaflet").then(Leaflet => {
      const L   = Leaflet.default;
      const map = leafletMapRef.current!;
      const features = districts.features.filter(f => String(f.properties["NAME_3"]) === selectedKecamatan);
      if (!features.length) return;
      const layer = (L.geoJSON as (data: unknown) => L.GeoJSON)({ type: "FeatureCollection", features });
      const bounds = layer.getBounds();
      if (bounds.isValid()) map.flyToBounds(bounds, { padding: [40, 40], duration: 1 });
    });
  }, [selectedKecamatan]);

  return (
    <div style={{ height: "calc(100vh - 120px)", display: "flex", flexDirection: "column", background: "#0f2417" }}>
      {/* Toolbar */}
      <div style={{
        background: "#0a1a10", borderBottom: "2px solid #1a5c2e", padding: "8px 16px",
        display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap",
        fontFamily: "'Press Start 2P', monospace", fontSize: "8px",
      }}>
        <div style={{ color: "#4caf50" }}>▶ DASHBOARD PETA ANALISIS</div>
        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#1a3a24", border: "2px solid #1a5c2e", padding: "4px 10px" }}>
          <Search size={12} color="#4a7a5a" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari distrik..."
            style={{ background: "transparent", border: "none", outline: "none", color: "#a5d6a7", fontSize: "11px", width: "160px", fontFamily: "'Inter', sans-serif" }}
          />
        </div>

        <select
          value={selectedSkor}
          onChange={e => setSelectedSkor(e.target.value)}
          style={{ background: "#1a3a24", border: "2px solid #1a5c2e", color: "#a5d6a7", padding: "4px 8px", fontSize: "10px", fontFamily: "'Inter', sans-serif", cursor: "pointer" }}
        >
          {skorList.map(c => <option key={c} value={c} style={{ background: "#0f2417" }}>{c}</option>)}
        </select>

        <select
          value={selectedKecamatan}
          onChange={e => setSelectedKecamatan(e.target.value)}
          style={{ background: "#1a3a24", border: "2px solid #1a5c2e", color: "#a5d6a7", padding: "4px 8px", fontSize: "10px", fontFamily: "'Inter', sans-serif", cursor: "pointer" }}
        >
          {distrikList.map(k => <option key={k} value={k} style={{ background: "#0f2417" }}>{k}</option>)}
        </select>

        <div style={{ display: "flex", gap: "2px" }}>
          {(["satellite", "dark", "topo"] as const).map(style => {
            const labels = { satellite: "🛰 Satelit", dark: "🗺 Dark", topo: "📐 Topo" };
            return (
              <button key={style} onClick={() => setTileStyle(style)} style={{
                background: tileStyle === style ? "#4caf50" : "#1a3a24",
                border: `2px solid ${tileStyle === style ? "#4caf50" : "#1a5c2e"}`,
                color: tileStyle === style ? "#0f2417" : "#a5d6a7",
                padding: "4px 7px", fontSize: "9px", fontFamily: "'Inter', sans-serif", cursor: "pointer",
              }}>
                {labels[style]}
              </button>
            );
          })}
        </div>

        <div style={{ color: "#4a7a5a" }}>
          <span style={{ color: "#4caf50" }}>{filteredDistricts.length}</span> distrik
        </div>

        <button
          onClick={() => setSidebarOpen(v => !v)}
          style={{ background: "transparent", border: "2px solid #1a5c2e", color: "#4a7a5a", padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
        >
          <Layers size={12} />
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <div style={{ width: "250px", background: "#0a1a10", borderRight: "2px solid #1a5c2e", overflowY: "auto", flexShrink: 0 }}>
            <div style={{ padding: "16px", borderBottom: "2px solid #1a3a24" }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", color: "#4caf50", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Layers size={10} />
                LAYER ANALISIS
              </div>
              {layers.map(layer => (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", marginBottom: "4px",
                    background: layer.active ? "rgba(76,175,80,0.1)" : "transparent",
                    border: `2px solid ${layer.active ? layer.color : "#1a3a24"}`,
                    color: layer.active ? layer.color : "#4a7a5a",
                    fontSize: "10px", cursor: "pointer", textAlign: "left", fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <div style={{ width: "10px", height: "10px", background: layer.active ? layer.color : "transparent", border: `2px solid ${layer.color}`, flexShrink: 0 }} />
                  {layer.label}
                </button>
              ))}
            </div>

            <div style={{ padding: "16px", borderBottom: "2px solid #1a3a24" }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", color: "#4caf50", marginBottom: "12px" }}>PARAMETER ANALISIS</div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "7px", color: "#a5d6a7", marginBottom: "8px" }}>BOBOT KRITERIA</div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", marginBottom: "4px" }}>
                <span style={{ color: "#4caf50" }}>👥 Kepadatan</span>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px", color: "#4caf50" }}>{pendingBobot}%</span>
              </div>
              <input
                type="range" min="0" max="100" value={pendingBobot}
                onChange={e => setPendingBobot(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#4caf50", marginBottom: "4px" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", marginBottom: "14px" }}>
                <span style={{ color: "#8B4513" }}>🛣️ Akses Jalan</span>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px", color: "#8B4513" }}>{100 - pendingBobot}%</span>
              </div>

              {pendingBobot !== bobotKepadatan && (
                <div style={{ fontSize: "9px", color: "#ffb300", fontFamily: "'Press Start 2P', monospace", marginBottom: "8px", padding: "4px 6px", background: "rgba(255,179,0,0.1)", border: "1px solid #ffb300" }}>
                  ⚠ BELUM DITERAPKAN
                </div>
              )}

              <div style={{ marginBottom: "12px" }}>
                <select
                  value={selectedKecamatan}
                  onChange={e => setSelectedKecamatan(e.target.value)}
                  style={{ width: "100%", background: "#1a3a24", border: "2px solid #1a5c2e", color: "#a5d6a7", padding: "6px 8px", fontSize: "10px", fontFamily: "'Inter', sans-serif", cursor: "pointer" }}
                >
                  {distrikList.map(k => <option key={k} value={k} style={{ background: "#0f2417" }}>{k}</option>)}
                </select>
              </div>

              <button
                onClick={handleRunAnalysis}
                style={{
                  width: "100%", padding: "8px", background: "#4caf50", color: "#0f2417",
                  fontFamily: "'Press Start 2P', monospace", fontSize: "8px",
                  border: "2px solid #2e7d32", cursor: "pointer", boxShadow: "2px 2px 0 #1a4a1a",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                }}
              >
                <RefreshCw size={10} />
                JALANKAN ANALISIS
              </button>
            </div>

            <div style={{ padding: "12px 16px", borderBottom: "2px solid #1a3a24", background: "rgba(76,175,80,0.05)" }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "7px", color: "#4a7a5a", marginBottom: "8px" }}>BOBOT AKTIF</div>
              <div style={{ display: "flex", gap: "6px" }}>
                <div style={{ flex: 1, textAlign: "center", padding: "6px", background: "rgba(76,175,80,0.15)", border: "1px solid #4caf50" }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "12px", color: "#4caf50" }}>{bobotKepadatan}%</div>
                  <div style={{ fontSize: "8px", color: "#4a7a5a", marginTop: "2px" }}>Kepadatan</div>
                </div>
                <div style={{ flex: 1, textAlign: "center", padding: "6px", background: "rgba(139,69,19,0.15)", border: "1px solid #8B4513" }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "12px", color: "#8B4513" }}>{bobotJalan}%</div>
                  <div style={{ fontSize: "8px", color: "#4a7a5a", marginTop: "2px" }}>Akses Jalan</div>
                </div>
              </div>
            </div>

            <div style={{ padding: "16px", borderBottom: "2px solid #1a3a24" }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", color: "#4caf50", marginBottom: "12px" }}>LEGENDA SKOR</div>
              {Object.entries(categoryColors).map(([cat, color]) => (
                <div key={cat} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "10px", color: "#a5d6a7" }}>
                  <div style={{ width: "16px", height: "10px", background: color + "99", border: `1.5px solid ${color}`, flexShrink: 0 }} />
                  {cat}
                </div>
              ))}
              <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #1a3a24" }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "7px", color: "#4a7a5a", marginBottom: "6px" }}>TITIK USAHA EKSISTING</div>
                {jenisCategories.map(jc => (
                  <div key={jc.label} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", fontSize: "9px", color: "#a5d6a7" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: jc.color, border: "1.5px solid rgba(255,255,255,0.5)", flexShrink: 0 }} />
                    {jc.label}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "16px" }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", color: "#4caf50", marginBottom: "12px" }}>STATISTIK</div>
              {[
                { label: "Distrik Tampil",  value: filteredDistricts.length },
                { label: "Skor Tertinggi",  value: Math.max(...allDistricts.map(d => d.skor)) },
                { label: "Skor Rata-rata",  value: Math.round(allDistricts.reduce((s, d) => s + d.skor, 0) / allDistricts.length) },
                { label: "Titik Kuliner",   value: geojsonDataRef.current.kuliner?.features.length ?? "..." },
              ].map(s => (
                <div key={s.label} style={{ marginBottom: "10px" }}>
                  <div style={{ color: "#4a7a5a", fontSize: "9px" }}>{s.label}</div>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "14px", color: "#4caf50" }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map area */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

          {/* Zoom controls */}
          <div style={{ position: "absolute", bottom: "40px", right: "16px", display: "flex", flexDirection: "column", gap: "4px", zIndex: 1000 }}>
            {[
              { icon: ZoomIn,    action: () => leafletMapRef.current?.zoomIn() },
              { icon: ZoomOut,   action: () => leafletMapRef.current?.zoomOut() },
              { icon: Maximize2, action: () => leafletMapRef.current?.flyTo(SORONG_CENTER, SORONG_ZOOM, { duration: 1 }) },
            ].map(({ icon: Icon, action }, i) => (
              <button key={i} onClick={action} style={{
                width: "32px", height: "32px", background: "#0a1a10", border: "2px solid #1a5c2e",
                color: "#4caf50", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={14} />
              </button>
            ))}
          </div>

          {/* District info popup */}
          {selectedDistrict && (
            <div style={{
              position: "absolute", top: "12px", right: "12px", width: "272px",
              background: "#0a1a10", border: `2px solid ${selectedDistrict.color}`,
              boxShadow: `4px 4px 0 ${selectedDistrict.color}66`, overflow: "hidden", zIndex: 1000,
            }}>
              <div style={{ background: selectedDistrict.color, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", color: "#fff" }}>
                  {selectedDistrict.name.toUpperCase()}
                </div>
                <button
                  onClick={() => setSelectedName(null)}
                  style={{ background: "rgba(0,0,0,0.2)", border: "none", color: "#fff", cursor: "pointer", fontFamily: "'Press Start 2P', monospace", fontSize: "9px", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                >✕</button>
              </div>

              <div style={{ padding: "14px" }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "7px", color: selectedDistrict.color, border: `1px solid ${selectedDistrict.color}`, display: "inline-block", padding: "3px 8px", marginBottom: "14px" }}>
                  {selectedDistrict.rekomendasi.toUpperCase()}
                </div>

                <div style={{ textAlign: "center", marginBottom: "14px", padding: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid #1a3a24" }}>
                  <div style={{ color: "#4a7a5a", fontSize: "9px", marginBottom: "4px" }}>SKOR KESESUAIAN</div>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "28px", color: selectedDistrict.color }}>
                    {selectedDistrict.skor}
                    <span style={{ fontSize: "12px", color: "#4a7a5a" }}>/100</span>
                  </div>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "7px", color: "#4a7a5a", marginBottom: "8px" }}>BREAKDOWN SKOR</div>

                  <div style={{ marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: "4px" }}>
                      <span style={{ color: "#a5d6a7" }}>👥 Kepadatan Penduduk</span>
                      <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", color: "#4caf50" }}>{selectedDistrict.skorKepadatan}</span>
                    </div>
                    <div style={{ height: "6px", background: "#1a3a24", position: "relative" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${selectedDistrict.skorKepadatan}%`, background: "#4caf50" }} />
                    </div>
                    <div style={{ fontSize: "9px", color: "#4a7a5a", marginTop: "2px" }}>{selectedDistrict.kepadatan.toLocaleString()} jiwa/km² · bobot {bobotKepadatan}%</div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: "4px" }}>
                      <span style={{ color: "#a5d6a7" }}>🛣️ Akses Jalan</span>
                      <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", color: "#8B4513" }}>{selectedDistrict.skorJalan}</span>
                    </div>
                    <div style={{ height: "6px", background: "#1a3a24", position: "relative" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${selectedDistrict.skorJalan}%`, background: "#8B4513" }} />
                    </div>
                    <div style={{ fontSize: "9px", color: "#4a7a5a", marginTop: "2px" }}>{selectedDistrict.jalan} · bobot {bobotJalan}%</div>
                  </div>
                </div>

                <div style={{ background: "#0f2417", border: "1px dashed #1a5c2e", padding: "8px 10px", fontSize: "9px", color: "#4a7a5a", fontFamily: "'JetBrains Mono', monospace" }}>
                  ({selectedDistrict.skorKepadatan}×{bobotKepadatan}% + {selectedDistrict.skorJalan}×{bobotJalan}%) = <span style={{ color: selectedDistrict.color, fontWeight: "bold" }}>{selectedDistrict.skor}</span>
                </div>
              </div>
            </div>
          )}

          {/* Status bar */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(10,26,16,0.92)", borderTop: "1px solid #1a5c2e",
            padding: "4px 12px", display: "flex", gap: "16px", fontSize: "9px", fontFamily: "'Press Start 2P', monospace", color: "#4a7a5a",
            zIndex: 1000, alignItems: "center",
          }}>
            <span style={{ color: "#4caf50" }}>● LIVE</span>
            <span style={{ color: "#a5d6a7" }}>
              {cursorCoord
                ? `${Math.abs(cursorCoord.lat).toFixed(5)}° ${cursorCoord.lat < 0 ? "S" : "N"}, ${cursorCoord.lng.toFixed(5)}° E`
                : "SORONG: 0.876° S, 131.270° E"
              }
            </span>
            <span>|</span>
            <span>ZOOM: <span style={{ color: "#4caf50" }}>{zoomLevel}</span></span>
            <span>|</span>
            <span>CRS: <span style={{ color: "#8B4513" }}>WGS84</span></span>
            <span>|</span>
            <span style={{ color: "#4caf50" }}>
              {{ satellite: "Esri Satellite", dark: "CartoDB Dark", topo: "Esri Topo" }[tileStyle]}
            </span>
            <span style={{ marginLeft: "auto" }}>BOBOT: KEP <span style={{ color: "#4caf50" }}>{bobotKepadatan}%</span> | JALAN <span style={{ color: "#8B4513" }}>{bobotJalan}%</span></span>
          </div>
        </div>
      </div>

      <style>{`
        .district-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .district-tooltip::before { display: none !important; }
        .kuliner-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .kuliner-tooltip::before { display: none !important; }
        .leaflet-control-scale-line {
          background: rgba(10,26,16,0.85) !important;
          border: 2px solid #4caf50 !important;
          border-top: none !important;
          color: #a5d6a7 !important;
          font-family: 'Press Start 2P', monospace !important;
          font-size: 8px !important;
          padding: 2px 6px !important;
        }
        .leaflet-control-attribution {
          background: rgba(10,26,16,0.8) !important;
          color: #4a7a5a !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a { color: #8B4513 !important; }
        .leaflet-pane.districtPane { pointer-events: auto; }
      `}</style>
    </div>
  );
}
