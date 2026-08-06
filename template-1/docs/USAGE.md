# Panduan Penggunaan dan Pengembangan (Project Template 1)

Dokumentasi ini menjelaskan struktur fitur inti dari sistem, mulai dari manajemen otentikasi hingga pengelolaan entitas pengguna dan departemen (unit kerja). Template ini dibangun menggunakan stack **Laravel, Inertia.js, React, dan Tailwind CSS (@headlessui/react)**.

## Daftar Isi
1. [Otentikasi (Login & NIP/Email)](#otentikasi)
2. [Dashboard & Fitur Impersonate](#dashboard--fitur-impersonate)
3. [Manajemen Peran (Role) dan Hak Akses (Permission)](#peran-dan-hak-akses)
4. [Pengguna (User)](#pengguna-user)
5. [Departemen / Unit Kerja](#departemen--unit-kerja)
6. [Panduan Pengembangan (Development)](#panduan-pengembangan)

---

### Otentikasi
Sistem otentikasi (login) pada sistem ini dirancang fleksibel untuk mendukung dua opsi pengenal utama: **Email** atau **NIP** (Nomor Induk Pegawai).

* **Konfigurasi Login**: Anda dapat mengatur apakah pengguna harus login menggunakan Email atau NIP dengan mengubah parameter di dalam `config/auth.php` (biasanya melalui `.env`). 
* NIP dalam sistem ini diformat secara khusus, misalnya `0000.00000` atau `1261.78612`.
* **Proses Login**:
  - Request akan divalidasi dan dicocokkan berdasarkan tipe yang aktif (`email` atau `nip`).
  - Apabila berhasil, sesi pengguna dibuat dan diarahkan ke Dashboard.

### Dashboard & Fitur Impersonate
Setelah login, pengguna dialihkan ke **Dashboard**.
* **Impersonate**: Fitur ini memungkinkan pengguna dengan hak akses level atas (seperti *Super Admin*) untuk "menyamar" (impersonate) sebagai pengguna lain (contoh: mencoba login sebagai perawat tanpa password perawat tersebut).
  - Tampilan indikator impersonate dibuat menggunakan *glassmorphism* modern melayang (slide-over/floating widget) di sudut kanan bawah antarmuka. 
  - Admin dapat kembali ke sesi aslinya kapan saja dengan menekan tombol batal pada widget tersebut.

### Peran dan Hak Akses
Sistem peran (Role) dan hak akses (Permission) dikelola menggunakan *package* dari **Spatie Laravel Permission**.
* **Role**: Pengelompokan hak akses (Contoh: `super-admin`, `kepala-departemen`, `perawat`).
* **Permission**: Izin spesifik untuk suatu tindakan (Contoh: `users-create`, `units-delete`, `dashboard-access`).
* **Manajemen UI**:
  - Manajemen *Permission* dilakukan melalui *Seeder* dan kode sumber langsung. Hak akses tidak dapat dikelola (Create/Update/Delete) melalui antarmuka web, ini bertujuan menjaga keamanan arsitektur sehingga permission murni terkontrol dari kode.
  - Namun, Anda tetap dapat mengalokasikan (assign) Permissions ke sebuah Role di menu **Role Management**.

### Pengguna (User)
Entitas pengguna mengelola siapa saja yang berhak masuk ke sistem.
* **Informasi Profil**: Setiap pengguna mencatat informasi Nama, Email, NIP, Avatar, serta Password.
* **Relasi Pengguna**:
  - `User` dapat memiliki banyak peran (Roles).
  - `User` dapat ditautkan ke satu atau lebih Departemen/Unit Kerja (Many-to-Many lewat *pivot table* `unit_user`).
* **UI Komponen**: Pada form pembuatan/edit pengguna, sistem menggunakan komponen dropdown interaktif bernama `SearchableSelect`.
  - Jika konfigurasi `multiple_departments` pada `config/auth.php` bernilai `true`, form ini mengizinkan Anda menautkan satu pengguna ke lebih dari satu departemen. Jika `false`, dropdown hanya berlaku single-selection.

### Departemen / Unit Kerja
Menu Departemen mencatat data kelompok unit operasional (Contoh: IGD, Rawat Inap).
* **Atribut Unit**: Setiap departemen memiliki `unit_id` (kode unit), `unit_name`, parameter jam buka/tutup (24 Jam atau terstruktur).
* **Kolaborasi Pengguna**: 
  - Pada halaman ini, Anda tidak hanya dapat melihat detail unit, melainkan juga memantau **Jumlah Pengguna** yang tertaut pada setiap departemen.
  - Terdapat fitur **Sidebar/Slide-Over** (*Kelola Pengguna*) yang dapat diakses dengan mengeklik tombol berikon "Users" biru di masing-masing baris departemen. Melalui slide-over ini, Anda dapat menghubungkan/menghapus banyak pengguna ke departemen secara massal (*bulk sync*).

---

## Panduan Pengembangan

Jika Anda adalah developer yang mengembangkan proyek ini, berikut beberapa hal penting yang perlu diketahui:

### 1. Komponen Modal Fleksibel (`Modal.jsx`)
Sistem menggunakan satu komponen pop-up sentral, yakni `resources/js/Components/Dashboard/Modal.jsx`. 
Komponen ini sangat fleksibel. Ia menerima *props* `type`:
- `type="modal"` (default): Pop-up akan muncul di tengah layar.
- `type="slide-over"`: Pop-up akan muncul melayang/slide-in dari sisi kanan layar, cocok untuk *form* sampingan atau melihat detail data panjang.

### 2. Komponen Dropdown Search (`SearchableSelect.jsx`)
Komponen `resources/js/Components/Dashboard/SearchableSelect.jsx` (berbasis `@headlessui/react`) adalah andalan sistem untuk menangani pilihan data berelasi besar (seperti memilih role atau departemen).
- Komponen ini otomatis mendukung pencarian teks (search).
- *Props* penting: `options` (berupa array objek yang harus punya `id` dan `name`), `selected` (array of ID atau single ID), dan `multiple` (boolean untuk mematikan/menyalakan fitur pemilihan banyak data).

### 3. Middleware & Keamanan Route
Sistem ini menggunakan Laravel Middleware dari Spatie untuk melindungi Route.
Sebagai contoh di `UnitController.php`, fungsi `middleware` telah ditetapkan sedemikian rupa:
```php
return [
    new Middleware('permission:units-access', only: ['index']),
    new Middleware('permission:units-create', only: ['create', 'store']),
    new Middleware('permission:units-update', only: ['edit', 'update']),
    new Middleware('permission:units-delete', only: ['destroy']),
];
```
Pastikan Anda selalu mendaftarkan/melindungi setiap *resource controller* baru dengan pola di atas.

### 4. Build Aset Frontend
Tiap kali Anda mengubah kode UI (file `.jsx` maupun CSS), selalu jalankan perintah Vite:
- **Development**: `npm run dev`
- **Production / Deployment**: `npm run build`

### 5. Seeding Data Awal
Karena permission murni dijalankan di level sistem, setiap menambahkan *permission* baru, jangan lupa untuk menulisnya di dalam `database/seeders/PermissionSeeder.php` lalu jalankan perintah:
```bash
php artisan migrate:fresh --seed
```
Ini akan memastikan Role dan Permission tertata rapi sejak awal deploy.
