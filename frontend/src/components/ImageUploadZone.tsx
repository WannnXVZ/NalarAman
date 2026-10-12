import React, { useState, useRef } from 'react';

interface ImageUploadZoneProps {
  onImageSelected: (file: File) => void;
  onExtract: (file: File) => void;
  isExtracting: boolean;
  selectedFile: File | null;
  onClear: () => void;
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  onImageSelected,
  onExtract,
  isExtracting,
  selectedFile,
  onClear,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE_MB = 5;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  const handleFile = (file: File) => {
    setErrorMessage(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage('Format berkas tidak didukung. Harap pilih gambar format JPG, PNG, atau WebP.');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`Ukuran gambar terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Batas maksimum adalah 5 MB.`);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onImageSelected(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear();
  };

  return (
    <div className="image-upload-wrapper card">
      <div className="upload-header">
        <div className="upload-title-row">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <h3 className="upload-title">Analisis Screenshot Percakapan (OCR)</h3>
          <span className="badge-ocr">Tahap Lanjutan</span>
        </div>
        <p className="upload-desc">
          Unggah tangkapan layar chat (WhatsApp, SMS, Bukti Transfer) untuk diekstraksi teksnya secara otomatis menggunakan model AI RapidOCR.
        </p>
      </div>

      {errorMessage && (
        <div className="error-alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {!selectedFile ? (
        <div
          className={`dropzone ${isDragOver ? 'drag-over' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            style={{ display: 'none' }}
            onChange={handleInputChange}
          />
          <div className="dropzone-content">
            <div className="dropzone-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="dropzone-text">
              <strong>Klik untuk memilih gambar</strong> atau seret tangkapan layar ke area ini
            </p>
            <p className="dropzone-hint">Mendukung format PNG, JPG, WebP (Maksimum 5 MB)</p>
          </div>
        </div>
      ) : (
        <div className="preview-container">
          <div className="preview-card">
            {previewUrl && (
              <img src={previewUrl} alt="Preview Screenshot" className="preview-image" />
            )}
            <div className="preview-info">
              <div className="file-meta">
                <span className="file-name">{selectedFile.name}</span>
                <span className="file-size">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
              <div className="preview-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleClear}
                  disabled={isExtracting}
                >
                  Ganti Gambar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => onExtract(selectedFile)}
                  disabled={isExtracting}
                >
                  {isExtracting ? (
                    <>
                      <span className="spinner-sm" />
                      Mengekstraksi Teks (OCR)...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="4 7 4 4 20 4 20 7" />
                        <line x1="9" y1="20" x2="15" y2="20" />
                        <line x1="12" y1="4" x2="12" y2="20" />
                      </svg>
                      Ekstraksi Teks via OCR
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="privacy-callout">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>
          <strong>Privasi Terjamin (PRD Bab 26):</strong> Gambar Anda hanya diproses di memori RAM sementara untuk ekstraksi teks OCR dan segera dihapus setelah selesai. Gambar tidak disimpan permanen di server.
        </span>
      </div>

      <style>{`
        .image-upload-wrapper {
          margin-bottom: var(--space-6);
        }

        .upload-header {
          margin-bottom: var(--space-4);
        }

        .upload-title-row {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-1);
        }

        .upload-title {
          font-size: var(--font-base);
          font-weight: 700;
          color: var(--text-primary);
        }

        .badge-ocr {
          font-size: 0.7rem;
          padding: 2px 8px;
          background: #EDE9FE;
          color: var(--primary);
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .upload-desc {
          font-size: var(--font-sm);
          color: var(--text-secondary);
        }

        .dropzone {
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-lg);
          padding: var(--space-8);
          text-align: center;
          cursor: pointer;
          transition: all var(--transition-fast);
          background: #FAFAFC;
        }

        .dropzone:hover, .dropzone.drag-over {
          border-color: var(--primary);
          background: #F5F3FF;
        }

        .dropzone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
        }

        .dropzone-icon {
          color: var(--primary);
          margin-bottom: var(--space-2);
        }

        .dropzone-text {
          font-size: var(--font-sm);
          color: var(--text-primary);
        }

        .dropzone-hint {
          font-size: var(--font-xs);
          color: var(--text-muted);
        }

        .preview-container {
          margin-bottom: var(--space-3);
        }

        .preview-card {
          display: flex;
          gap: var(--space-4);
          align-items: center;
          padding: var(--space-4);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: #FAF5FF;
        }

        .preview-image {
          width: 110px;
          height: 110px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          border: 1px solid #E9D5FF;
        }

        .preview-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .file-meta {
          display: flex;
          flex-direction: column;
        }

        .file-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: var(--font-sm);
          word-break: break-all;
        }

        .file-size {
          font-size: var(--font-xs);
          color: var(--text-muted);
        }

        .preview-actions {
          display: flex;
          gap: var(--space-3);
          align-items: center;
        }

        .error-alert {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          background: var(--risk-high-bg);
          color: var(--risk-high);
          border: 1px solid var(--risk-high-border);
          border-radius: var(--radius-md);
          font-size: var(--font-sm);
          margin-bottom: var(--space-3);
        }

        .privacy-callout {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          margin-top: var(--space-4);
          padding: var(--space-3) var(--space-4);
          background: #F8FAFC;
          border-radius: var(--radius-md);
          font-size: var(--font-xs);
          color: var(--text-secondary);
          border-left: 3px solid var(--primary);
        }

        .spinner-sm {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: #FFFFFF;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .preview-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .preview-image {
            width: 100%;
            height: 160px;
          }
          .preview-actions {
            width: 100%;
            flex-direction: column;
          }
          .preview-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
