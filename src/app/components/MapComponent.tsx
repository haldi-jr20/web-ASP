export default function MapComponent() {
  return (
    <div style={{ width: '100%', height: '500px', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
      <iframe
        src="/qgis/index.html"
        title="Peta Kuliner Kota Sorong"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
        }}
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}
