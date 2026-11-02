# Star Catcher: Misi Galaksi

Game web sederhana (HTML5 Canvas + JavaScript murni, tanpa Phaser dan tanpa proses build).
Tangkap bintang sebanyak mungkin dalam 60 detik dengan 3 nyawa.

## Cara menjalankan
1. Ekstrak ZIP, buka folder di VS Code.
2. Jalankan `index.html` dengan Live Server, atau gunakan server lokal:
   `python -m http.server 8000` lalu buka http://localhost:8000
3. Klik **Mulai permainan**.

## Kontrol
- Panah kiri/kanan atau tombol **A / D**
- Tombol layar ◀ ▶ (untuk HP)
- Geser jari/mouse pada area game

## Aturan
- Bintang kuning: +1 skor
- Bintang emas: +5 skor
- Meteor: -1 nyawa
- Game selesai saat waktu 60 detik habis atau nyawa 0. Tombol **Mulai ulang** mengembalikan skor, waktu, dan nyawa.

## Isi paket
| File | Fungsi |
| --- | --- |
| index.html | Halaman utama game |
| style.css | Tampilan halaman dan kontrol |
| game.js | Aturan permainan, skor, gerakan, dan timer |
| assets/star.svg | Gambar bintang (path relatif) |
| README.md | Dokumentasi ini |

## Catatan modifikasi
1. **Judul** diubah menjadi "Star Catcher: Misi Galaksi".
2. **Bintang emas** (peluang kecil, bernilai +5 skor) ditambahkan.
3. **Latar bintang berlapis** yang bergerak pelan, serta kecepatan jatuh yang naik seiring waktu.

## Publikasi
- itch.io: unggah `Star_Catcher_Siap_Upload.zip` sebagai *HTML / HTML Game*, aktifkan "This file will be played in the browser".
- GitHub Pages: unggah isi folder (bukan ZIP), lalu Settings > Pages > Deploy from a branch > `main` / `(root)`.

## Link
- Itch.io: (isi tautan milik Anda)
- GitHub Pages: (isi tautan milik Anda)
- Repository: (isi tautan milik Anda)

## Kredit
Kode dan aset dibuat untuk praktik perkuliahan Web Browser Game, Pertemuan 7.
