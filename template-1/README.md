# Enterprise Dashboard Management System (Template 1)

Sistem Informasi Dashboard interaktif berskala *Enterprise* yang dikembangkan menggunakan **Laravel 11**, **React**, **Inertia.js v2.0**, dan **Tailwind CSS**. Template ini tidak hanya menyediakan fitur *boiler-plate* standar, melainkan sebuah pondasi arsitektur kokoh yang sangat siap untuk skalabilitas (*Layered Architecture*) dan performa tinggi.

## 🚀 Fitur Unggulan & Optimasi
- **Arsitektur Berlapis (Layered Architecture)**: Pemisahan tegas antara logika HTTP (*Thin Controller*), Logika Bisnis (*Services*), Data (*Models*), dan *Side-effects* (*Observers*).
- **Performa Responsif ala Livewire**: Integrasi *Ajax/Axios* untuk aksi *update* dan manipulasi data yang kompleks (seperti fitur penetapan pengguna ke unit kerja) tanpa perlu memuat ulang keseluruhan halaman (tanpa `full-page reload`).
- **Lazy Loading Cerdas (Inertia Deferred Props)**: Metrik berat (misalnya grafik, kalkulasi statistik) tidak memblokir render UI awal. Halaman muncul seketika, dan data yang tertunda akan dimuat secara *background*.
- **Pencarian & Filter Tingkat Lanjut**: Penggunaan **Spatie QueryBuilder** di *backend* memungkinkan Anda mengaktifkan fitur pencarian, filter, dan pengurutan tabel hanya dengan satu baris kode, terhubung langsung dengan *pagination* reaktif di React.
- **Autentikasi Fleksibel & Impersonasi**: Mendukung *login* ganda (Email/NIP) yang dapat dikonfigurasi melalui `.env`, serta kapabilitas *Super Admin* untuk masuk (*impersonate*) ke akun bawahan dengan aman.
- **Role-Based Access Control (RBAC) Ketat**: Terlindungi penuh oleh *Spatie Laravel Permission* dan `HasMiddleware`, tidak ada rute manajemen yang terbuka tanpa pengawasan sistem hak akses.

## 🛠️ Spesifikasi Teknologi (*Tech Stack*)
- **Backend**: Laravel 11, PHP 8.2+, Spatie QueryBuilder, Spatie Permission, API Resources (JsonResource).
- **Frontend**: React 18, Inertia.js 2.0, Vite, Axios, Zustand (State Management), Day.js.
- **UI & Styling**: Tailwind CSS v3, Headless UI, Tabler Icons, Chart.js.
- **Database**: SQLite (Development) / MySQL / PostgreSQL (Production).

## 📦 Panduan Instalasi Cepat

1. **Unduh repositori** dan masuk ke direktorinya:
   ```bash
   git clone <repo-url>
   cd <project-folder>
   ```

2. **Instal seluruh paket (Backend & Frontend)**:
   ```bash
   composer install
   npm install
   ```

3. **Konfigurasi Lingkungan (*Environment*)**:
   Salin `.env.example` ke `.env` lalu sesuaikan kredensial *database* Anda.
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Siapkan Basis Data & Pengguna Awal**:
   *Command* ini sangat krusial untuk memastikan seluruh entitas Hak Akses (Role/Permission) dan Administrator terbentuk secara otomatis.
   ```bash
   php artisan migrate:fresh --seed
   ```

5. **Kompilasi Aset (*Frontend*)**:
   ```bash
   # Development Server (Hot Reload)
   npm run dev
   
   # Production Build
   npm run build
   ```

6. **Jalankan Aplikasi (*Backend*)**:
   ```bash
   php artisan serve
   ```
   Aplikasi siap diakses di `http://127.0.0.1:8000`.

## 📖 Dokumentasi Lengkap & Standar Penulisan Kode (SOP)
Template ini memiliki **aturan dan standar arsitektur** yang ketat agar aplikasi Anda kelak tidak menjadi kode yang kotor (*spaghetti code*). 
Sangat disarankan bagi setiap pengembang yang terlibat dalam repositori ini untuk membaca buku panduan utama di **[docs/USAGE.md](docs/USAGE.md)** sebelum menambahkan atau memodifikasi fitur.

---
© 2026 - Template Project Management
