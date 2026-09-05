import { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ImageUploadInput({ value, onChange, label, placeholder = 'https://...' }: ImageUploadInputProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [inputError, setInputError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      setInputError('Only JPG, PNG, WEBP, and GIF images are supported. SVG/executable files are prohibited.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setInputError('File size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onChange(dataUrl);
      }
    };
    reader.onerror = () => {
      setInputError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  }

  function handleUrlChange(url: string) {
    setInputError('');
    const trimmed = url.trim();
    if (trimmed && !trimmed.startsWith('https://') && !trimmed.startsWith('http://') && !trimmed.startsWith('/') && !trimmed.startsWith('data:image/')) {
      setInputError('Please enter a valid secure URL starting with https://');
      onChange(trimmed);
      return;
    }
    onChange(trimmed);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
        <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-semibold ml-auto">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              mode === 'upload' ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload size={11} className="inline mr-1" /> Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              mode === 'url' ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <LinkIcon size={11} className="inline mr-1" /> Image URL
          </button>
        </div>
      </div>

      {inputError && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
          {inputError}
        </div>
      )}

      {mode === 'upload' ? (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 hover:border-green-500 bg-gray-50/60 hover:bg-green-50/20 rounded-xl p-3 text-center cursor-pointer transition-all"
          >
            {value ? (
              <div className="relative group w-full flex items-center justify-between p-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img src={value} alt="Preview" className="w-12 h-12 object-cover rounded-md flex-shrink-0 bg-gray-100 border border-gray-200" />
                  <div className="text-left min-w-0">
                    <div className="text-xs font-bold text-gray-800 truncate">
                      {value.startsWith('data:') ? 'Uploaded Image Ready' : 'Selected Image'}
                    </div>
                    <div className="text-[10px] text-green-600 font-medium">Click box to change file</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange('');
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors flex-shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-1.5 py-3 text-gray-500">
                <div className="w-9 h-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <Upload size={18} />
                </div>
                <span className="text-xs font-bold text-gray-700">Click to upload image file from computer</span>
                <span className="text-[10px] text-gray-400">Supports PNG, JPG, WEBP, GIF (Max 5MB)</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="url"
              value={value}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="input-field pl-8 text-xs"
              placeholder={placeholder}
            />
          </div>
          {value && (
            <div className="rounded-lg overflow-hidden h-20 bg-gray-100 border border-gray-200">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
