var app = new Vue({
  el: '#app',
  data: {

    // ---------- Data Referensi ----------
    ekspedisiList: [
      { kode: "JNE-REG", nama: "JNE Reguler (3-5 hari)" },
      { kode: "JNE-EXP", nama: "JNE Ekspres (1-2 hari)" },
      { kode: "TIKI-REG", nama: "TIKI Reguler (3-5 hari)" },
      { kode: "SICEPAT", nama: "SiCepat (1-2 hari)" }
    ],

    paketList: [
      {
        kode: "PAKET-UT-001",
        nama: "PAKET IPS Dasar",
        isi: ["EKMA4116 — Pengantar Manajemen", "EKMA4115 — Pengantar Akuntansi"],
        harga: 120000
      },
      {
        kode: "PAKET-UT-002",
        nama: "PAKET IPA Dasar",
        isi: ["BIOL4201 — Biologi Umum (Praktikum)", "FISIP4001 — Dasar-Dasar Sosiologi"],
        harga: 140000
      },
      {
        kode: "PAKET-UT-003",
        nama: "PAKET Sosial Lanjutan",
        isi: ["FISIP4001 — Dasar-Dasar Sosiologi", "EKMA4115 — Pengantar Akuntansi"],
        harga: 110000
      }
    ],

    // ---------- Data Delivery Order ----------
    // Data awal dari file dataBahanAjar.js (dikonversi ke format array)
    doList: [
      {
        nomorDO: "DO2025-0001",
        nim: "123456789",
        nama: "Rina Wulandari",
        status: "Dalam Perjalanan",
        ekspedisi: "JNE-REG",
        namaEkspedisi: "JNE Reguler (3-5 hari)",
        tanggalKirim: "2025-08-25",
        paketKode: "PAKET-UT-001",
        paketNama: "PAKET IPS Dasar",
        paketIsi: ["EKMA4116 — Pengantar Manajemen", "EKMA4115 — Pengantar Akuntansi"],
        total: 120000,
        perjalanan: [
          { waktu: "2025-08-25 10:12", keterangan: "Penerimaan di Loket: TANGSEL" },
          { waktu: "2025-08-25 14:07", keterangan: "Tiba di Hub: JAKSEL" },
          { waktu: "2025-08-26 08:44", keterangan: "Diteruskan ke Kantor Tujuan" }
        ]
      },
      {
        nomorDO: "DO2026-0002",
        nim: "050286758",
        nama: "Achmad Rafli Teguh Pradana Susanto",
        status: "Terkirim",
        ekspedisi: "TIKI-REG",
        namaEkspedisi: "TIKI Reguler (3-5 hari)",
        tanggalKirim: "2025-10-20",
        paketKode: "PAKET-UT-002",
        paketNama: "PAKET IPA Dasar",
        paketIsi: ["BIOL4201 — Biologi Umum (Praktikum)", "FISIP4001 — Dasar-Dasar Sosiologi"],
        total: 140000,
        perjalanan: [
          { waktu: "2025-08-25 10:12", keterangan: "Penerimaan di Loket: TANGSEL" },
          { waktu: "2025-08-25 14:07", keterangan: "Tiba di Hub: JAKSEL" },
          { waktu: "2025-08-26 08:44", keterangan: "Diteruskan ke Kantor Tujuan" }
        ]
      }
    ],

    // ---------- State Form Tambah DO ----------
    showFormDO: false,     // tampilkan / sembunyikan form
    formDO: {             // isian form DO baru
      nim: "",
      nama: "",
      ekspedisi: "",
      paketKode: "",
      tanggalKirim: "",
      total: 0
    },
    errorDO: {},           // pesan validasi

    // Menyimpan detail paket yang dipilih (ditampilkan di bawah select)
    paketDipilih: null,

    // ---------- State DO yang dibuka (expand timeline) ----------
    doTerbuka: {}          // { "DO2025-0001": true/false }
  },

  // ====================================================
  //  COMPUTED
  // ====================================================
  computed: {

    // Generate nomor DO berikutnya secara otomatis
    // Format: DO + Tahun + "-" + Sequence 4 digit
    nomorDOBerikutnya: function () {
      var tahun = new Date().getFullYear();
      var prefix = "DO" + tahun + "-";

      // Cari sequence tertinggi dari data DO yang sudah ada
      var maxSeq = 0;
      this.doList.forEach(function (item) {
        // Ambil bagian setelah "-"
        var bagian = item.nomorDO.split("-");
        if (bagian.length === 2) {
          var seq = parseInt(bagian[1], 10);
          if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
        }
      });

      // Tambahkan 1 dan format jadi 4 digit (contoh: 0002)
      var seqBaru = String(maxSeq + 1).padStart(4, "0");
      return prefix + seqBaru;
    }
  },

  // ====================================================
  //  WATCH
  // ====================================================
  watch: {

    // WATCHER 1: Saat paket dipilih, otomatis isi total harga dan tampilkan detail paket
    'formDO.paketKode': function (kodeBaruPaket) {
      if (!kodeBaruPaket) {
        // Kosongkan jika tidak ada yang dipilih
        this.paketDipilih = null;
        this.formDO.total = 0;
        return;
      }

      // Cari paket berdasarkan kode
      var paket = this.paketList.find(function (p) {
        return p.kode === kodeBaruPaket;
      });

      if (paket) {
        this.paketDipilih = paket;
        this.formDO.total = paket.harga; // Isi total otomatis
      } else {
        this.paketDipilih = null;
        this.formDO.total = 0;
      }
    },

    // WATCHER 2: Saat form DO ditampilkan, isi tanggal kirim dengan hari ini
    showFormDO: function (visible) {
      if (visible) {
        // Isi tanggal dengan hari ini secara otomatis
        var today = new Date();
        var yyyy = today.getFullYear();
        var mm = String(today.getMonth() + 1).padStart(2, "0");
        var dd = String(today.getDate()).padStart(2, "0");
        this.formDO.tanggalKirim = yyyy + "-" + mm + "-" + dd;
      }
    }
  },

  // ====================================================
  //  METHODS
  // ====================================================
  methods: {

    // ----- FORMAT HARGA -----
    formatHarga: function (angka) {
      return "Rp " + Number(angka).toLocaleString('id-ID');
    },

    // ----- FORMAT TANGGAL (untuk tampilan) -----
    formatTanggal: function (str) {
      if (!str) return "-";
      var opts = { day: 'numeric', month: 'long', year: 'numeric' };
      try {
        return new Date(str).toLocaleDateString('id-ID', opts);
      } catch (e) {
        return str;
      }
    },

    // ----- TOGGLE FORM DO -----
    toggleFormDO: function () {
      this.showFormDO = !this.showFormDO;
      if (!this.showFormDO) {
        this.resetFormDO();
      }
    },

    // ----- RESET FORM DO -----
    resetFormDO: function () {
      this.formDO = {
        nim: "",
        nama: "",
        ekspedisi: "",
        paketKode: "",
        tanggalKirim: "",
        total: 0
      };
      this.paketDipilih = null;
      this.errorDO = {};
    },

    // ----- VALIDASI FORM DO -----
    validasiDO: function () {
      var err = {};

      if (!this.formDO.nim.trim()) {
        err.nim = "NIM tidak boleh kosong.";
      } else if (!/^\d{6,12}$/.test(this.formDO.nim.trim())) {
        err.nim = "NIM harus berupa angka (6-12 digit).";
      }

      if (!this.formDO.nama.trim()) err.nama = "Nama tidak boleh kosong.";
      if (!this.formDO.ekspedisi) err.ekspedisi = "Pilih ekspedisi.";
      if (!this.formDO.paketKode) err.paketKode = "Pilih paket bahan ajar.";
      if (!this.formDO.tanggalKirim) err.tanggalKirim = "Tanggal kirim wajib diisi.";

      this.errorDO = err;
      return Object.keys(err).length === 0;
    },

    // ----- SIMPAN DO BARU -----
    simpanDO: function () {
      if (!this.validasiDO()) return;

      // Cari nama ekspedisi berdasarkan kode
      var ekspedisiObj = this.ekspedisiList.find(function (e) {
        return e.kode === this.formDO.ekspedisi;
      }, this);

      // Cari paket berdasarkan kode
      var paketObj = this.paketList.find(function (p) {
        return p.kode === this.formDO.paketKode;
      }, this);

      // Buat data DO baru
      var doBaru = {
        nomorDO: this.nomorDOBerikutnya,
        nim: this.formDO.nim.trim(),
        nama: this.formDO.nama.trim(),
        status: "Pending",
        ekspedisi: this.formDO.ekspedisi,
        namaEkspedisi: ekspedisiObj ? ekspedisiObj.nama : "-",
        tanggalKirim: this.formDO.tanggalKirim,
        paketKode: paketObj ? paketObj.kode : "-",
        paketNama: paketObj ? paketObj.nama : "-",
        paketIsi: paketObj ? paketObj.isi : [],
        total: this.formDO.total,
        perjalanan: [
          {
            waktu: this.formDO.tanggalKirim + " 08:00",
            keterangan: "DO dibuat — Menunggu proses pengiriman"
          }
        ]
      };

      // Tambahkan ke daftar DO
      this.doList.unshift(doBaru); // unshift agar DO terbaru tampil di atas

      this.showFormDO = false;
      this.resetFormDO();
      alert("✅ Delivery Order " + doBaru.nomorDO + " berhasil dibuat!");
    },

    // ----- TOGGLE EXPAND DO (tampilkan/sembunyikan timeline) -----
    toggleDO: function (nomorDO) {
      Vue.set(this.doTerbuka, nomorDO, !this.doTerbuka[nomorDO]);
    },

    // ----- CEK APAKAH DO TERBUKA -----
    isDOTerbuka: function (nomorDO) {
      return !!this.doTerbuka[nomorDO];
    },

    // ----- CSS CLASS STATUS TRACKING -----
    kelasStatus: function (status) {
      if (status === "Terkirim") return "status-terkirim";
      if (status === "Dalam Perjalanan") return "status-perjalanan";
      return "status-pending";
    },

    // ----- IKON STATUS -----
    ikonStatus: function (status) {
      if (status === "Terkirim") return "✅";
      if (status === "Dalam Perjalanan") return "🚚";
      return "⏳";
    }
  }
});
