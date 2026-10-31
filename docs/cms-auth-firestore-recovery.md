# Pemulihan Login dan Akses CMS ZIA

Dokumen ini menjelaskan langkah operasional setelah perubahan pada branch `fix/cms-auth-firestore-save`.

## 1. Pastikan akun administrator Firebase

1. Buka Firebase Console dan pilih project yang dipakai oleh aplikasi web.
2. Masuk ke **Authentication → Sign-in method**.
3. Pastikan provider **Email/Password** aktif jika login menggunakan email dan kata sandi.
4. Buka **Authentication → Users** dan pastikan akun administrator yang dipakai memang terdaftar dan tidak dinonaktifkan.
5. Jika akun sudah terdaftar tetapi kata sandi tidak lagi diketahui, gunakan menu **Lupa kata sandi?** di halaman login CMS. Tautan reset dikirim Firebase ke email akun.
6. Untuk login Google, aktifkan provider Google dan pastikan domain produksi website sudah ada di daftar **Authorized domains**. Domain preview perlu ditambahkan hanya jika memang akan dipakai untuk menguji login.

> Kode CMS tidak membuat akun administrator otomatis. Akun baru dan peran pengguna harus dibuat oleh administrator melalui Firebase/otorisasi yang sah. Error `auth/invalid-credential` berasal dari proses Firebase Authentication; periksa status akun dan gunakan reset kata sandi, bukan membuat akun baru melalui form login.

## 2. Deploy Firestore Rules ke database yang benar

Aplikasi ini menggunakan Firestore **named database**, bukan database `(default)`. ID database di bawah diambil dari konfigurasi Firebase aplikasi.

Dari root repository, jalankan:

```bash
firebase login
firebase projects:list
firebase firestore:databases:list --project gen-lang-client-0898986678
firebase deploy --only firestore:rules --project gen-lang-client-0898986678
```

File `firebase.json` pada repository ini mengikat `firestore.rules` ke database `ai-studio-e7e5e0b2-3070-42b3-b698-ab325ea50bb7`. Pastikan database tersebut muncul dalam daftar sebelum menjalankan deploy.

Setelah deploy, buka Firebase Console → Firestore Database → pilih database bernama tersebut → Rules, lalu pastikan aturan baru sudah aktif.

**Penting:** deployment rules dari CLI mengganti rules yang sedang aktif pada database target dengan isi file lokal. Tinjau perubahan rules dan pastikan branch ini merupakan sumber aturan yang memang ingin dipublikasikan sebelum menjalankan perintah deploy.

## 3. Perubahan perilaku CMS

- Sesi CMS hanya dianggap aktif saat Firebase Auth memiliki pengguna yang benar-benar login. Data role dalam `localStorage` tidak lagi menjadi sumber autentikasi.
- Tombol Quick Access simulasi dihapus karena tidak memiliki Firebase session dan tidak dapat menulis ke Firestore.
- Login email/password tidak membuat akun admin otomatis.
- Pengguna Google/Firebase yang belum diprovisikan tidak otomatis diberi role CRM.
- Hak pengelolaan konten tersedia bagi `super_admin`, `admin`, dan `editor`. Pengelolaan akun pengguna hanya untuk `super_admin` dan `admin`. Peran staf hanya melihat fitur yang sesuai.
- Pengaturan perusahaan baru memperbarui cache browser setelah penulisan Firestore berhasil.
- Kegagalan Firestore menampilkan pesan yang membedakan sesi tidak aktif, akses ditolak, database tidak tersedia, dan data yang tidak ditemukan.

## 4. Uji setelah deployment

1. Buka `https://zia-properti-two.vercel.app/admin`.
2. Masuk dengan akun administrator Firebase yang sudah terdaftar, atau gunakan reset kata sandi.
3. Buka Profil Perusahaan, ubah satu nilai uji yang aman, lalu simpan.
4. Pastikan notifikasi sukses muncul hanya setelah Firestore menerima penulisan.
5. Muat ulang halaman dan pastikan nilai yang sama masih tampil.
6. Uji satu konten non-kritis, misalnya draft artikel, sebelum melakukan perubahan produksi yang lebih besar.

Jangan menguji dengan menghapus proyek, prospek, atau data operasional aktif. Jika muncul `permission-denied`, periksa apakah rules telah dipublikasikan pada database bernama yang benar dan apakah role Firebase user sesuai.
