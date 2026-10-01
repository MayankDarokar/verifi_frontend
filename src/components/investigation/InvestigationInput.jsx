import React, { useState, useEffect } from 'react';
import { MessageSquare, Link as LinkIcon, QrCode, Upload, ShieldCheck, X, FileImage } from 'lucide-react';
import { validateTextInput, validateUrl, validateQrFile } from '../../utils/validators';

export function InvestigationInput({
  inputType,
  setInputType,
  textInput,
  setTextInput,
  urlInput,
  setUrlInput,
  qrFile,
  setQrFile,
  qrPreviewUrl,
  setQrPreviewUrl,
  onRunInvestigation,
  isLoading,
  onInputChange,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setValidationError('');
  }, [textInput, urlInput, qrFile, inputType]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleQrSelection(e.dataTransfer.files[0]);
    }
  };

  const handleQrSelection = (file) => {
    const check = validateQrFile(file);
    if (!check.valid) {
      setValidationError(check.error);
      return;
    }
    setQrFile(file);
    const preview = URL.createObjectURL(file);
    setQrPreviewUrl(preview);
    if (onInputChange) onInputChange();
  };

  const handleClearQr = () => {
    setQrFile(null);
    if (qrPreviewUrl) {
      URL.revokeObjectURL(qrPreviewUrl);
      setQrPreviewUrl(null);
    }
    if (onInputChange) onInputChange();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputType === 'text') {
      if (!validateTextInput(textInput)) {
        setValidationError('Please enter a message of at least 3 characters.');
        return;
      }
    } else if (inputType === 'url') {
      if (!validateUrl(urlInput)) {
        setValidationError('Please enter a valid website or payment URL (e.g., https://example.com).');
        return;
      }
    } else if (inputType === 'qr') {
      if (!qrFile) {
        setValidationError('Please upload a valid QR code image (PNG, JPG, WebP under 10 MB).');
        return;
      }
    }

    onRunInvestigation();
  };

  return (
    <div className="rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-5 sm:p-7 shadow-sm transition-colors mb-6">
      {/* Workspace Header */}
      <div className="mb-5">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
          Investigation Workspace
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Submit any suspicious message, URL link, or QR payment trigger to inspect the underlying financial payload.
        </p>
      </div>

      {/* Input Mode Tabs */}
      <div className="flex items-center gap-2 mb-5 border-b border-slate-200 dark:border-white/10 pb-3">
        <button
          type="button"
          onClick={() => { setInputType('text'); if (onInputChange) onInputChange(); }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            inputType === 'text'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Text / Message</span>
        </button>

        <button
          type="button"
          onClick={() => { setInputType('url'); if (onInputChange) onInputChange(); }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            inputType === 'url'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Link / URL</span>
        </button>

        <button
          type="button"
          onClick={() => { setInputType('qr'); if (onInputChange) onInputChange(); }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            inputType === 'qr'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>QR Code Image</span>
        </button>
      </div>

      {/* Input Body */}
      <form onSubmit={handleSubmit}>
        {inputType === 'text' && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="investigation-message-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Message Content or Payment Request
              </label>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                {textInput.length} characters
              </span>
            </div>
            <textarea
              id="investigation-message-input"
              rows={4}
              value={textInput}
              onChange={(e) => {
                setTextInput(e.target.value);
                if (onInputChange) onInputChange();
              }}
              placeholder="Paste SMS, WhatsApp message, Telegram offer, or payment request..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
        )}

        {inputType === 'url' && (
          <div className="space-y-1.5">
            <label htmlFor="investigation-url-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Suspicious Website or Payment Link
            </label>
            <input
              id="investigation-url-input"
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                if (onInputChange) onInputChange();
              }}
              placeholder="e.g., https://bses-bill-update.xyz/pay or https://kbc-lucky-winner-draw-2026.online"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
        )}

        {inputType === 'qr' && (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Upload QR Code Image (Max 10 MB)
            </label>

            {!qrFile ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all cursor-pointer ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                    : 'border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#090d16] hover:border-slate-400 dark:hover:border-white/25'
                }`}
                onClick={() => document.getElementById('qr-upload-input').click()}
              >
                <input
                  id="qr-upload-input"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleQrSelection(e.target.files[0])}
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Click to upload image</span>
                    <span className="text-slate-500 dark:text-slate-400"> or drag and drop</span>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    PNG, JPG, JPEG, WebP • Under 10 MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-white/10">
                {qrPreviewUrl && (
                  <img
                    src={qrPreviewUrl}
                    alt="QR Preview"
                    className="w-14 h-14 object-contain rounded border border-slate-200 dark:border-white/10 bg-white"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <FileImage className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {qrFile.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {(qrFile.size / 1024).toFixed(1)} KB • Ready for payload inspection
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClearQr}
                  className="p-1.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Validation Error */}
        {validationError && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400 text-xs font-semibold">
            {validationError}
          </div>
        )}

        {/* Primary Action Button */}
        <div className="mt-5">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? 'Investigating Evidence & Payment Payload...' : 'Run VeriFi Deep Investigation'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
