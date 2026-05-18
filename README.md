# 📦 Sistem Pemesanan & Pemantauan Bahan Ajar - Universitas Terbuka

[![Vue.js Version](https://img.shields.io/badge/Vue.js-2.x_CDN-4fc08d?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

Aplikasi Web **Sistem Pemesanan Bahan Ajar UT** adalah proyek interaktif berbasis *Client-Side* yang dibangun untuk memenuhi tugas praktikum mata kuliah **Pemrograman Berbasis Website** di Universitas Terbuka. 

Tujuan utama dari proyek ini adalah mengimplementasikan konsep sistem pengorganisasian kode menggunakan framework **Vue.js (v2)** guna membangun antarmuka pengguna (UI) yang reaktif, dinamis, dan interaktif tanpa ketergantungan pada *database* eksternal atau *build tools* yang kompleks.

---

## 🚀 Fitur Utama

Aplikasi ini dirancang dengan arsitektur SPA (*Single Page-like behavior* per modul) yang mencakup fitur-fitur berikut:

1. **Dashboard / Beranda (`index.html`)**: Menu navigasi utama, ringkasan fitur, informasi teknologi, serta deskripsi proyek.
2. **Manajemen Stok Bahan Ajar (`stok.html`)**:
   * **Dependent Filter & Sorting**: Penyaringan data berdasarkan UT-Daerah (UPBJJ) dan Kategori yang adaptif, serta pengurutan (*sorting*) berdasarkan Judul, Harga, dan Jumlah Stok.
   * **Manajemen Stok Aktif**: Fitur deteksi kondisi stok otomatis (🟢 Aman, 🟡 Menipis, 🔴 Kosong) menggunakan *Vue Computed Properties*.
   * **Form Validasi Entri & Operasi CRUD (Simulasi)**: Tambah data baru dan edit data berbasis modal interaktif lengkap dengan *client-side validation* (mencegah duplikasi kode MK, nilai negatif, atau input kosong).
3. **Pelacakan Pengiriman / Tracking DO (`tracking.html`)**:
   * **Auto-Generated Order Number**: Pembuatan nomor *Delivery Order* (DO) otomatis berdasarkan kombinasi tahun berjalan dan urutan sekuensial.
   * **Reactive Form & Watchers**: Penghitungan total harga otomatis saat paket bahan ajar dipilih menggunakan *Vue Watchers*.
   * **Timeline Perjalanan Interaktif**: Fitur *expand/collapse* untuk memantau detail riwayat logistik pengiriman paket mahasiswa secara *real-time* (data dummy).

---

## 🛠️ Teknologi yang Digunakan

* **Core Framework**: Vue.js v2.x (via Content Delivery Network - CDN)
* **Markup & Styling**: HTML5 & CSS3 (Menggunakan variabel CSS `:root`, Grid Layout, Flexbox, dan font *Plus Jakarta Sans* & *JetBrains Mono*)
* **Scripting**: JavaScript Modern (ES6+)
* **Data Source**: In-Memory JavaScript Object / Array (Tanpa Database/API eksternal, cocok untuk simulasi pembelajaran)

---

## 📂 Struktur Direktori Proyek

```text
.
├── assets/
│   └── Logo UT (1).png       # Aset logo universitas
├── css/
│   └── style.css             # Desain utilitas, komponen, modal, dan tata letak global
├── js/
│   ├── stok-app.js           # Logika bisnis Vue.js untuk modul Stok Bahan Ajar
│   └── tracking-app.js       # Logika bisnis Vue.js untuk modul Tracking DO
├── index.html                # Halaman Beranda / Landing Page
├── stok.html                 # Halaman Manajemen Stok Bahan Ajar
├── tracking.html             # Halaman Pelacakan Delivery Order
├── .gitignore                # Pengabaian file lokal git
└── README.md                 # Dokumentasi proyek (File ini)
```

---

## 💻 Cara Menjalankan Proyek Secara Lokal
Karena proyek ini sepenuhnya berjalan di sisi klien (client-side) tanpa memerlukan server backend, Anda dapat menjalankannya dengan sangat mudah:
1. Kloning Repositori ini
```
git clone https://github.com/achraflyy48/Sistem-Pemesanan-dan-Pemantauan-Bahan-Ajar-Universitas-Terbuka.git
```
2. Buka Proyek
* Masuk ke dalam direktori hasil kloning.
* Klik dua kali pada file index.html untuk membukanya langsung di peramban web (browser) pilihan Anda.
* Rekomendasi: Gunakan ekstensi Live Server di VS Code untuk pengalaman pengembangan yang lebih baik.

---

## 👨‍💻 Identitas Mahasiswa
* Nama: Achmad Rafli Teguh Pradana Susanto
* NIM: 050286758
* Mata Kuliah: Pemrograman Berbasis Website
* Program Studi: Sistem Informasi
* UPBJJ / UT-Daerah: Jember

---

## 📄 Lisensi
Proyek ini dilisensikan di bawah MIT License - lihat file LICENSE untuk detail lebih lanjut.
```
---

## 2. File `.gitignore`
Meskipun proyek ini tidak menggunakan `node_modules` karena memakai CDN, tetap merupakan praktik terbaik (*best practice*) seorang developer untuk menyediakan file `.gitignore`. Buat file dengan nama `.gitignore` di folder utama:

```text
# Log file dari OS atau editor lokal
.DS_Store
Thumbs.db
desktop.ini

# Folder konfigurasi editor
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.swp
```
