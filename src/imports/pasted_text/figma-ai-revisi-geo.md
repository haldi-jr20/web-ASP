PROMPT REVISI UNTUK FIGMA AI — GeoKuliner Sorong
(Perbaikan ALUR & KONTEN, TIDAK mengubah gaya visual, layout, warna, tipografi, atau komponen yang sudah ada)

INSTRUKSI UMUM:
Pertahankan 100% gaya visual yang sudah ada (tema pixel/retro dark-green, warna hijau-hitam-oranye, tipografi monospace, struktur card, layout, header, footer). Jangan ubah desain, hanya ubah TEKS, DATA, dan KOMPONEN FUNGSIONAL agar sesuai dengan tujuan sistem yang benar: sistem rekomendasi LOKASI BARU untuk usaha kuliner (bukan analisis sebaran kuliner yang sudah ada).

Ganti semua penyebutan "Kecamatan" menjadi "Distrik" di seluruh halaman, karena Kota Sorong menggunakan istilah administratif Distrik.

---

HALAMAN 1 — BERANDA:

1. Ubah 4 angka statistik di bawah hero ("347 Titik Kuliner", "10 Kecamatan", "18 Kategori", "89% Data Terverifikasi") menjadi:
   - "10 Distrik Dianalisis"
   - "2 Kriteria Utama" (Kepadatan Penduduk & Akses Jalan)
   - "0-100 Skor Kesesuaian"
   - "100% Data Terbuka"
   Pertahankan style card, ikon, dan warna yang sama, hanya ganti angka dan labelnya.

2. Pada section "Fitur Utama" (4 kartu: Peta Interaktif, Analisis Spasial, Rekomendasi Cerdas, Eksplorasi Data), ubah menjadi 3 kartu saja dengan judul dan deskripsi baru:
   - Kartu 1: "Peta Kepadatan Penduduk" — Visualisasi choropleth kepadatan penduduk per distrik di Kota Sorong sebagai dasar analisis kesesuaian lokasi.
   - Kartu 2: "Peta Akses Jalan" — Analisis jaringan dan kelas jalan untuk menilai aksesibilitas tiap distrik.
   - Kartu 3: "Skor Kesesuaian Lokasi" — Kombinasi kepadatan penduduk dan akses jalan menghasilkan skor 0-100 untuk merekomendasikan lokasi terbaik membuka usaha kuliner.
   Pertahankan layout grid card yang sama, hanya kurangi jadi 3 kartu dan ganti kontennya.

3. Ubah section "Kawasan Kuliner Terpadat" (ranking Sorong Utara 82 titik, Sorong Manoi 71 titik, Sorong Timur 58 titik) menjadi "Distrik dengan Skor Kesesuaian Tertinggi", dengan format ranking yang sama persis (angka besar, badge nomor 1-2-3), tapi datanya diganti jadi skor kesesuaian, contoh:
   - #1 [Nama Distrik] — Skor 92/100
   - #2 [Nama Distrik] — Skor 87/100
   - #3 [Nama Distrik] — Skor 81/100
   Ganti label "titik kuliner" menjadi "skor kesesuaian".

4. Hapus section "Sajian Terbaik Sorong" (carousel foto makanan dengan rating dan harga) — section ini dihapus total karena tidak relevan dengan sistem rekomendasi lokasi.

5. Pada section preview peta "Distribusi Spasial Kuliner", ubah judul menjadi "Pratinjau Peta Kesesuaian Lokasi" dan subjudul menjadi "Visualisasi skor kesesuaian di 10 distrik Kota Sorong". Ganti isi peta dari marker kategori kuliner (Warung/Café/Seafood/Jajanan) menjadi choropleth map dengan gradasi warna merah-kuning-hijau merepresentasikan skor kesesuaian rendah-sedang-tinggi. Legenda diganti menjadi: Merah = Kurang Sesuai, Kuning = Cukup Sesuai, Hijau = Sangat Sesuai. Pertahankan bentuk peta, frame, dan compass yang sama.

---

HALAMAN 2 — DASHBOARD PETA ANALISIS:

1. Pada panel kiri "Layer Analisis" (saat ini: Hotspot Kuliner, Analisis Cluster, Kepadatan KDE, Aksesibilitas Jalan), ubah menjadi 4 layer berikut dengan style checkbox/toggle yang sama:
   - Kepadatan Penduduk
   - Jaringan Jalan
   - Titik Usaha Kuliner Eksisting
   - Zona Skor Kesesuaian

2. Tambahkan komponen baru di panel kiri (di bawah layer analisis, style dan warna mengikuti komponen yang sudah ada):
   - Slider pembobotan kriteria dengan dua label "Kepadatan Penduduk" dan "Akses Jalan" yang totalnya harus 100%
   - Dropdown "Pilih Distrik" berisi daftar 10 distrik Kota Sorong
   - Tombol "Jalankan Analisis" bergaya sama dengan tombol CTA yang sudah ada di halaman lain (hijau solid dengan border)

3. Ubah section "Legenda" (saat ini: Warung Makan, Seafood, Café, Jajanan/Minuman, Bakso/Sate) menjadi legenda skor kesesuaian:
   - Merah = Kurang Sesuai (skor 0-50)
   - Kuning = Cukup Sesuai (skor 50-75)
   - Hijau = Sangat Sesuai (skor 75-100)
   Pertahankan bentuk bullet warna bulat yang sama.

4. Ubah search bar dan dua dropdown filter di kanan atas ("Cari kuliner...", "Semua", "Semua") menjadi "Cari distrik...", dropdown "Semua Distrik", dan dropdown "Semua Skor" (filter rentang skor kesesuaian).

5. Ubah counter "29 titik" menjadi menampilkan jumlah distrik teranalisis, misal "10 distrik".

6. Section "Statistik" di panel kiri bawah (Total Titik, Kecamatan) ubah label "Kecamatan" jadi "Distrik", dan "Total Titik" jadi "Distrik Dianalisis".

7. Saat marker/area di peta diklik, popup yang muncul harus menampilkan: Nama Distrik, Kepadatan Penduduk (jiwa/km²), Kelas Jalan Terdekat, Skor Kesesuaian (0-100), dan label Rekomendasi (Sangat Direkomendasikan/Direkomendasikan/Tidak Direkomendasikan). Style popup mengikuti komponen card yang sudah ada di desain.

---

HALAMAN 3 — HASIL & REKOMENDASI:

1. Ubah 4 kartu statistik di atas (Moran's I Index, Hotspot Signifikan, Rata-rata Rating, Tingkat Pertumbuhan) menjadi:
   - "Distrik Teranalisis" — jumlah total distrik
   - "Skor Tertinggi" — nilai skor kesesuaian tertinggi se-Kota Sorong
   - "Skor Rata-rata Kota" — rata-rata skor seluruh distrik
   - "Distrik Sangat Direkomendasikan" — jumlah distrik dengan skor di atas 75
   Pertahankan style card yang sama.

2. Ubah bar chart "Distribusi per Kecamatan" menjadi "Skor Kesesuaian per Distrik", sumbu Y diganti dari jumlah titik kuliner menjadi skor 0-100, data diurutkan dari skor tertinggi ke terendah, sumbu X tetap nama-nama distrik.

3. Hapus donut chart "Komposisi Kategori" (Warung Makan/Seafood/Café/Jajanan/Bakso/Lainnya) — tidak relevan, hapus section ini beserta card-nya.

4. Ubah tabel "Hasil Analisis Cluster Spasial" (kolom: Cluster, Nama Kawasan, Titik Kuliner, Density, Avg Rating, Pertumbuhan) menjadi tabel ranking distrik dengan kolom baru:
   - Nama Distrik
   - Kepadatan Penduduk (jiwa/km²)
   - Kelas Akses Jalan
   - Skor Kesesuaian (0-100)
   - Rekomendasi (badge: Sangat Direkomendasikan/Direkomendasikan/Tidak Direkomendasikan)
   Pertahankan style tabel, warna header, dan badge warna yang sama, hanya ganti data dan label kolom.

5. Pada radar chart "Indeks Performa Kuliner" (sumbu: Kepadatan, Rating, Aksesibilitas, Jam Operasi, Variasi Menu, Potensi Tumbuh), ganti jadi radar dengan 2 sumbu saja: "Kepadatan Penduduk" dan "Akses Jalan", menunjukkan kontribusi masing-masing kriteria terhadap skor distrik terpilih. Atau jika radar chart butuh minimal lebih dari 2 sumbu untuk terlihat baik, bisa ditambah sumbu turunan seperti "Skor Gabungan", "Peringkat Distrik" — sesuaikan dengan kapasitas desain, tapi hilangkan sumbu yang berkaitan dengan rating/menu kuliner.

6. Ubah section "Temuan Kunci" — ganti isi poin-poin dari temuan pola distribusi kuliner (Moran's I, pertumbuhan seafood, ketimpangan Sorong Utara vs pinggiran) menjadi temuan terkait skor kesesuaian, contoh:
   - Distrik dengan skor tertinggi memiliki kombinasi kepadatan penduduk tinggi dan akses jalan kelas I/II.
   - Beberapa distrik pinggiran memiliki akses jalan terbatas sehingga skor kesesuaian rendah meski kepadatan penduduk cukup.
   - Bobot kriteria memengaruhi hasil ranking signifikan — user disarankan mencoba beberapa skenario bobot.
   Pertahankan style card dan ikon checklist/warning yang sama.

7. Ubah 4 kartu "Rekomendasi Berbasis Data" (Pengembangan Kawasan Terpadu, Pengembangan Kuliner Seafood, Penataan PKL, Dukungan UMKM) menjadi rekomendasi lokasi spesifik, contoh:
   - Kartu 1 (Prioritas Utama): "[Nama Distrik] — Lokasi Terbaik" — Skor kesesuaian tertinggi karena kepadatan penduduk tinggi dan akses jalan sangat baik. Rekomendasi utama untuk membuka usaha kuliner baru.
   - Kartu 2 (Alternatif): "[Nama Distrik] — Potensi Berkembang" — Kepadatan penduduk tinggi namun akses jalan perlu perbaikan.
   - Kartu 3 (Pertimbangan): "[Nama Distrik] — Akses Jalan Unggul" — Akses jalan sangat baik meski kepadatan penduduk sedang.
   - Kartu 4 (Kurang Disarankan): "[Nama Distrik] — Perlu Kajian Lanjutan" — Skor rendah pada kedua kriteria, kurang ideal untuk usaha kuliner baru saat ini.
   Pertahankan style badge kategori, warna border, dan layout card yang sama.

8. Pertahankan tombol export PDF/Excel tanpa perubahan.

---

HALAMAN 4 — TENTANG / METODOLOGI:

1. Pada section "Metodologi Penelitian" (4 tahap: Pengumpulan Data, Persiapan & Validasi Data, Analisis Spasial GIS, Visualisasi & Interpretasi), pertahankan struktur 4 tahap dan style card yang sama, tapi ubah isi poin-poin di Tahap 3 "Analisis Spasial GIS":
   Dari: Kernel Density Estimation (KDE), Spatial Autocorrelation (Moran's I), K-means Clustering Spasial, Hotspot Analysis (Getis-Ord Gi*), Network Analysis (aksesibilitas jalan)
   Menjadi: Normalisasi data kepadatan penduduk dan akses jalan (min-max scaling), Pembobotan kriteria (weighted overlay), Perhitungan skor kesesuaian gabungan, Klasifikasi skor ke 3 kelas (kurang/cukup/sangat sesuai), Analisis buffer/jarak jaringan jalan

2. Tambahkan penjelasan singkat formula overlay scoring di section ini atau di section baru dengan style yang sama seperti card lainnya:
   "Skor Kesesuaian = (Kepadatan Penduduk Ternormalisasi x Bobot Kepadatan) + (Akses Jalan Ternormalisasi x Bobot Akses Jalan)"

3. Pada section "Perangkat & Teknologi", pertahankan seluruh kartu apa adanya (QGIS, Python, PostgreSQL/PostGIS, React+Recharts, OpenStreetMap, GDAL/OGR) — tidak perlu diubah, semua masih relevan untuk sistem baru.

4. Pada section "Sumber Data" (tabel BPS, Dinas Perindag, OpenStreetMap, Survey Lapangan, Google Places, Citra Satelit), pertahankan seluruh baris, hanya ubah baris "Survey Lapangan 2024" volume datanya dari "347 titik" (data kuliner eksisting) menjadi jumlah data distrik/jalan yang relevan untuk sistem kesesuaian lokasi, dan hapus baris "Google Places API" jika tidak lagi relevan (karena rating/ulasan kuliner bukan bagian dari skor kesesuaian), atau tetap pertahankan sebagai data pendukung opsional untuk menampilkan titik kuliner eksisting di peta.

5. Section "Tim Peneliti" dan "Sitasi & Referensi" — pertahankan apa adanya, tidak perlu diubah.

---

CATATAN AKHIR:
- Semua perubahan di atas adalah perubahan TEKS, DATA, LABEL, dan PENAMBAHAN KOMPONEN FUNGSIONAL (slider, dropdown, tombol) yang mengikuti style system yang sudah ada di desain (warna hijau-hitam-oranye, border pixel, tipografi monospace, ukuran card, radius, spacing).
- JANGAN mengubah palet warna, font, ukuran header/footer, atau struktur navigasi yang sudah ada.
- JANGAN menambahkan halaman baru — tetap 4 halaman: Beranda, Peta Analisis, Hasil & Rekomendasi, Tentang.
- Ganti semua kata "Kecamatan" menjadi "Distrik" di seluruh halaman termasuk header, footer, dan komponen kecil sekalipun.