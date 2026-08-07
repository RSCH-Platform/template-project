# Buku Panduan Pengembang (Technical Playbook)

Dokumen ini adalah standar operasi (*SOP*) wajib bagi pengembang (*developer*) yang akan memodifikasi atau menambah fitur baru di dalam sistem. Aplikasi ini dirancang tidak hanya untuk berfungsi, melainkan untuk memiliki arsitektur jangka panjang yang bebas dari "kode spageti" serta performa *UI* layaknya sebuah aplikasi *Single Page Application* (SPA) mutakhir.

## Daftar Isi
1. [Arsitektur Berlapis (Layered Architecture)](#1-arsitektur-berlapis-layered-architecture)
2. [Sistem Pencarian & Filter Cerdas](#2-sistem-pencarian--filter-cerdas-spatie-querybuilder)
3. [Keamanan & API Resource](#3-keamanan-data--api-resource)
4. [Optimasi Performa UI (Inertia & Axios)](#4-optimasi-performa-ui)
5. [Komponen-komponen UI Siap Pakai](#5-komponen-ui-siap-pakai)

---

## 1. Arsitektur Berlapis (Layered Architecture)
Sistem ini dengan sengaja tidak membebankan interaksi basis data pada tingkat `Controller`. Seluruh alur (*flow*) data harus mematuhi hierarki berikut:

* **Controller** (`app/Http/Controllers`): Hanyalah pintu masuk untuk HTTP *Request*. Ia bertanggung jawab memanggil validasi (Form Request), memanggil `Service` untuk memproses logika, dan merender tampilan (`Inertia::render` atau `response()->json()`).
  > **❌ JANGAN** menuliskan `$user->update()` atau logika bisnis lain secara langsung di Controller.
* **Service** (`app/Services`): Berisi seluruh logika bisnis aplikasi. Misalnya pembuatan akun baru dengan proses penyimpanan *file avatar*, hingga melampirkan (*attach*) relasi `Roles` & `Units`, semuanya harus dilakukan di kelas *Service* (`UserService.php`).
* **Model** (`app/Models`): Hanyalah representasi data dan pendefinisian relasi (`belongsTo`, `hasMany`).
* **Observer** (`app/Observers`): Penjaga aktivitas *side-effects*. Misalnya, ketika akun *User* dihapus secara massal (*bulk delete*), `UserObserver` mendeteksinya lalu secara otomatis membersihkan sisa *file avatar* dari *server*. Selalu daftarkan observer Anda menggunakan fitur `#[ObservedBy(ModelObserver::class)]` (standar Laravel 11).

## 2. Sistem Pencarian & Filter Cerdas (Spatie QueryBuilder)
Mengembangkan fitur pencarian, filter bersarang, dan pengurutan (Sort) **TIDAK PERLU** lagi di-_hardcode_ satu per satu menggunakan klausa *If-Else* di Controller.

**Aturan Penulisan:**
Gunakan *package* `Spatie\QueryBuilder` dengan struktur seperti berikut di *method* `index`:
```php
$query = QueryBuilder::for(User::class)
    ->allowedFilters('name', 'email', 'nip') // Izinkan pencarian URL ?filter[name]=Budi
    ->allowedSorts('name', 'created_at')     // Izinkan pengurutan URL ?sort=-created_at
    ->allowedIncludes('roles', 'units');     // Izinkan relasi URL ?include=roles
```
Di UI (React), komponen `<Search />` dan `<Table.Th />` akan secara otomatis mengirimkan struktur kueri ini melalui `router.get` dengan fitur `preserveState: true` agar antarmuka tidak *refresh*.

## 3. Keamanan Data & API Resource
Untuk mencegah insiden kebocoran data (seperti `password_hash` atau parameter konfidensial terlempar ke *frontend* JSON), **DILARANG** melempar `$model->get()` secara langsung ke fungsi `Inertia::render()`.

**Aturan:**
Gunakan `JsonResource` (`app/Http/Resources`).
```php
// ❌ SALAH (Beresiko)
return Inertia::render('Users/Index', ['users' => User::paginate()]);

// ✅ BENAR (Aman & Ringan)
return Inertia::render('Users/Index', [
    'users' => UserResource::collection(User::paginate())
]);
```
Catatan Penting: Saat merender dari *Resource Collection*, data *pagination* akan selalu dibungkus di dalam struktur atribut `data` dan `meta`. Di komponen React Anda (contoh `<Pagination />`), gunakan objek `meta` (`users.meta`) untuk merender bilah nomor halaman.

## 4. Optimasi Performa UI
Untuk membuat aplikasi ini terasa "terbang", Anda wajib memperhatikan tiga metode pemuatan (*loading*):

### A. Lazy Loading & Inertia Deferred Props
Bila suatu halaman memiliki metrik penghitungan statistik (seperti `User::count()`) atau *query chart* grafis, data tersebut harus dimuat di-belakang-layar setelah *layout* utamanya muncul.
```php
// Di Controller:
'super_admin_data' => Inertia::defer(fn() => [
    'total_users' => User::count()
])
```
```jsx
// Di React (menggunakan tag <Deferred>):
<Deferred data={['super_admin_data']} fallback={<div>Loading...</div>}>
    <SuperAdminDashboard />
</Deferred>
```

### B. In-Place Updates (Axios) vs Full Render
Ketika pengguna mengeklik **Submit Form**, jika itu adalah operasi sederhana penciptaan entri baru, gunakan `useForm()` bawaan *Inertia*.
Namun, bila fiturnya adalah komponen interaktif modular (seperti menambah pengguna dari *sidebar* ke dalam sebuah *Department* tanpa meninggalkan tabel `Unit`), gunakan `axios` yang merespon *JSON message* saja ketimbang `router.post()` yang akan memuat ulang (mengunduh ulang props) keseluruhan baris *Unit* lain di layar.
```jsx
// Aksi 'Livewire-like' di React:
axios.post(route('units.users.sync', unitId), { user_ids })
    .then(res => {
        // Manipulasi state internal secara instan
        // Menampilkan pesan sukses lokal
    });
```
*Pastikan Backend merespons `wantsJson()` dengan baik untuk melayani *requests* sejenis ini.*

## 5. Komponen UI Siap Pakai
Terdapat puluhan komponen pra-desain bergaya *modern glassmorphism*, *vibrant colors*, dan ramah *micro-animations* yang berlokasi di `resources/js/Components/Dashboard`.
* **`Modal.jsx`**: Mendukung dua tipe, *Center Modal* standar (`type="modal"`) dan panel sisipan kanan (`type="slide-over"`).
* **`SearchableSelect.jsx`**: Elemen *dropdown* multifungsi yang berbasis pustaka `Headless UI`, membebaskan Anda dari belenggu elemen HTML standar `<select>` yang kuno. Mendukung fitur pencarian dan multiseleksi tak terbatas (*many-to-many*).

---

> Selalu lindungi Controller Anda menggunakan atribut antarmuka `HasMiddleware` dan membatasi akses berdasarkan *permission* (misal: `permission:users-create`). Jangan pernah abaikan celah keamanan (Security Vulnerability) terkait ketiadaan pengaman rute!
