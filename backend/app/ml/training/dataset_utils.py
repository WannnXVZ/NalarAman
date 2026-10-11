import os
import pandas as pd
from sklearn.model_selection import train_test_split
from app.services.preprocessing import normalize_text

BASE_DIR = os.path.dirname(__file__)
DATA_RAW_DIR = os.path.join(BASE_DIR, "../../../data/raw")
PROCESSED_DATA_DIR = os.path.join(BASE_DIR, "../../../data/processed")
USER_DATATRAINING_DIR = os.path.join(BASE_DIR, "../../../../datatraining")

def build_combined_curated_dataset() -> pd.DataFrame:
    """
    Menggabungkan dan mengurasi dataset dari 3 sumber:
    1. Dataset Sintetis NalarAman (5.176 sampel) dari folder user 'datatraining/'
    2. Dataset Akademik SMS Spam/Fraud Indonesia (Kurniawan / Open NLP benchmark, 1.143 sampel)
    3. Dataset Kurasi Nyata NalarAman Pesan Modern / APK Phishing (90 sampel)
    Total ~6.400+ sampel dengan label seimbang (Normal, Scam, Promosi).
    """
    records = []

    # 1. Dataset Sintetis User
    synth_csv = os.path.join(USER_DATATRAINING_DIR, "NalarAman_Dataset_Sintetis.csv")
    if os.path.exists(synth_csv):
        df_synth = pd.read_csv(synth_csv)
        for _, row in df_synth.iterrows():
            records.append({
                "id": str(row.get("id", f"SYN-{len(records):05d}")),
                "text": str(row.get("teks_pesan", "")),
                "label": str(row.get("label", "")).strip(),
                "sumber": "sintetis_template",
                "tipe_data": "sintetis"
            })
        print(f"[Dataset] Berhasil memuat {len(df_synth)} sampel sintetis dari datatraining/")
    else:
        print(f"[Dataset] Peringatan: {synth_csv} tidak ditemukan.")

    # 2. Dataset Akademik SMS Spam Indonesia (Kurniawan / Rahmawati)
    sms_csv = os.path.join(DATA_RAW_DIR, "dataset_sms_spam_v1.csv")
    if os.path.exists(sms_csv):
        df_sms = pd.read_csv(sms_csv)
        lbl_map = {0: "Normal", 1: "Scam", 2: "Promosi"}
        count_sms = 0
        for idx, row in df_sms.iterrows():
            lbl_raw = row.get("label")
            mapped_lbl = lbl_map.get(lbl_raw, None)
            if mapped_lbl:
                records.append({
                    "id": f"SMS-{idx+1:05d}",
                    "text": str(row.get("Teks", "")),
                    "label": mapped_lbl,
                    "sumber": "sms_kurniawan_academic",
                    "tipe_data": "nyata"
                })
                count_sms += 1
        print(f"[Dataset] Berhasil memuat {count_sms} sampel nyata dari benchmark akademik SMS.")

    # 3. Dataset Kurasi Nyata NalarAman (Modern WhatsApp, APK, Phishing)
    curated_csv = os.path.join(DATA_RAW_DIR, "dataset_messages.csv")
    if os.path.exists(curated_csv):
        df_curated = pd.read_csv(curated_csv)
        count_cur = 0
        for idx, row in df_curated.iterrows():
            records.append({
                "id": f"CUR-{idx+1:05d}",
                "text": str(row.get("text", "")),
                "label": str(row.get("label", "")).strip(),
                "sumber": "nalaraman_curated_modern",
                "tipe_data": "nyata"
            })
            count_cur += 1
        print(f"[Dataset] Berhasil memuat {count_cur} sampel nyata kurasi modern NalarAman.")

    df = pd.DataFrame(records)

    # Validasi & Pembersihan
    df = df.dropna(subset=["text", "label"])
    df["text"] = df["text"].astype(str).str.strip()
    df = df[df["text"].str.len() > 3]
    df = df[df["label"].isin(["Normal", "Scam", "Promosi"])]

    # Hapus duplikasi persis teks
    initial_len = len(df)
    df = df.drop_duplicates(subset=["text"]).reset_index(drop=True)
    dedup_removed = initial_len - len(df)
    print(f"[Dataset] Dedup selesai: {dedup_removed} duplikat dibuang. Total bersih: {len(df)} sampel.")

    # Normalisasi teks untuk fitur ML
    df["clean_text"] = df["text"].apply(normalize_text)

    # Simpan dataset mentah gabungan
    os.makedirs(DATA_RAW_DIR, exist_ok=True)
    combined_raw_path = os.path.join(DATA_RAW_DIR, "dataset_combined_curated.csv")
    df.to_csv(combined_raw_path, index=False)
    print(f"[Dataset] Dataset gabungan disimpan ke: {combined_raw_path}")

    print("\nDistribusi Label Akhir:")
    print(df["label"].value_counts())
    print("\nDistribusi Tipe Data:")
    print(df["tipe_data"].value_counts())

    return df

def split_and_save_data(df: pd.DataFrame, processed_dir: str = PROCESSED_DATA_DIR, seed: int = 42):
    """
    Membagi dataset menjadi Train (70%), Validation (15%), dan Test (15%)
    secara stratified berdasarkan label kelas untuk mencegah ketimpangan data (PRD Bab 18.1).
    """
    os.makedirs(processed_dir, exist_ok=True)

    # Split 1: 70% Train, 30% Temp (Val + Test)
    train_df, temp_df = train_test_split(
        df, test_size=0.30, random_state=seed, stratify=df["label"]
    )

    # Split 2: 50% dari Temp untuk Val (15%), 50% untuk Test (15%)
    val_df, test_df = train_test_split(
        temp_df, test_size=0.50, random_state=seed, stratify=temp_df["label"]
    )

    train_df.to_csv(os.path.join(processed_dir, "train.csv"), index=False)
    val_df.to_csv(os.path.join(processed_dir, "val.csv"), index=False)
    test_df.to_csv(os.path.join(processed_dir, "test.csv"), index=False)

    print(f"\nStratified Split Selesai (Random Seed: {seed}):")
    print(f"- Train set : {len(train_df)} sampel ({len(train_df)/len(df)*100:.1f}%)")
    print(f"- Val set   : {len(val_df)} sampel ({len(val_df)/len(df)*100:.1f}%)")
    print(f"- Test set  : {len(test_df)} sampel ({len(test_df)/len(df)*100:.1f}%)")

    # Evaluasi proporsi data nyata di test set
    real_in_test = (test_df["tipe_data"] == "nyata").sum()
    print(f"- Data Nyata dalam Test set: {real_in_test} sampel ({real_in_test/len(test_df)*100:.1f}%)")

    return train_df, val_df, test_df

if __name__ == "__main__":
    df = build_combined_curated_dataset()
    split_and_save_data(df)

