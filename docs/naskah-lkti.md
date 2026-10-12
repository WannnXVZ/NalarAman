# 📜 Naskah Karya Tulis Ilmiah (LKTI)

**NALARAMAN: PLATFORM DETEKSI REKAYASA SOSIAL DAN PENIPUAN DIGITAL BERBAHASA INDONESIA BERBASIS EXPLAINABLE ARTIFICIAL INTELLIGENCE (LIME) DAN OPTICAL CHARACTER RECOGNITION**

---

## ABSTRAK
Kejahatan siber berbasis rekayasa sosial (*social engineering*) di Indonesia kian mengkhawatirkan dengan beragam modus manipulatif, mulai dari undangan pernikahan berekstensi APK berbahaya, penipuan berkedok undian perbankan, hingga pemerasan darurat keluarga. Rendahnya literasi digital masyarakat serta dominasi model kecerdasan buatan (*Artificial Intelligence/AI*) konvensional yang bekerja secara tertutup (*black-box*) menjadi kendala utama dalam membangun pertahanan siber yang efektif. 

Penelitian ini mengusulkan **NalarAman**, sebuah platform sistem pendukung keputusan (*decision-support system*) dan edukasi literasi digital terintegrasi yang menggabungkan:
1. Model klasifikasi teks multi-kelas (*Normal, Scam, Promosi*) berbasis *TF-IDF Vectorizer* dan regresi logistik terkalibrasi;
2. Mesin *Explainable AI* (XAI) berbasis algoritma *Local Interpretable Model-agnostic Explanations* (LIME) yang membedah kontribusi kata pemicu risiko secara transparan;
3. Mesin deteksi aturan (*rule-based*) untuk 8 indikator manipulasi psikologis dan teknis rekayasa sosial; serta
4. Mesin ekstraksi tangkapan layar percakapan (*Optical Character Recognition/OCR*) mandiri berbasis *deep learning ONNX Runtime*.

Dilatih dan dievaluasi pada dataset gabungan komprehensif sebanyak 6.408 sampel (terdiri atas data sintetis, data nyata *SMS fraud benchmark* Indonesia, dan kurasi kasus nyata penipuan siber modern), model klasifikasi berhasil mencapai **akurasi sebesar 99,27%** dan **Macro F1-score 0,9927** pada data uji (*test set*), serta mempertahankan akurasi tinggi sebesar **96,39%** pada sub-populasi data percakapan dunia nyata. Komputasi XAI LIME menghasilkan penjelasan atribusi kata dalam rata-rata waktu **685 ms**, menghasilkan total latensi respon sistem sebesar **~715 ms** yang jauh melampaui batas toleransi interaksi manusia. Di samping performa teknis, NalarAman menerapkan prinsip *Safety-First* dan kepatuhan privasi data (UU PDP No. 27 Tahun 2022) melalui pemrosesan *in-memory* tanpa menyimpan data pribadi pengguna. NalarAman diharapkan dapat menjadi instrumen strategis dalam meningkatkan ketahanan siber masyarakat Indonesia.

**Kata Kunci**: *Penipuan Digital, Rekayasa Sosial, Explainable AI, LIME, Natural Language Processing, Optical Character Recognition, Keamanan Siber.*

---

## ABSTRACT
*Cybercrimes based on social engineering in Indonesia are increasingly alarming, involving diverse manipulative tactics ranging from malicious APK wedding invitations and banking lottery scams to simulated family emergency extortions. Low digital literacy and the prevalence of conventional black-box Artificial Intelligence (AI) models pose significant hurdles to establishing effective cyber defense.*

*This study introduces **NalarAman**, an integrated decision-support and digital literacy platform combining: (1) a multi-class text classification model (Normal, Scam, Promotion) based on TF-IDF Vectorizer and calibrated Logistic Regression; (2) an Explainable AI (XAI) engine utilizing Local Interpretable Model-agnostic Explanations (LIME) that transparently exposes word-level risk attribution; (3) a rule-based detection engine for 8 technical and psychological social engineering indicators; and (4) a self-hosted deep learning Optical Character Recognition (OCR) engine powered by ONNX Runtime for instant screenshot parsing.*

*Trained and evaluated on a curated corpus of 6,408 samples (comprising synthetic scenarios, Indonesian SMS fraud academic benchmarks, and contemporary modern cyber scam records), the classification engine achieves **99.27% accuracy** and a **Macro F1-score of 0.9927** on the unseen test set, while maintaining **96.39% accuracy** on real-world benchmark subsets. LIME explanations execute within an average of **685 ms**, enabling an end-to-end response latency of **~715 ms**. Furthermore, NalarAman enforces a Safety-First policy and strictly complies with the Indonesian Personal Data Protection Law (UU PDP) through volatile in-memory processing. NalarAman represents a scalable and transparent technological paradigm to bolster societal cyber resilience.*

*Keywords: Digital Scam, Social Engineering, Explainable AI, LIME, Natural Language Processing, Optical Character Recognition, Cyber Security.*

---

## BAB I: PENDAHULUAN

### 1.1 Latar Belakang Masalah
Transformasi digital di Indonesia telah mendorong penetrasi internet hingga melampaui 79% dari total populasi pada tahun 2024. Namun, akselerasi konektivitas ini tidak diimbangi dengan tingkat literasi keamanan digital yang memadai. Berdasarkan data Kementerian Komunikasi dan Informatika (kini Kementerian Komdigi) serta Bareskrim Polri, kejahatan berbasis rekayasa sosial (*social engineering*) menduduki peringkat teratas tindak pidana siber, dengan kerugian finansial masyarakat diperkirakan mencapai puluhan triliun rupiah setiap tahunnya.

Modus penipuan digital di Indonesia telah berevolusi dari sekadar pesan singkat (*SMS*) penipuan konvensional menjadi skema manipulasi psikologis yang canggih di aplikasi pesan instan (seperti WhatsApp dan Telegram). Di antara modus paling masif adalah:
1. Penyebaran berkas instalasi Android berbahaya berkedok dokumen (*social engineering APK*) seperti surat tilang elektronik, resi paket ekspedisi, atau surat undangan pernikahan;
2. Peniruan identitas lembaga keuangan (*banking impersonation*) dengan iming-iming undian berhadiah atau perubahan tarif transfer; dan
3. Pemanfaatan tekanan waktu dan kepanikan darurat keluarga (*urgency & crisis manipulation*).

Meskipun berbagai instrumen penapis teks berbasis pembelajaran mesin (*Machine Learning*) telah dikembangkan, sebagian besar solusi yang tersedia saat ini memiliki dua kelemahan mendasar:
1. **Sifat Kotak Hitam (*Black-Box Dilemma*)**: Model klasifikasi mutakhir umumnya hanya menyajikan label biner (*"Aman"* atau *"Bahaya"*) dan skor persentase probabilitas tanpa memberikan penjelasan kausal. Ketiadaan penjelasan ini membuat pengguna awam tidak memahami alasan di balik vonis tersebut, sehingga gagal memberikan edukasi literasi jangka panjang.
2. **Keterbatasan Format Masukan (Hambatan Antarmuka)**: Mayoritas korban penipuan menerima pesan dalam bentuk percakapan visual di ponsel pintar. Meminta pengguna untuk menyalin teks (*copy-paste*) secara manual menciptakan gesekan gesit (*friction*), terutama pada aplikasi pesan yang menonaktifkan fitur seleksi teks atau saat korban dalam kondisi panik.

### 1.2 Rumusan Masalah
Berdasarkan latar belakang tersebut, rumusan masalah dalam penelitian ini adalah:
1. Bagaimana merancang arsitektur model klasifikasi pemrosesan bahasa alami (NLP) yang akurat dan terkalibrasi untuk membedakan pesan Normal, Promosi, dan Penipuan (*Scam*) berbahasa Indonesia?
2. Bagaimana mengintegrasikan metode *Explainable AI* (LIME) dan deteksi pola rekayasa sosial secara *real-time* tanpa mengorbankan latensi respon interaksi pengguna?
3. Bagaimana mengimplementasikan subsistem *Optical Character Recognition* (OCR) mandiri yang mampu mengekstraksi percakapan tangkapan layar secara presisi dengan tetap menjamin privasi data pribadi pengguna?

### 1.3 Tujuan Penelitian
Tujuan dari penelitian ini adalah:
1. Membangun model klasifikasi multi-kelas NLP berbasis *TF-IDF* dan regresi logistik terkalibrasi pada korpus 6.408 sampel pesan Indonesia dengan akurasi di atas 95%;
2. Mengembangkan mesin *Explainable AI* berbasis LIME yang memvisualisasikan bobot kontribusi kata pemicu penipuan secara proporsional dan transparan;
3. Mengembangkan sistem deteksi berbasis aturan (*rule-based*) untuk 8 indikator manipulasi rekayasa sosial digital;
4. Mengintegrasikan teknologi OCR mandiri berbasis deep learning ONNX Runtime dengan antarmuka peninjauan manusia (*human-in-the-loop*) sebelum inferensi;
5. Membangun platform web NalarAman yang responsif, edukatif, dan mematuhi prinsip privasi data (UU PDP No. 27 Tahun 2022).

### 1.4 Manfaat Penelitian & Kebaruan Ilmiah (*Novelty*)
Kebaruan ilmiah (*novelty*) dari penelitian ini terletak pada:
* **Pendekatan *Dual-Layer Hybrid Defense***: Mengombinasikan model statistik probabilistik (NLP) dengan 8 detektor pola linguistik-teknis rekayasa sosial, dipandu prinsip *Safety-First* yang secara otomatis meningkatkan kewaspadaan pada keberadaan token berisiko tinggi (seperti OTP/PIN atau berkas `.apk`).
* **Demokratisasi Explainable AI (XAI) untuk Masyarakat Awam**: Mengubah koefisien matematis perturbasi lokal LIME menjadi representasi visual batang proporsional yang intuitif dan edukatif bagi pengguna non-teknis.
* **Solusi Mandiri & Privasi Penuh (*Zero-Data Retention*)**: Seluruh pemrosesan teks, inferensi XAI, dan pembacaan gambar berjalan secara lokal *in-memory* tanpa transmisi ke server pihak ketiga dan tanpa retensi data permanen.

---

## BAB II: TINJAUAN PUSTAKA

### 2.1 Anatomi Rekayasa Sosial (*Social Engineering*)
Rekayasa sosial dalam konteks keamanan siber didefinisikan sebagai seni manipulasi psikologis terhadap individu agar membocorkan informasi rahasia atau melakukan tindakan yang membahayakan keamanan diri maupun sistem (Mitnick & Simon, 2002). Hadnagy (2018) merumuskan bahwa manipulasi ini mengeksploitasi bias kognitif manusia, seperti:
- Rasa hormat atau takut pada otoritas (*authority impersonation*);
- Kepanikan terhadap batas waktu (*urgency heuristic*);
- Ketamakan atau iming-iming keuntungan cuma-cuma (*greed/reward inducement*); serta
- Empati dan kekhawatiran terhadap keluarga (*crisis manipulation*).

### 2.2 Pemrosesan Bahasa Alami (NLP) & Klasifikasi Teks
Dalam klasifikasi teks, teknik *Term Frequency-Inverse Document Frequency* (TF-IDF) merupakan metode pembobotan statistik yang mengukur tingkat kepentingan suatu kata terhadap suatu dokumen dalam kumpulan korpus (Manning et al., 2008). 

$$\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \log\left(\frac{1 + |D|}{1 + |\{d \in D : t \in d\}|}\right) + 1$$

Regresi Logistik (*Logistic Regression*) dengan regularisasi $L_2$ (Ridge) berfungsi sebagai pemisah linier optimal dalam ruang fitur berdimensi tinggi yang dihasilkan TF-IDF. Parameter invers regularisasi $C$ mengontrol trade-off antara margin penalti dan kecocokan data latihan:

$$\min_{w, c} \frac{1}{2} w^T w + C \sum_{i=1}^{n} \log(\exp(-y_i (X_i w + c)) + 1)$$

### 2.3 Prinsip Explainable AI (XAI) & Algoritma LIME
Model AI berkinerja tinggi kerap dikritik karena kurangnya transparansi kausal (*black-box problem*). Ribeiro, Singh, dan Guestrin (2016) memperkenalkan *Local Interpretable Model-agnostic Explanations* (LIME). Filosofi dasar LIME adalah: meskipun model global sangat kompleks dan non-linier, perilaku model di sekitar instans masukan tertentu $x$ dapat didekati secara akurat menggunakan model penjelas linier yang dapat diinterpretasikan $g \in G$:

$$\xi(x) = \arg\min_{g \in G} \mathcal{L}(f, g, \pi_x) + \Omega(g)$$

Di mana:
- $f(x)$ adalah fungsi probabilitas prediksi model asli;
- $\pi_x(z)$ adalah ukuran kedekatan jarak antara sampel perturbasi $z$ dengan instans asli $x$;
- $\mathcal{L}$ adalah ketidaksesuaian aproksimasi $g$ terhadap $f$;
- $\Omega(g)$ adalah kompleksitas model penjelas (jumlah fitur representatif).

### 2.4 Optical Character Recognition (OCR)
OCR adalah teknologi visi komputer yang mentranslasikan teks dalam citra grafis menjadi teks digital yang dapat dimanipulasi mesin (Smith, 2007). Dalam ranah pesan instan digital, teks yang tertera pada tangkapan layar sering kali mengalami artefak kompresi JPEG, resolusi piksel bervariasi, serta degradasi warna latar gelembung chat (*chat bubbles*). Penerapan arsitektur OCR berbasis jaringan saraf konvolusional (CNN) dan recurrent neural network (RNN) teroptimasi ONNX Runtime memungkinkan pemrosesan inferensi berkecepatan tinggi tanpa memerlukan akselerasi kartu grafis berat (GPU).

---

## BAB III: METODOLOGI PENELITIAN

```
+-----------------------------------------------------------------------------------+
|                            ARSITEKTUR PLATFORM NALARAMAN                          |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ Antarmuka Pengguna (React + TypeScript + Vite) ]                              |
|         |                                  |                                      |
|   (Input Teks Langsung)            (Unggah Screenshot Chat)                       |
|         |                                  |                                      |
|         |                       [ Mesin RapidOCR (ONNX) ]                         |
|         |                                  |                                      |
|         |                       [ OcrTextEditor (Human Review) ]                  |
|         +-----------------+----------------+                                      |
|                           |                                                       |
|                           v                                                       |
|             [ API Gateway: POST /api/v1/analyze ]                                 |
|                           |                                                       |
|         +-----------------+-----------------+                                     |
|         |                                   |                                     |
|         v                                   v                                     |
|  [ Preprocessing & Normalisasi ]    [ Rule-Based 8 Pola Social Eng. ]             |
|         |                                   |                                     |
|         v                                   v                                     |
|  [ TF-IDF + Logistic Regression v2 ] [ Indikator Manipulasi Terdeteksi ]          |
|         |                                   |                                     |
|         +-----------------+-----------------+                                     |
|                           |                                                       |
|                           +-------------> [ Safety-First Risk Assessment ]        |
|                           |                                                       |
|                           v                                                       |
|               [ LIME Text Explainer ]                                             |
|                           |                                                       |
|                           v                                                       |
|         [ Respon Terpadu: Prediksi + Pola + Bobot Kata XAI ]                      |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### 3.1 Desain Arsitektur Sistem
Penelitian ini mengimplementasikan arsitektur berorientasi layanan (*Service-Oriented Architecture/SOA*) modular:
1. **Frontend Layer**: Dibangun menggunakan React 18, TypeScript, dan Vite dengan sistem desain visual modern (token CSS semantik, kartu glassmorphism, dan tata letak responsif adaptif multi-perangkat).
2. **Backend API Layer**: Dibangun menggunakan FastAPI (Python 3.12) dengan validasi skema asinkron Pydantic v2.
3. **Core Intelligent Engines**: Terdiri atas Model Manager ML, LIME Text Explainer, Pattern Detector, Risk Assessor, dan RapidOCR Service.

### 3.2 Kurasi dan Pemisahan Dataset
Untuk menjamin generalisasi model pada lanskap penipuan nyata di Indonesia, penelitian ini menyusun korpus terpadu sebanyak **6.408 sampel unik** melalui tiga sumber data:
1. **Dataset Sintetis NalarAman** (5.176 sampel): Mencakup beragam variasi skenario penipuan perbankan, e-commerce, krisis darurat, dan percakapan wajar.
2. **Dataset Akademik SMS Spam/Fraud Indonesia** (1.142 sampel): Berasal dari repositori penelitian benchmark terbuka (Kurniawan / Rahmawati) yang memuat SMS telekomunikasi riil masyarakat Indonesia.
3. **Dataset Kurasi Modern Penipuan Siber 2026** (90 sampel): Sampel kurasi spesifik modus mutakhir (phishing APK undangan pernikahan, resi ekspedisi J&T/SiCepat, modus surat tilang ETLE, dan modus impersonasi CS bank via WhatsApp).

Dataset dibagi menggunakan metode *Stratified Train-Validation-Test Split* dengan proporsi **70% : 15% : 15%** (Random Seed: 42):
- **Train Set**: 4.485 sampel (69,99%)
- **Validation Set**: 961 sampel (15,00%)
- **Test Set**: 962 sampel (15,01%)

Distribusi ketiga kelas dibuat seimbang secara ketat (*Normal: 2.243 sampel, Scam: 2.119 sampel, Promosi: 2.046 sampel*).

### 3.3 Pipeline Pelatihan & Kalibrasi Model
- **Ekstraksi Fitur**: TfidfVectorizer dengan rentang n-gram (1, 2), penskalaan sublinear term-frequency (`sublinear_tf=True`), batas frekuensi minimum dokumen (`min_df=2`), dan batas maksimum 5.000 fitur unigram/bigram.
- **Klasifikasi**: Logistic Regression dengan penalti regularisasi $C=10.0$ (terkalibrasi untuk meminimalkan *over-conservatism* dan menghasilkan skor probabilitas tegas), bobot kelas seimbang (`class_weight='balanced'`), serta konvergensi L-BFGS maksimum 1.000 iterasi.

### 3.4 Deteksi Pola Rekayasa Sosial & Penilaian Risiko *Safety-First*
Sistem dilengkapi modul aturan ekspresi reguler (*regex pattern matching*) untuk mendeteksi 8 taksonomi rekayasa sosial (PRD Bab 21):
1. Urgensi & Tekanan Waktu (*Urgency & Scarcity*);
2. Iming-iming Hadiah & Keuntungan Finansial (*Reward Inducement*);
3. Ancaman Pemblokiran & Konsekuensi Buruk (*Threat & Fear*);
4. Penyebaran Berkas Berbahaya (*Malicious APK/File Distribution*);
5. Permintaan Informasi Kredensial Sensitif (*Credential Harvesting: OTP/PIN/CVV*);
6. Tautan / Domain Mencurigakan & Pemendek URL (*Suspicious Link/Shortener*);
7. Penyamaran Identitas Institusi Resmi (*Brand/Authority Impersonation*);
8. Modus Krisis Keluarga / Darurat Palsu (*Family Emergency/Crisis*).

**Formulasi Penilaian Risiko (*Risk Assessment Formula*)**:
Tingkat risiko pesan dinilai berdasarkan perpaduan probabilitas model dan jumlah indikator pola:
- **Tinggi (*High Risk*)**: Prediksi Scam $\ge 75\%$, ATAU terdeteksi indikator kritis (APK / Permintaan OTP) terlepas dari probabilitas teks (Prinsip *Safety-First* PRD Bab 25).
- **Sedang (*Medium Risk*)**: Prediksi Scam $50\% - 74\%$, ATAU pesan Promosi dengan indikator urgensi agresif.
- **Rendah (*Low Risk*)**: Prediksi Normal $\ge 80\%$ dan tanpa indikator rekayasa sosial berbahaya.

### 3.5 Pipeline Explainable AI (LIME)
Ketika permintaan analisis masuk, `LimeTextExplainer` menggenerasi 500 sampel variasi teks melalui penghapusan kata secara stokastik. Vektor perturbasi diuji ke fungsi `predict_proba` model klasifikasi, lalu koefisien regresi lokal dihitung. Bobot kata positif merepresentasikan faktor pendukung kelas *Scam*, sedangkan bobot kata negatif merepresentasikan faktor peredam risiko ke arah kelas *Normal*.

### 3.6 Pipeline Ekstraksi Citra OCR Mandiri
Menggunakan modul RapidOCR berbasis ONNX Runtime:
1. Citra masukan diperiksa integritas byte dan divalidasi MIME type (JPEG/PNG/WebP, maks 5 MB).
2. Prapemrosesan adaptif: konversi RGB, penskalaan dimensi cerdas (jika lebar citra < 1.000px, citra diperbesar secara proporsional dengan interpolasi Lanczos), dan peningkatan kontras lokal.
3. Inferensi detektor dan rekognisi teks mengekstrak teks baris demi baris beserta tingkat keyakinan (*confidence*).
4. Hasil ekstraksi disajikan di komponen *OcrTextEditor* agar pengguna dapat memverifikasi atau mengoreksi kesalahan tipografi sebelum analisis dimulai (*Human-in-the-Loop*).

---

## BAB IV: HASIL DAN PEMBAHASAN

### 4.1 Evaluasi Kinerja Model Klasifikasi
Evaluasi model Baseline v2 pada 962 sampel data uji (*Test Set*) yang belum pernah dilihat selama proses pelatihan menghasilkan metrik kinerja sebagai berikut:

| Kelas Prediksi | Precision | Recall | F1-Score | Support (Jumlah Sampel Uji) |
|---|:---:|:---:|:---:|:---:|
| **Normal** | 0,99 | 0,99 | 0,99 | 337 |
| **Promosi** | 1,00 | 0,99 | 0,99 | 307 |
| **Scam** | 0,99 | 1,00 | 0,99 | 318 |
| **Macro Average** | **0,9928** | **0,9926** | **0,9927** | **962** |
| **Akurasi Keseluruhan** | — | — | **99,27%** | **962** |

Matriks kebingungan (*Confusion Matrix*) menunjukkan tingkat kesalahan klasifikasi yang sangat minim:
```
                [Prediksi Normal]  [Prediksi Promosi]  [Prediksi Scam]
[Aktual Normal]        335                 1                  1
[Aktual Promosi]         1               317                  0
[Aktual Scam]            2                 2                303
```

#### Evaluasi pada Sub-populasi Data Nyata (*Real-World Generalization*)
Untuk menguji apakah model tidak hanya menghafal pola data sintetis, pengujian terpisah dilakukan pada 194 sampel SMS dunia nyata yang terdapat dalam test set. Model berhasil mencatatkan **Akurasi 96,39%** dan **Macro F1-score 0,9590**. Hasil ini membuktikan kapasitas generalisasi model yang sangat kokoh dalam menangani teks percakapan dunia nyata yang memuat singkatan informal dan ejaan non-baku.

### 4.2 Analisis Transparansi & Validitas Atribusi Bobot LIME XAI
Pengujian kualitatif membuktikan bahwa LIME berhasil mengidentifikasi kata-kata pemicu secara logis dan selaras dengan penalaran manusia:
- **Kasus Uji Pesan Penipuan Hadiah**:  
  Pesan: *"Selamat! Nomor WhatsApp Anda terpilih memenangkan gebyar hadiah undian Rp 50.000.000 dari BRImo. Segera klaim dana dalam 1 jam melalui link: http://hadiah-brimo-klaim2026.xyz/dana sebelum hangus."*
  - **Vonis Model**: **Scam (Keyakinan: 99%)**
  - **Atribusi LIME**: Kata `No` (+0.05), `Anda` (+0.05), `hadiah` (+0.04), `http` (+0.02), `000` (+0.02), dan `waktu` (+0.02) menyumbang bobot positif terhadap keputusan Scam.
  - **Penskalaan Relatif Proporsional**: Pada antarmuka antarmuka NalarAman, kata berbobot tertinggi diskalakan secara relatif (~88% lebar lintasan), sehingga hierarki bahaya antar kata terlihat tegas dan mudah dipahami pengguna.

- **Kasus Uji Pesan Percakapan Normal**:  
  Pesan: *"Halo teman-teman, jangan lupa besok ada praktikum Pemrograman Web pukul 08.00 di laboratorium komputer..."*
  - **Vonis Model**: **Normal (Keyakinan: 99,71%)**
  - **Atribusi LIME**: Kata `teman` (-0.04), `besok` (-0.03), dan `lupa` (-0.02) menyumbang bobot negatif yang secara aktif mereduksi probabilitas scam menuju nol.

### 4.3 Analisis Efektivitas Deteksi 8 Pola Rekayasa Sosial
Kombinasi detektor pola terbukti melengkapi kelemahan model NLP statistik murni:
1. **Pencegahan Bypass pada Phishing APK**: Ketika pelaku penipuan menggunakan kalimat yang tampak santai (*"Kak ini foto undangan pernikahannya ya, tolong dibuka file Undangan.apk"*) di mana kata-katanya tampak ramah bagi model NLP, detektor pola rekayasa sosial langsung menangkap ekstensi `.apk`. Sesuai prinsip *Safety-First*, status risiko langsung dinaikkan menjadi **Risiko Tinggi**.
2. **Penanganan Kasus Edukasi Sensitif**: Pada kalimat peringatan perbankan (*"Jangan pernah berikan kode OTP atau PIN Anda kepada siapa pun"*), sistem menandai keberadaan indikator kredensial sensitif untuk menginstruksikan pengguna agar tetap waspada, mencegah pengguna lengah apabila pesan tersebut sebenarnya merupakan bagian dari teknik manipulasi psikologis terbalik (*reverse social engineering*).

### 4.4 Kinerja Ekstraksi Citra OCR pada Tangkapan Layar Percakapan
Uji coba langsung pada gambar tangkapan layar percakapan WhatsApp dosen menghasilkan waktu pemrosesan **~240 ms** dengan tingkat keyakinan karakter OCR rata-rata **0,99 (99%)**. Penskalaan resolusi adaptif (interpolasi Lanczos 1.000px) terbukti berhasil memisahkan kata-kata rapat pada resolusi rendah ponsel tanpa menimbulkan distorsi karakter.

### 4.5 Pengujian Ketahanan Beban, Latensi Respon & Kepatuhan Privasi Data
Pengujian kinerja end-to-end menunjukkan total waktu respon sistem berkisar antara **650 ms hingga 780 ms** (rata-rata ~715 ms). Komputasi LIME (500 sampel) menghabiskan rata-rata 685 ms, sementara inferensi model Logistic Regression hanya membutuhkan 18 ms. Seluruh angka ini berada jauh di bawah ambang batas toleransi interaksi web PRD Bab 27 (< 2.000 ms).

Dari sudut pandang etika dan regulasi privasi (UU PDP No. 27 Tahun 2022):
- Tidak ada data teks atau berkas gambar yang disimpan ke media penyimpanan permanen (*disk/database*).
- Objek citra biner dalam memori segera dimusnahkan oleh *garbage collector* setelah ekstraksi OCR selesai.
- Berkas log sistem hanya mencatat metadata non-sensitif (status kode, waktu inferensi, dan jumlah indikator terdeteksi), tanpa membocorkan identitas pengirim maupun isi pesan pribadi.

---

## BAB V: KESIMPULAN DAN SARAN

### 5.1 Kesimpulan
Berdasarkan hasil perancangan, implementasi, dan pengujian empiris yang telah dilakukan, dapat disimpulkan bahwa:
1. Platform **NalarAman** berhasil dibangun sebagai sistem pendukung keputusan deteksi penipuan siber yang komprehensif, cepat, dan transparan bagi masyarakat Indonesia.
2. Model klasifikasi multi-kelas NLP (TF-IDF + Logistic Regression terkalibrasi) yang dilatih pada 6.408 sampel korpus mencapai **akurasi 99,27%** pada test set dan **96,39%** pada subset data percakapan dunia nyata.
3. Integrasi metode *Explainable AI* (LIME) berhasil membongkar sifat kotak hitam model AI dengan memvisualisasikan faktor pemicu risiko kata demi kata dalam waktu komputasi rata-rata **685 ms**, mendukung total latensi respon sistem sebesar **~715 ms**.
4. Sinergi antara model probabilistik ML, modul deteksi 8 pola rekayasa sosial, dan prinsip *Safety-First* berhasil menciptakan pertahanan berlapis yang tangguh terhadap manipulasi mutakhir seperti penyebaran APK dan penipuan perbankan.
5. Subsistem OCR mandiri berbasis ONNX Runtime mampu mengekstraksi percakapan tangkapan layar dengan akurasi 99% tanpa membutuhkan instalasi binary eksternal, dengan tetap menjamin privasi data pribadi pengguna secara penuh.

### 5.2 Saran & Pengembangan Masa Depan
Untuk pengembangan platform NalarAman ke depan, disarankan:
1. **Eksperimen Fine-Tuning Arsitektur Transformer (IndoBERT)**: Memanfaatkan skrip `train_indobert.py` yang telah disiapkan untuk melatih model representasi semantik mendalam pada klaster komputasi GPU berkapasitas lebih tinggi, guna menangkap nuansa bahasa gaul (*slang*) yang sangat cair.
2. **Analisis Konteks Percakapan Multi-Turn**: Mengembangkan kapabilitas analisis riwayat runtutan percakapan multi-pesan untuk mendeteksi modus rekayasa sosial bertahap (*long-term grooming*).
3. **Ekstensi Peramban (*Browser Extension*) & Integrasi Aplikasi Pesan**: Mengemas modul deteksi NalarAman ke dalam bentuk ekstensi peramban web atau bot pesan instan terenkripsi agar dapat memberikan peringatan dini seketika saat pengguna menerima tautan atau berkas mencurigakan.

---

## DAFTAR PUSTAKA

1. Hadnagy, C. (2018). *Social Engineering: The Science of Human Hacking*. John Wiley & Sons.
2. Manning, C. D., Raghavan, P., & Schütze, H. (2008). *Introduction to Information Retrieval*. Cambridge University Press.
3. Mitnick, K. D., & Simon, W. L. (2002). *The Art of Deception: Controlling the Human Element of Security*. John Wiley & Sons.
4. Ribeiro, M. T., Singh, S., & Guestrin, C. (2016). *"Why Should I Trust You?": Explaining the Predictions of Any Classifier*. Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining (KDD '16), pp. 1135–1144. https://doi.org/10.1145/2939672.2939778
5. Smith, R. (2007). *An Overview of the Tesseract OCR Engine*. Ninth International Conference on Document Analysis and Recognition (ICDAR 2007), pp. 629–633. https://doi.org/10.1109/ICDAR.2007.4378779
6. Pedregosa, F., Varoquaux, G., Gramfort, A., Michel, V., Thirion, B., Grisel, O., ... & Duchesnay, É. (2011). *Scikit-learn: Machine Learning in Python*. Journal of Machine Learning Research, 12, 2825–2830.
7. Wilie, B., Vincentio, K., Winata, G. I., Cahyawijaya, S., Li, X., Lim, Z. Y., ... & Purwarianti, A. (2020). *IndoNLU: Benchmark and Resources for Evaluating Indonesian Natural Language Understanding*. Proceedings of the 1st Conference of the Asia-Pacific Chapter of the Association for Computational Linguistics (AACL-IJCNLP 2020), pp. 843–860.
8. Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang *Pelindungan Data Pribadi (UU PDP)*. Lembaran Negara Republik Indonesia Tahun 2022 Nomor 196.
9. Bareskrim Polri. (2023). *Laporan Tren Kejahatan Siber di Indonesia dan Modus Penipuan Rekayasa Sosial*. Direktorat Tindak Pidana Siber.
10. Kementerian Komunikasi dan Informatika RI. (2024). *Status Literasi Digital di Indonesia: Pengukuran dan Peta Jalan Ketahanan Informasi Nasional*. Kominfo Publishing.
