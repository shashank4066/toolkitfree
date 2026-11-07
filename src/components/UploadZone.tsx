import { useEffect, useRef, useState } from 'react';
import { Upload, ShieldCheck, Plus } from 'lucide-react';
import { Button } from './ui/button';

export function UploadZone({
  accept,
  multiple = false,
  onFiles,
  disabled = false,
  compact = false,
  label = 'PDF files',
  maxFiles,
}: {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  compact?: boolean;
  label?: string;
  maxFiles?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const depth = useRef(0);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState('');

  function receive(files: File[]) {
    if (disabled || !files.length) return;
    const patterns = accept.split(',').map((x) => x.trim().toLowerCase());
    const valid = files.filter((file) =>
      patterns.some((p) =>
        p.startsWith('.')
          ? file.name.toLowerCase().endsWith(p)
          : p.endsWith('/*')
            ? file.type.startsWith(p.slice(0, -1))
            : file.type === p
      )
    );
    if (valid.length !== files.length) {
      setError('Please choose ' + label + '. Unsupported files were skipped.');
    } else {
      setError('');
    }
    if (maxFiles && valid.length > maxFiles) {
      setError(
        'Choose up to ' +
          maxFiles +
          ' files in one batch. You can start another batch immediately.'
      );
      return;
    }
    if (valid.some((file) => !file.size)) {
      setError('One of these files is empty. Please choose a file with content.');
      return;
    }
    if (valid.length) onFiles(multiple ? valid : valid.slice(0, 1));
  }

  useEffect(() => {
    function handleGlobalPaste(e: ClipboardEvent) {
      if (disabled) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        e.preventDefault();
        receive(Array.from(e.clipboardData.files));
      }
    }

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [disabled, accept, multiple, maxFiles]);

  return (
    <>
      <div
        className={
          'upload-zone' +
          (drag ? ' drag-active' : '') +
          (compact ? ' compact' : '')
        }
        tabIndex={disabled ? -1 : 0}
        role="group"
        aria-label="File upload. You can also paste a file here with Ctrl+V."
        onKeyDown={(e) => {
          if (
            e.target === e.currentTarget &&
            (e.key === 'Enter' || e.key === ' ')
          ) {
            e.preventDefault();
            ref.current?.click();
          }
        }}
        onPaste={(e) => {
          if (e.clipboardData.files.length) {
            e.preventDefault();
            receive(Array.from(e.clipboardData.files));
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          depth.current++;
          setDrag(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault();
          depth.current--;
          if (depth.current <= 0) setDrag(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          depth.current = 0;
          setDrag(false);
          receive(Array.from(e.dataTransfer.files));
        }}
      >
        <div className="upload-icon">
          <Upload size={26} />
        </div>
        <h3>Drop your files here</h3>
        <p>
          {compact
            ? 'Add more files to your workspace'
            : 'or choose them from your device'}
        </p>
        <Button disabled={disabled} onClick={() => ref.current?.click()}>
          {compact ? <Plus size={16} /> : <Upload size={16} />}
          Choose {multiple ? 'files' : 'file'}
        </Button>
        <input
          ref={ref}
          type="file"
          aria-label="Choose files"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          hidden
          onChange={(e) => {
            receive(Array.from(e.target.files || []));
            e.target.value = '';
          }}
        />
        <small>
          {label}
          {maxFiles ? ' · Up to ' + maxFiles + ' per batch' : ''} · Paste anywhere
          with Ctrl+V
        </small>
      </div>
      <p className="privacy-note">
        <ShieldCheck />
        Your files never leave your device. Processed securely in your browser.
      </p>
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
    </>
  );
}
