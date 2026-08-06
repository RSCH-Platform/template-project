# Dashboard Management System

Sistem Informasi Dashboard interaktif yang dikembangkan menggunakan **Laravel 13**, **React**, **Inertia.js**, dan **Tailwind CSS**. Sistem ini memfasilitasi pengelolaan entitas sentral seperti Pengguna (User), Group Akses (Role & Permission), hingga Unit Kerja (Departemen).

## 🚀 Fitur Utama
- **Autentikasi Dinamis**: Login menggunakan Email atau NIP (dapat diubah konfigurasinya).
- **Manajemen Hak Akses Bawaan (ACL)**: Berbasis `spatie/laravel-permission` yang tangguh dan terpusat pada kode (Seeder).
- **Impersonasi Akun (Super Admin)**: Memungkinkan admin level tinggi untuk masuk sebagai pengguna lain secara aman tanpa *password* mereka, menggunakan antarmuka modern yang melayang.
- **Relasi Kompleks Unit & Pengguna**: Dukungan relasi *many-to-many* antara pengguna dan departemen, disempurnakan dengan *searchable UI* dan kelola *bulk* via panel khusus.
- **UI Responsif & Modern**: Dirancang menggunakan *Tailwind CSS* & *Headless UI*, lengkap dengan mode tampilan (List & Grid) dan dukungan tema (Light/Dark Mode).

## 🛠️ Tech Stack
- **Backend**: Laravel 13, PHP 8.3+
- **Frontend**: React 18, Inertia.js, Vite
- **Styling**: Tailwind CSS v3, Headless UI, Tabler Icons
- **Database**: SQLite (Development) / MySQL / PostgreSQL (Production)

## 📦 Instalasi

1. **Clone repository ini** (jika menggunakan git) atau extract file ke folder server lokal Anda.
   ```bash
   git clone <repo-url>
   cd <project-folder>
   ```

2. **Instal dependensi Backend & Frontend**
   ```bash
   composer install
   npm install
   ```

3. **Konfigurasi Environment**
   Salin file `.env.example` menjadi `.env`, dan sesuaikan konfigurasi *database* Anda.
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Jalankan Migrasi & Seeder**
   Sangat penting untuk menjalankan migrasi dan *seeder* agar semua Role (Group Akses) dan Permission tercipta di *database*.
   ```bash
   php artisan migrate:fresh --seed
   ```

5. **Kompilasi Aset Frontend**
   Untuk *development*, jalankan *Vite server*. Untuk *production*, jalankan perintah *build*.
   ```bash
   npm run dev
   # ATAU untuk production
   npm run build
   ```

6. **Jalankan Server Laravel**
   ```bash
   php artisan serve
   ```
   Akses aplikasi pada `http://127.0.0.1:8000`.

## 📖 Dokumentasi Lengkap
Untuk panduan penggunaan fitur yang lebih detail (Cara manajemen Role, setting konfigurasi NIP/Email, dan komponen *reusable*), silakan baca file **[USAGE.md](docs/USAGE.md)** yang ada di dalam folder `docs/`.

## 👥 Kontribusi
Proyek ini adalah *template/boilerplate* tertutup. Untuk melakukan perubahan sistemik, pastikan mengikuti panduan pengembangan yang tertera pada *USAGE.md* untuk menjaga *codebase* tetap bersih.

---
© 2026 - Template Project Management
