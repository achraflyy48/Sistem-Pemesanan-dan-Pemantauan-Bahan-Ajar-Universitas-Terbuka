var app = new Vue({
  el: '#app',
  data: {

    // ---------- Data Referensi (dropdown) ----------
    upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
    kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],

    // ---------- Data Stok Bahan Ajar ----------
    stok: [
      {
        kode: "EKMA4116",
        judul: "Pengantar Manajemen",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A3",
        harga: 65000,
        qty: 28,
        safety: 20,
        catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
      },
      {
        kode: "EKMA4115",
        judul: "Pengantar Akuntansi",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A4",
        harga: 60000,
        qty: 7,
        safety: 15,
        catatanHTML: "<strong>Cover baru</strong>"
      },
      {
        kode: "BIOL4201",
        judul: "Biologi Umum (Praktikum)",
        kategori: "Praktikum",
        upbjj: "Surabaya",
        lokasiRak: "R3-B2",
        harga: 80000,
        qty: 12,
        safety: 10,
        catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
      },
      {
        kode: "FISIP4001",
        judul: "Dasar-Dasar Sosiologi",
        kategori: "MK Pilihan",
        upbjj: "Makassar",
        lokasiRak: "R2-C1",
        harga: 55000,
        qty: 2,
        safety: 8,
        catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
      },
      {
        kode: "EKMA4214",
        judul: "Manajemen Sumber Daya Manusia",
        kategori: "MK Pilihan",
        upbjj: "Padang",
        lokasiRak: "R2-D1",
        harga: 70000,
        qty: 0,
        safety: 5,
        catatanHTML: "Menunggu <strong>restock</strong>"
      },
      {
        kode: "MSIM4310",
        judul: "Analisis dan Visualisasi Data",
        kategori: "MK Wajib",
        upbjj: "Surabaya",
        lokasiRak: "R3-A1",
        harga: 60000,
        qty: 15,
        safety: 10,
        catatanHTML: "<strong>Edisi Terbaru</strong>"
      }
    ],

    // ---------- State Filter ----------
    filterUpbjj: "",       // filter UT-Daerah yang dipilih
    filterKategori: "",    // filter Kategori (dependent ke upbjj)
    filterMenipis: false,  // checkbox qty < safety
    filterKosong: false,   // checkbox qty = 0

    // ---------- State Sort ----------
    sortField: "",         // field yang sedang disorting: "judul", "qty", "harga"
    sortAsc: true,         // true = ascending, false = descending

    // ---------- State Modal Edit ----------
    showModalEdit: false,  // tampilkan / sembunyikan modal edit
    editIndex: null,       // index data stok yang sedang diedit
    formEdit: {            // form isian untuk edit
      kode: "",
      judul: "",
      kategori: "",
      upbjj: "",
      lokasiRak: "",
      harga: "",
      qty: "",
      safety: "",
      catatanHTML: ""
    },
    errorEdit: {},         // menyimpan pesan error validasi edit

    // ---------- State Form Tambah ----------
    showFormTambah: false, // tampilkan / sembunyikan form tambah
    formTambah: {          // form isian untuk data baru
      kode: "",
      judul: "",
      kategori: "",
      upbjj: "",
      lokasiRak: "",
      harga: "",
      qty: "",
      safety: "",
      catatanHTML: ""
    },
    errorTambah: {}        // menyimpan pesan error validasi tambah
  },

  computed: {

    // Kategori yang tersedia berdasarkan upbjj yang dipilih pada filter
    // Ini mendukung "dependent options": kategori hanya tampil setelah upbjj dipilih
    kategoriTersedia: function () {
      if (!this.filterUpbjj) return [];

      // Kumpulkan kategori unik dari stok yang upbjjnya cocok
      var seen = {};
      var hasil = [];
      this.stok.forEach(function (item) {
        if (item.upbjj === this.filterUpbjj && !seen[item.kategori]) {
          seen[item.kategori] = true;
          hasil.push(item.kategori);
        }
      }, this);
      return hasil;
    },

    // Data stok setelah semua filter dan sort diterapkan
    stokFiltered: function () {
      var hasil = this.stok.slice(); // salin array agar aslinya tidak berubah

      // --- Filter berdasarkan UT-Daerah ---
      if (this.filterUpbjj) {
        hasil = hasil.filter(function (item) {
          return item.upbjj === this.filterUpbjj;
        }, this);
      }

      // --- Filter berdasarkan Kategori (hanya aktif jika upbjj dipilih) ---
      if (this.filterUpbjj && this.filterKategori) {
        hasil = hasil.filter(function (item) {
          return item.kategori === this.filterKategori;
        }, this);
      }

      // --- Filter kondisi stok ---
      if (this.filterMenipis) {
        hasil = hasil.filter(function (item) {
          return item.qty < item.safety;
        });
      }
      if (this.filterKosong) {
        hasil = hasil.filter(function (item) {
          return item.qty === 0;
        });
      }

      // --- Sort ---
      if (this.sortField) {
        var field = this.sortField;
        var asc = this.sortAsc;
        hasil.sort(function (a, b) {
          var valA = a[field];
          var valB = b[field];
          // Untuk string: gunakan localeCompare
          if (typeof valA === 'string') {
            return asc
              ? valA.localeCompare(valB, 'id')
              : valB.localeCompare(valA, 'id');
          }
          // Untuk angka
          return asc ? valA - valB : valB - valA;
        });
      }

      return hasil;
    }
  },

  // ====================================================
  //  WATCH  — memantau perubahan data tertentu
  // ====================================================
  watch: {

    // WATCHER 1: Ketika filterUpbjj berubah, reset filterKategori
    // Ini penting agar kategori yang sudah dipilih tidak "nyasar" ke data upbjj lain
    filterUpbjj: function (nilaiBaruUpbjj) {
      // Reset kategori saat UT-Daerah berubah
      this.filterKategori = "";
      // Kalau upbjj dikosongkan, reset juga kategori
      if (!nilaiBaruUpbjj) {
        this.filterKategori = "";
      }
    },

    // WATCHER 2: Ketika filterMenipis aktif, matikan filterKosong
    // agar tidak konflik (qty=0 sudah pasti menipis, tapi tampilkan salah satu saja)
    filterMenipis: function (val) {
      if (val) this.filterKosong = false;
    },

    // WATCHER 3: Ketika filterKosong aktif, matikan filterMenipis
    filterKosong: function (val) {
      if (val) this.filterMenipis = false;
    }
  },

  // ====================================================
  //  METHODS  — semua fungsi aksi ada di sini
  // ====================================================
  methods: {

    // ----- FORMAT HARGA -----
    formatHarga: function (angka) {
      return "Rp " + Number(angka).toLocaleString('id-ID');
    },

    // ----- STATUS STOK -----
    // Mengembalikan objek { label, kelas } berdasarkan qty & safety
    statusStok: function (item) {
      if (item.qty === 0) {
        return { label: "Kosong", kelas: "badge-kosong", ikon: "🔴" };
      } else if (item.qty < item.safety) {
        return { label: "Menipis", kelas: "badge-menipis", ikon: "🟡" };
      } else {
        return { label: "Aman", kelas: "badge-aman", ikon: "🟢" };
      }
    },

    // ----- SORT -----
    // Dipanggil saat header tabel diklik
    setSort: function (field) {
      if (this.sortField === field) {
        // Klik kolom yang sama: balik arahnya
        this.sortAsc = !this.sortAsc;
      } else {
        // Klik kolom baru: mulai dari ascending
        this.sortField = field;
        this.sortAsc = true;
      }
    },

    // Tampilkan ikon sort di header kolom
    ikonSort: function (field) {
      if (this.sortField !== field) return "⇅";
      return this.sortAsc ? "↑" : "↓";
    },

    // ----- RESET FILTER -----
    resetFilter: function () {
      this.filterUpbjj = "";
      this.filterKategori = "";
      this.filterMenipis = false;
      this.filterKosong = false;
      this.sortField = "";
      this.sortAsc = true;
    },

    // ----- BUKA MODAL EDIT -----
    bukaEdit: function (item) {
      // Cari index di array asli (bukan array terfilter)
      this.editIndex = this.stok.indexOf(item);

      // Salin data item ke formEdit (agar perubahan tidak langsung ke data)
      this.formEdit = {
        kode: item.kode,
        judul: item.judul,
        kategori: item.kategori,
        upbjj: item.upbjj,
        lokasiRak: item.lokasiRak,
        harga: item.harga,
        qty: item.qty,
        safety: item.safety,
        catatanHTML: item.catatanHTML
      };
      this.errorEdit = {};
      this.showModalEdit = true;
    },

    // ----- TUTUP MODAL EDIT -----
    tutupEdit: function () {
      this.showModalEdit = false;
      this.editIndex = null;
      this.errorEdit = {};
    },

    // ----- VALIDASI FORM EDIT -----
    validasiEdit: function () {
      var err = {};
      if (!this.formEdit.judul.trim()) err.judul = "Judul tidak boleh kosong.";
      if (!this.formEdit.kategori) err.kategori = "Pilih kategori.";
      if (!this.formEdit.upbjj) err.upbjj = "Pilih UT-Daerah.";
      if (!this.formEdit.lokasiRak.trim()) err.lokasiRak = "Lokasi rak tidak boleh kosong.";
      if (this.formEdit.harga === "" || isNaN(Number(this.formEdit.harga))) {
        err.harga = "Harga harus berupa angka.";
      } else if (Number(this.formEdit.harga) < 0) {
        err.harga = "Harga tidak boleh negatif.";
      }
      if (this.formEdit.qty === "" || isNaN(Number(this.formEdit.qty))) {
        err.qty = "Jumlah stok harus berupa angka.";
      } else if (Number(this.formEdit.qty) < 0) {
        err.qty = "Stok tidak boleh negatif.";
      }
      if (this.formEdit.safety === "" || isNaN(Number(this.formEdit.safety))) {
        err.safety = "Safety stock harus berupa angka.";
      } else if (Number(this.formEdit.safety) < 0) {
        err.safety = "Safety tidak boleh negatif.";
      }
      this.errorEdit = err;
      return Object.keys(err).length === 0; // true jika tidak ada error
    },

    // ----- SIMPAN EDIT -----
    simpanEdit: function () {
      if (!this.validasiEdit()) return;

      // Update data di array asli
      Vue.set(this.stok, this.editIndex, {
        kode: this.formEdit.kode,
        judul: this.formEdit.judul.trim(),
        kategori: this.formEdit.kategori,
        upbjj: this.formEdit.upbjj,
        lokasiRak: this.formEdit.lokasiRak.trim(),
        harga: Number(this.formEdit.harga),
        qty: Number(this.formEdit.qty),
        safety: Number(this.formEdit.safety),
        catatanHTML: this.formEdit.catatanHTML
      });

      this.tutupEdit();
    },

    // ----- TOGGLE FORM TAMBAH -----
    toggleFormTambah: function () {
      this.showFormTambah = !this.showFormTambah;
      if (this.showFormTambah) {
        this.resetFormTambah();
      }
    },

    // ----- RESET FORM TAMBAH -----
    resetFormTambah: function () {
      this.formTambah = {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: "",
        qty: "",
        safety: "",
        catatanHTML: ""
      };
      this.errorTambah = {};
    },

    // ----- VALIDASI FORM TAMBAH -----
    validasiTambah: function () {
      var err = {};

      if (!this.formTambah.kode.trim()) {
        err.kode = "Kode mata kuliah tidak boleh kosong.";
      } else {
        // Cek apakah kode sudah ada
        var sudahAda = this.stok.some(function (s) {
          return s.kode.toUpperCase() === this.formTambah.kode.trim().toUpperCase();
        }, this);
        if (sudahAda) err.kode = "Kode mata kuliah sudah digunakan.";
      }

      if (!this.formTambah.judul.trim()) err.judul = "Judul tidak boleh kosong.";
      if (!this.formTambah.kategori) err.kategori = "Pilih kategori.";
      if (!this.formTambah.upbjj) err.upbjj = "Pilih UT-Daerah.";
      if (!this.formTambah.lokasiRak.trim()) err.lokasiRak = "Lokasi rak tidak boleh kosong.";

      if (this.formTambah.harga === "" || isNaN(Number(this.formTambah.harga))) {
        err.harga = "Harga harus berupa angka.";
      } else if (Number(this.formTambah.harga) < 0) {
        err.harga = "Harga tidak boleh negatif.";
      }

      if (this.formTambah.qty === "" || isNaN(Number(this.formTambah.qty))) {
        err.qty = "Jumlah stok harus berupa angka.";
      } else if (Number(this.formTambah.qty) < 0) {
        err.qty = "Stok tidak boleh negatif.";
      }

      if (this.formTambah.safety === "" || isNaN(Number(this.formTambah.safety))) {
        err.safety = "Safety stock harus berupa angka.";
      } else if (Number(this.formTambah.safety) < 0) {
        err.safety = "Safety tidak boleh negatif.";
      }

      this.errorTambah = err;
      return Object.keys(err).length === 0;
    },

    // ----- SIMPAN TAMBAH -----
    simpanTambah: function () {
      if (!this.validasiTambah()) return;

      // Tambahkan data baru ke array stok
      this.stok.push({
        kode: this.formTambah.kode.trim().toUpperCase(),
        judul: this.formTambah.judul.trim(),
        kategori: this.formTambah.kategori,
        upbjj: this.formTambah.upbjj,
        lokasiRak: this.formTambah.lokasiRak.trim(),
        harga: Number(this.formTambah.harga),
        qty: Number(this.formTambah.qty),
        safety: Number(this.formTambah.safety),
        catatanHTML: this.formTambah.catatanHTML
      });

      this.showFormTambah = false;
      this.resetFormTambah();
      alert("✅ Data bahan ajar berhasil ditambahkan!");
    }
  }
});
