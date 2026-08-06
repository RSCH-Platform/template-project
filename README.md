# RSCH Templates Repository

Repository ini merupakan kumpulan berbagai *template* proyek (awalan/boilerplate) yang digunakan dalam lingkungan RSCH. Tiap folder (seperti `template-1`) mewakili satu arsitektur / sistem utuh yang siap digunakan, dikembangkan, atau didistribusikan secara mandiri.

## Struktur Direktori
- `template-1/`: Sistem Informasi Dashboard modern berbasis **Laravel 13, React (Inertia.js), dan Tailwind CSS**. Sudah dilengkapi dengan modul autentikasi (NIP/Email), manajemen Role/Permission (Spatie ACL), dan relasi Pengguna & Departemen (Unit Kerja). Memiliki dokumentasi lebih rinci di dalam folder `docs/USAGE.md` masing-masing *template*.

## Penggunaan
Untuk mulai menggunakan salah satu *template*, Anda cukup masuk ke direktori *template* yang dituju dan mengikuti instruksi yang ada di file `README.md` di dalamnya.

```bash
cd template-1
cp .env.example .env
composer install
npm install
# dst...
```

## Kontribusi & Penambahan Template
Jika Anda menambahkan *template* baru (`template-2`, `template-3`, dst.), mohon:
1. Pastikan setiap *template* memiliki `README.md` dan `.gitignore` independennya sendiri di dalamnya.
2. Jelaskan peruntukan *template* tersebut secara ringkas di daftar "Struktur Direktori" pada file ini.
