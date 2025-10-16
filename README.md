# Fanatic 1 Website

Situs mini bertema Formula 1 dengan empat halaman utama:
**Home**, **Classification**, **Comparison**, dan **Quiz**.

- Live: https://yas-man.github.io/Fanatic-1-Website/

## Fitur

- **Home**: Hero video + CTA menuju halaman fitur utama.
- **Classification**: Daftar tim/mobil F1 yang dirender dari data lokal.
- **Comparison**: Pilih 2 mobil, tampilkan perbandingan statistik secara instan.
- **Quiz**: Kuis pilihan ganda bertema F1 dengan skor dan progres.

## Teknologi
- **HTML + CSS + JavaScript murni** (tanpa framework)
- **Data lokal** via `data.js` (array objek untuk mobil, tim, dan pertanyaan kuis)
- **DOM manipulation** di `script.js` untuk render, event, dan logika fitur

## Struktur Proyek
## Cara Menjalankan Lokal
1. Clone/Download repo ini.
2. Buka `index.html` langsung di browser, atau gunakan ekstensi *Live Server* (VS Code).
3. Pastikan `style.css`, `script.js`, dan `data.js` ada di root yang sama (atau sesuaikan path pada `<link>`/`<script>`).

## Cara Kerja (Arsitektur Singkat)

- **data.js**  
  Menyimpan array objek, misalnya:
  - `teams` / `cars`: { id, nama, tim, tahun, spesifikasi... }
  - `questions`: { question, options[], answerIndex }
  File ini menjadi **satu-satunya sumber data** (tanpa API/Server).

- **script.js**  
  Mengikat event di `DOMContentLoaded`, lalu:
  - **Classification**: membaca data dari `data.js`, membangun elemen kartu/list dengan `document.createElement`, lalu menyuntikkan ke container.
  - **Comparison**: mengisi dropdown dari data, menyimpan pilihan pengguna (id mobil 1 & 2), menghitung perbandingan (mis. power/top speed/weight), dan menulis hasil ke elemen hasil.
  - **Quiz**: mengambil pertanyaan berdasarkan indeks saat ini, merender opsi jawaban sebagai tombol/list item, menangani klik jawaban, memperbarui skor, dan melanjutkan ke pertanyaan berikutnya.

- **style.css**  
  Mengatur layout, tipografi, grid kartu, dan elemen interaktif dasar (hover/transition).

## Menambah Data/Item Baru

- **Tambah mobil/tim**: edit `data.js`, masukkan objek baru ke array yang sesuai. UI akan menyesuaikan saat halaman dimuat.
- **Tambah pertanyaan kuis**: tambahkan objek ke array `questions`. Pastikan `answerIndex` sesuai urutan `options`.

## Aksesibilitas & UX (Catatan)
- Tambahkan teks alternatif untuk gambar/video.
- Pastikan fokus keyboard pada elemen penting (tombol jawaban kuis, dropdown comparison).
- Pertimbangkan *active state* pada menu navigasi.

## Pengembangan Lanjutan (Roadmap Saran)
- Pencarian/Filter lanjutan di **Classification** (berdasarkan tim, tahun, spesifikasi).
- Highlight visual di **Comparison** (mis. bar/indikator untuk nilai yang unggul).
- Penyimpanan skor kuis di `localStorage`.
- Halaman **404** untuk navigasi yang lebih rapi di GitHub Pages.

## Lisensi
Bebas digunakan untuk pembelajaran. Cek aset (logo/gambar) jika mengambil dari pihak ketiga.
