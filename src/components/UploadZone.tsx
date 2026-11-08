import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { ShieldCheck, Plus, Upload } from 'lucide-react';
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

  const handlePaste = useEffectEvent((event: ClipboardEvent) => {
    if (disabled || event.defaultPrevented || !event.clipboardData?.files.length) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.matches('input, textarea, select') || target.isContentEditable)) return;
    event.preventDefault();
    receive(Array.from(event.clipboardData.files));
  });

  useEffect(() => {
    // One listener handles both focused and page-wide paste with current files.
    const handleGlobalPaste = (event: ClipboardEvent) => handlePaste(event);
    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, []);

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
        aria-label="File upload"
        onKeyDown={(e) => {
          if (
            e.target === e.currentTarget &&
            (e.key === 'Enter' || e.key === ' ')
          ) {
            e.preventDefault();
            ref.current?.click();
          }
        }}
        onDragEnter={(e) => {
          if (disabled || !e.dataTransfer.types.includes('Files')) return;
          e.preventDefault();
          depth.current++;
          setDrag(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault();
          depth.current = Math.max(0, depth.current - 1);
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
        <h3>{multiple ? 'Drop files here' : 'Drop a file here'}</h3>
        <Button disabled={disabled} onClick={() => ref.current?.click()}>
          {compact && <Plus size={16} aria-hidden="true" />}
          {compact ? (multiple ? 'Add files' : 'Replace file') : (multiple ? 'Choose files' : 'Choose file')}
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
        <small>{label}{maxFiles && maxFiles > 1 ? ' · Up to ' + maxFiles + ' per batch' : ''}</small>
        {!compact && <p className="upload-paste">You can also paste a file from your clipboard.</p>}
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
