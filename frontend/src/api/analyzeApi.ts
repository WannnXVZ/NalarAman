import type { AnalyzeResponse, HealthResponse, ApiError } from '../types/analysis';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export class ApiException extends Error {
  errorCode: ApiError['error_code'];
  detail?: unknown;

  constructor(message: string, errorCode: ApiError['error_code'] = 'INTERNAL_ERROR', detail?: unknown) {
    super(message);
    this.name = 'ApiException';
    this.errorCode = errorCode;
    this.detail = detail;
  }
}

/**
 * Memeriksa status kesehatan backend FastAPI dan komponen model
 */
export async function checkBackendHealth(): Promise<HealthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(4000),
    });

    if (!response.ok) {
      throw new ApiException(`Health check gagal dengan status ${response.status}`, 'NETWORK_ERROR');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiException) throw error;
    throw new ApiException('Koneksi ke backend FastAPI tidak tersedia.', 'NETWORK_ERROR', error);
  }
}

/**
 * Mengirim permintaan analisis teks ke backend
 */
export async function analyzeText(text: string): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ text }),
    signal: AbortSignal.timeout(15000),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorCode = data?.error_code || (response.status === 503 ? 'MODEL_UNAVAILABLE' : 'INTERNAL_ERROR');
    const message = data?.message || `Gagal menganalisis pesan (HTTP ${response.status})`;
    throw new ApiException(message, errorCode, data?.detail);
  }

  return data as AnalyzeResponse;
}

/**
 * Mock data untuk pengujian antarmuka (UI Testing & Demo State)
 * Sesuai PRD Bab 30: Seluruh mock data wajib diberi penanda visual eksplisit 'is_mock: true'
 */
export const SAMPLE_PRESETS = [
  {
    title: 'Penipuan Hadiah & Undian',
    tag: 'Scam Tinggi',
    text: 'Selamat! No WhatsApp Anda memenangkan GEBYAR UNDIAN Rp 50.000.000 dari BRImo. Segera klaim dana Anda dalam batas waktu 1 jam sebelum hangus melalui link: http://hadiah-brimo-klaim2026.xyz/dana',
  },
  {
    title: 'Modus Undangan Pernikahan APK',
    tag: 'Scam Tinggi',
    text: 'Kepada Bpk/Ibu, kami mengundang Anda ke resepsi pernikahan kami. Mohon instal dan buka surat undangan digital di tautan berkas berikut: Undangan_Resepsi_Vip.apk. Mohon konfirmasi kehadirannya ya.',
  },
  {
    title: 'Promosi E-commerce Resmi',
    tag: 'Promosi',
    text: 'Flash Sale Tokopedia! Diskon gadget hingga 70% hanya hari ini mulai pukul 12.00 WIB. Dapatkan cashback ekstra dengan belanja di aplikasi resmi Tokopedia sekarang. S&K berlaku.',
  },
  {
    title: 'Pesan Keluarga / Normal',
    tag: 'Normal',
    text: 'Halo Budi, besok acara arisan keluarga jam 10 pagi di rumah Tante Rini ya. Jangan lupa bawa titipan buku kemarin. Terima kasih.',
  },
];

export function getMockResponseForScenario(scenario: 'scam' | 'promo' | 'normal' | 'lime_fail'): AnalyzeResponse {
  if (scenario === 'scam') {
    return {
      request_status: 'success',
      is_mock: true,
      classification: {
        label: 'Scam',
        confidence: 0.96,
      },
      social_engineering_indicators: [
        {
          indicator: 'Urgensi & Tekanan Waktu',
          description: 'Pesan membatasi waktu bertindak ("dalam batas waktu 1 jam sebelum hangus") untuk memicu kepanikan/ketergesaan.',
          basis: 'rule-based (regex & keyword heuristic)',
        },
        {
          indicator: 'Iming-iming Hadiah Tidak Wajar',
          description: 'Menjanjikan uang tunai Rp 50.000.000 tanpa keikutsertaan kompetisi yang valid.',
          basis: 'rule-based (lexicon)',
        },
        {
          indicator: 'Tautan / Domain Mencurigakan',
          description: 'Menggunakan domain ".xyz" yang meniru identitas resmi perbankan.',
          basis: 'rule-based (domain entropy analysis)',
        },
      ],
      risk_assessment: {
        level: 'tinggi',
        basis: 'Klasifikasi Scam dengan 3 indikator manipulasi psikologis tingkat tinggi (urgensi, hadiah fiktif, tautan palsu).',
      },
      explanation: {
        method: 'LIME',
        available: true,
        computation_time_ms: 184,
        contributions: [
          { token: 'hadiah-brimo', weight: 0.48, direction: 'mendukung_scam' },
          { token: 'klaim', weight: 0.36, direction: 'mendukung_scam' },
          { token: 'segera', weight: 0.28, direction: 'mendukung_scam' },
          { token: 'hangus', weight: 0.22, direction: 'mendukung_scam' },
          { token: 'WhatsApp', weight: -0.05, direction: 'menurunkan_skor_scam' },
        ],
      },
      warnings: [
        'Hasil ini adalah estimasi berbasis model AI untuk keperluan analisis awal, bukan verifikasi mutlak.',
        'Jangan pernah mentransfer biaya administrasi atau memasukkan password/PIN pada situs yang tidak terverifikasi.',
      ],
    };
  }

  if (scenario === 'promo') {
    return {
      request_status: 'success',
      is_mock: true,
      classification: {
        label: 'Promosi',
        confidence: 0.91,
      },
      social_engineering_indicators: [
        {
          indicator: 'Tawaran Diskon Terbatas',
          description: 'Menawarkan promosi musiman dengan syarat & ketentuan tertentu dari platform e-commerce.',
          basis: 'rule-based',
        },
      ],
      risk_assessment: {
        level: 'rendah',
        basis: 'Terdeteksi sebagai materi pemasaran komersial tanpa permintaan kredensial sensitif atau domain palsu.',
      },
      explanation: {
        method: 'LIME',
        available: true,
        computation_time_ms: 142,
        contributions: [
          { token: 'Flash', weight: 0.42, direction: 'mendukung_scam' },
          { token: 'Diskon', weight: 0.35, direction: 'mendukung_scam' },
          { token: 'Tokopedia', weight: -0.45, direction: 'menurunkan_skor_scam' },
          { token: 'resmi', weight: -0.22, direction: 'menurunkan_skor_scam' },
        ],
      },
      warnings: [
        'Pastikan transaksi jual beli selalu dilakukan di dalam aplikasi resmi terpercaya.',
      ],
    };
  }

  if (scenario === 'lime_fail') {
    return {
      request_status: 'success',
      is_mock: true,
      classification: {
        label: 'Scam',
        confidence: 0.88,
      },
      social_engineering_indicators: [
        {
          indicator: 'Pengiriman Berkas APK Tidak Dikenal',
          description: 'Menyertakan file instalasi aplikasi Android (.apk) yang berpotensi malware pencuri SMS/OTP.',
          basis: 'rule-based',
        },
      ],
      risk_assessment: {
        level: 'tinggi',
        basis: 'Indikator berkas APK mencurigakan berisiko mengambil alih kredensial perangkat.',
      },
      explanation: {
        method: 'LIME',
        available: false,
        reason: 'Modul komputasi XAI LIME mengalami timeout atau keterbatasan sumber daya komputasi lokal.',
        contributions: [],
      },
      warnings: [
        'Jangan pernah menginstal file berekstensi .apk yang dikirim dari kontak tidak dikenal.',
      ],
    };
  }

  // scenario === 'normal'
  return {
    request_status: 'success',
    is_mock: true,
    classification: {
      label: 'Normal',
      confidence: 0.95,
    },
    social_engineering_indicators: [],
    risk_assessment: {
      level: 'rendah',
      basis: 'Pola percakapan wajar tanpa indikator tekanan psikologis, tautan mencurigakan, atau iming-iming hadiah.',
    },
    explanation: {
      method: 'LIME',
      available: true,
      computation_time_ms: 120,
      contributions: [
        { token: 'keluarga', weight: -0.38, direction: 'menurunkan_skor_scam' },
        { token: 'arisan', weight: -0.29, direction: 'menurunkan_skor_scam' },
        { token: 'titipan', weight: -0.21, direction: 'menurunkan_skor_scam' },
      ],
    },
    warnings: [
      'Pesan tergolong komunikasi wajar. Tetap berhati-hati jika di kemudian hari lawan bicara meminta kode rahasia atau transfer tak terduga.',
    ],
  };
}

/**
 * Mengunggah file screenshot chat dan mengekstrak teks via Tesseract OCR (PRD Bab 17.3 & 24)
 */
export async function uploadAndExtractImage(file: File): Promise<import('../types/analysis').OcrResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/analyze-image`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(15000), // Batas waktu 15 detik untuk OCR
    });

    if (!response.ok) {
      let errJson: any = null;
      try {
        errJson = await response.json();
      } catch {
        // Abaikan parse error
      }
      const message = errJson?.message || `Ekstraksi OCR gagal (${response.status})`;
      const errorCode = errJson?.error_code || (response.status === 422 ? 'OCR_FAILED' : 'INTERNAL_ERROR');
      throw new ApiException(message, errorCode, errJson?.detail);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiException) throw error;
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new ApiException('Waktu pemrosesan OCR gambar habis (timeout 15 detik).', 'NETWORK_ERROR');
    }
    throw new ApiException('Gagal menghubungi endpoint OCR backend.', 'NETWORK_ERROR', error);
  }
}

