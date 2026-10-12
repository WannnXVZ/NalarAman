# ⚠️ Dokumentasi Keterbatasan Sistem & Aspek Integritas Ilmiah (Limitations)
**Platform NalarAman — Explainable AI Digital Scam Detection**  
*Sesuai Ketentuan PRD Bab 34 & Standar Integritas Karya Tulis Ilmiah (LKTI)*

---

## 1. Pengantar Integritas Akademik
NalarAman dirancang sebagai sistem pendukung keputusan (*decision-support system*) dan sarana edukasi literasi digital interaktif berbasis kecerdasan buatan. Mengacu pada etika kecerdasan buatan dan keterbukaan ilmiah, platform ini secara transparan mendokumentasikan batasan operasional, batasan teknis, dan ruang lingkup metodologis agar pengguna dan dewan penguji memahami batas kapabilitas sistem secara objektif.

---

## 2. Keterbatasan Teknis & Metodologis

### A. Batasan Masukan Teks (*Text Input Limitations*)
1. **Panjang Karakter (5 – 2.000 Karakter)**:
   - Sistem menetapkan batas minimum 5 karakter untuk mencegah inferensi tanpa konteks (seperti sapaan sepotong `"hai"`, `"tes"`).
   - Batas maksimum 2.000 karakter ditetapkan untuk menjaga efisiensi komputasi lokal, stabilitas memori, dan mencegah eksploitasi beban berlebih (*Denial of Service*) saat menjalankan simulasi permutasi LIME.
2. **Karakteristik Bahasa & Dialek Lokal**:
   - Model dilatih pada korpus bahasa Indonesia baku dan ragam bahasa percakapan informal digital (SMS, WhatsApp).
   - Model memiliki keterbatasan dalam memahami dialek bahasa daerah murni (seperti bahasa Jawa ngoko, Sunda halus, Minang, dll.) jika pesan ditulis sepenuhnya tanpa percampuran kosakata bahasa Indonesia.
3. **Sarkasme, Ironi, dan Konteks Multiturn**:
   - Analisis saat ini berfokus pada analisis teks tunggal (*single message analysis*).
   - Sistem belum menganalisis riwayat percakapan panjang bertahap (*multiturn dialogue context*), sehingga sindiran (*sarcasm*), lelucon kontekstual antar teman akrab, atau rekayasa manipulasi bertahap selama berminggu-minggu (*grooming/pig butchering*) mungkin belum terdeteksi secara optimal pada tahap awal.

---

### B. Keterbatasan Mesin OCR (*Optical Character Recognition*)
1. **Resolusi dan Kualitas Visual Gambar**:
   - Akurasi ekstraksi OCR bergantung pada ketajaman dan kontras gambar. Screenshot dengan kompresi sangat berat, resolusi sangat rendah (<200px), efek buram (*motion blur*), atau foto layar fisik kamera yang mengalami pantulan cahaya (*glare*) dapat menghasilkan kesalahan penafsiran karakter (*character error rate*).
2. **Ukuran Berkas Maksimal (5 MB)**:
   - Batas ukuran berkas 5 MB diterapkan demi menghemat waktu transmisi HTTP dan beban memori buffer server.
3. **Penyimpangan Layout Multi-Kolom**:
   - Ekstraksi teks dioptimalkan untuk tangkapan layar percakapan pesan instan (WhatsApp, Telegram, SMS). Gambar dokumen dengan struktur multi-kolom rumit atau tabel kompleks dapat mengalami penggabungan baris yang tidak berurutan secara temporal.
4. **Wajib Koreksi Manual (*Human-in-the-Loop*)**:
   - Mengacu pada PRD Bab 24.2, sistem sengaja menyediakan *OcrTextEditor* sebelum analisis dijalankan. Pengguna diwajibkan memeriksa hasil OCR untuk mengoreksi angka atau ejaan sebelum dikirim ke pipeline klasifikasi.

---

### C. Keterbatasan Model Klasifikasi & Explainable AI (LIME)
1. **Varian Penipuan Baru (*Zero-Day Scam Modus*)**:
   - Model dilatih menggunakan 6.408 sampel representatif hingga tahun 2026. Namun, pelaku kejahatan siber terus mengembangkan skema manipulasi baru (*novel social engineering attacks*). Kategori *"Risiko Rendah"* bukan merupakan jaminan 100% mutlak bahwa pesan tersebut bebas dari modus penipuan varian terbaru yang belum pernah diobservasi oleh model.
2. **Komputasi Aproksimasi Lokal LIME**:
   - LIME bekerja berdasarkan pendekatan regresi linier lokal melalui pengambilan sampel acak (*random perturbation* sebanyak 500 sampel).
   - Akibat sifat stokastik dari pengambilan sampel acak, nilai bobot marjinal kata dapat mengalami sedikit fluktuasi desimal ($\pm 0.01$) antar penjalanan pengujian, meskipun arah kontribusi (*direction*) dan peringkat kata utama tetap stabil dan konsisten.
3. **Trade-Off Waktu Inferensi**:
   - Analisis NLP murni membutuhkan waktu <25 ms, namun komputasi LIME membutuhkan waktu ~600–750 ms karena harus mengevaluasi ratusan permutasi teks secara simultan.

---

## 3. Aspek Privasi, Etika & Batasan Legal

### A. Bukan Vonis Penegakan Hukum Mutlak (*Not a Legal Verdict*)
NalarAman adalah alat bantu pendukung keputusan (*decision-support tool*) berbasis probabilitas statistik. Hasil klasifikasi dan penilaian risiko tidak dapat dijadikan sebagai bukti putusan hukum di pengadilan tanpa adanya investigasi forensik digital resmi dari pihak berwenang (seperti Bareskrim Polri atau Kementerian Komdigi).

### B. Prinsip Keselamatan Pertama (*Safety-First Principle*)
Pada kasus ambigu yang melibatkan data kredensial rahasia (seperti kode OTP, PIN perbankan, atau lampiran berkas .apk), sistem dirancang secara sengaja untuk bersikap konservatif/waspada (menaikkan tingkat risiko ke Sedang/Tinggi). Hal ini bertujuan untuk memprioritaskan keselamatan aset pengguna daripada bersikap abai (*better safe than sorry*).

### C. Kepatuhan Privasi Data Pribadi (UU PDP No. 27 Tahun 2022)
1. Seluruh teks dan gambar tangkapan layar yang diunggah pengguna diproses secara *in-memory* di memori RAM server lokal.
2. Server **tidak menyimpan isi pesan, nama pengguna, atau berkas gambar** ke dalam basis data atau file log permanen.
3. Memori *buffer* gambar segera dialokasikan untuk pembersihan (*garbage collection*) segera setelah ekstraksi OCR selesai (PRD Bab 26).

---

## 4. Rekomendasi Mitigasi bagi Pengguna
1. Selalu lakukan **verifikasi silang dua arah** melalui saluran resmi perbankan atau instansi pemerintah (misal melalui *call center* resmi, situs berakhiran `.go.id` atau `.co.id`).
2. Jangan pernah menekan tautan yang mencurigakan atau menginstal aplikasi dari luar toko aplikasi resmi (Google Play Store / Apple App Store).
3. Jangan pernah membagikan kode OTP atau PIN kepada siapa pun, termasuk pihak yang mengaku sebagai petugas instansi resmi.
