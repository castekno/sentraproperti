# Ringkasan Konteks Percakapan — Sentra Properti

Gunakan file ini di **percakapan baru** (upload atau tempel isinya) agar asisten langsung memahami arsitektur aplikasi, konfigurasi database, perubahan yang sudah dilakukan, serta batasan yang harus dijaga.

---

## 1. Profil & Arsitektur Aplikasi

- **Nama Aplikasi:** Sentra Properti (Katalog Properti)
- **Domain Produksi:** `https://sentraproperti.my.id/`
- **Alur Deployment:** Kode disimpan di **GitHub** $\rightarrow$ di-build & di-host oleh **Vercel** $\rightarrow$ diakses melalui domain `sentraproperti.my.id`.
- **Stack Teknologi:** React 19, Vite, TypeScript, Tailwind CSS, Firebase Firestore, Vercel Serverless Functions (`api/`).

---

## 2. Konfigurasi Firebase & Database

- **Firebase Project ID:** `sentrapropertidb`
- **Firestore Database ID:** `spdb` *(PENTING: Jangan gunakan `(default)`, selalu gunakan `spdb`)*
- **Koleksi Utama:**
  - `dbproperti` — Menyimpan data masing-masing proyek sebagai dokumen terpisah (`dbproperti/<projectId>`). Dokumen `dbproperti/Database` adalah dokumen ringkasan/legacy.
  - `dbcities` — Menyimpan daftar kota wilayah.
  - `dbdocumentation` — Menyimpan foto dokumentasi kegiatan.
- **Konfigurasi Klien:** `firebase-applet-config.json` & `src/lib/firebase.ts` (sudah mengaktifkan `persistentLocalCache` dengan `persistentMultipleTabManager` untuk menghemat kuota baca Firebase).

---

## 3. Catatan & Keputusan Teknis yang Sudah Dibahas

### A. Error Batas Ukuran Dokumen 1 MB (`dbproperti/Database`)
- **Gejala:** Peringatan di console:
  `Master document update note (exceeded single doc limit, individual docs used): Document '.../dbproperti/Database' cannot be written because its size (4,945,077 bytes) exceeds 1,048,576 bytes.`
- **Penjelasan & Status:**
  - Firestore membatasi ukuran maksimal **1 dokumen adalah 1 MB (1.048.576 bytes)**.
  - Sistem aplikasi (`src/services/storageService.ts`) **tetap aman** karena data proyek utama disimpan ke dokumen masing-masing (`dbproperti/<projectId>`), bukan bergantung pada dokumen gabungan `Database`.
  - Peringatan tersebut ditangani dengan `try-catch` (`console.warn`) sehingga CRUD (tambah, edit, hapus) tetap berjalan normal.

### B. Pemisahan Field Proyek (`Nama Project` & `Lokasi`)
- Field `Nama Project Perumahan` dan `Lokasi` (`project.location`) sudah dipisahkan menjadi 2 field berbeda pada form CRUD (`src/components/AdminProjectModal.tsx`).
- Nilai `Lokasi` ditampilkan di atas nama kota pada foto utama proyek.

### C. Sistem Sitemap Otomatis untuk Google Search Console
Aplikasi sudah dilengkapi sistem sitemap dinamis yang terintegrasi dengan Vercel & Firestore **tanpa menambah tombol baru di UI**:
1. **`api/sitemap.ts` (Vercel Serverless Function):**
   - Membaca daftar proyek aktif langsung dari Firestore (`sentrapropertidb`, database `spdb`, koleksi `dbproperti`), mengabaikan dokumen metadata (`Database`, `cities_metadata`, `cities_master`).
   - Menghasilkan XML format `sitemaps.org/schemas/sitemap/0.9` berisi URL beranda (`priority: 1.0`, `changefreq: daily`) dan seluruh URL proyek (`https://sentraproperti.my.id/?proyek=<slug>`, `priority: 0.9`, `changefreq: weekly`).
   - Otomatis bertambah saat ada proyek baru dan otomatis hilang saat ada proyek dihapus tanpa perlu edit file GitHub secara manual.
   - Dilengkapi header proteksi kuota baca Firestore via Vercel CDN Edge Cache:
     `Cache-Control: s-maxage=3600, stale-while-revalidate=86400`
     *(Maksimal 1x pembacaan koleksi ke Firestore per 1 jam meskipun diakses berkali-kali; sangat hemat dibanding batas gratis 50.000 reads/hari).*
2. **`vercel.json`:**
   - Mengarahkan `/sitemap.xml` ke `/api/sitemap`.
   - Fallback SPA `/(.*)` ke `/index.html`.
3. **`public/sitemap.xml`:**
   - File statis cadangan awal berisi 1 URL beranda + 21 URL proyek.
4. **Deep Linking Parameter `?proyek=` (`src/utils/slug.ts` & `src/App.tsx`):**
   - Membuka tautan `https://sentraproperti.my.id/?proyek=<slug>` langsung membuka modal detail proyek terkait secara otomatis.
   - Mengklik kartu proyek memperbarui URL browser menjadi `?proyek=<slug>` via `window.history.replaceState`, dan menutup modal mengembalikan URL ke pathname asal.

---

## 4. Aturan & Preferensi Kerja User (Wajib Dipatuhi)

1. **Jangan mengubah coding atau tampilan asli** kecuali diminta secara eksplisit.
2. **Jangan menambahkan tombol baru** di antarmuka aplikasi tanpa persetujuan user.
3. **Database Firestore wajib menggunakan ID `spdb`**.
4. **Hemat kuota baca (reads) Firebase** pada setiap fitur baru yang berinteraksi dengan Firestore.
5. **Bahasa komunikasi:** Gunakan Bahasa Indonesia yang jelas, ringkas, dan terstruktur.

---

## 5. Cara Menggunakan di Percakapan Baru

Lampirkan atau tempel isi file ini pada pesan pertama di percakapan baru, lalu lanjutkan dengan instruksi Anda, misalnya:

> *"Ini adalah ringkasan konteks proyek Sentra Properti dari percakapan sebelumnya. Mohon pelajari konteks, arsitektur, dan aturan di file ini sebelum menjawab pertanyaan/permintaan saya berikutnya: [tulis permintaan Anda di sini]."*
