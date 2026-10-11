NALARAMAN — DATASET SINTETIS UNTUK PROTOTIPE

Jumlah baris: 5176
Distribusi label:
- Normal: 1645
- Scam: 1754
- Promosi: 1777

Kolom:
- id: ID unik baris
- teks_pesan: contoh pesan Bahasa Indonesia
- label: Normal / Scam / Promosi
- sumber_data: sintetis_template

PENTING:
Seluruh pesan dibuat secara sintetis dari template, bukan percakapan nyata.
Dataset ini cocok untuk menguji format data, pipeline preprocessing, dan baseline awal.
Dataset sintetis dapat membuat model mempelajari pola template, bukan pola dunia nyata.
Jangan melaporkan data ini sebagai data lapangan atau mengklaim hasil model sebagai validasi dunia nyata.
Sebelum penelitian ilmiah, tambahkan dataset nyata yang legal digunakan, dokumentasikan sumber dan lisensinya,
lakukan kurasi, cegah data leakage, dan evaluasi pada test set yang representatif.
Label adalah target berdasarkan skenario template dan perlu pemeriksaan manual.
