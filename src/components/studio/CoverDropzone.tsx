"use client";

import { useEffect, useId, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";

const MAX_MB = 5;

type Props = { label?: string; initialUrl?: string; onChange?: (url: string | null) => void };

/**
 * Cover image picker: drag-and-drop or browse. Previews locally with
 * URL.createObjectURL — nothing is uploaded in the demo.
 * BACKEND: request a signed upload URL (POST /api/uploads) and PUT the file; store the returned asset URL.
 */
export function CoverDropzone({ label = "Cover image", initialUrl, onChange }: Props) {
  const id = useId();
  const [preview, setPreview] = useState<{ url: string; isObjectUrl: boolean; name: string } | null>(
    initialUrl ? { url: initialUrl, isObjectUrl: false, name: initialUrl.split("/").pop() ?? "" } : null,
  );
  const [isOver, setIsOver] = useState(false);
  const [error, setError] = useState<string>();

  // Free the object URL when it is replaced or the component unmounts.
  useEffect(() => {
    return () => {
      if (preview?.isObjectUrl) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  function accept(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image (JPG, PNG or WebP).");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Images must be under ${MAX_MB} MB.`);
      return;
    }
    setError(undefined);
    const url = URL.createObjectURL(file);
    setPreview({ url, isObjectUrl: true, name: file.name });
    onChange?.(url);
  }

  function handleDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsOver(false);
    accept(e.dataTransfer.files[0]);
  }

  return (
    <div>
      <p className="text-sm font-semibold" id={`${id}-label`}>
        {label}
      </p>
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={handleDrop}
        className={`mt-1.5 flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-md border-2 border-dashed p-4 text-center transition-colors duration-[var(--dur-fast)] ${
          isOver ? "border-brand bg-brand-soft" : "border-line-strong bg-bg-alt/50 hover:border-brand"
        }`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob preview, not an optimisable asset
          <img src={preview.url} alt="Cover preview" className="aspect-[16/10] w-full rounded-sm object-cover" />
        ) : (
          <span className="grid aspect-[16/10] w-full place-items-center">
            <span>
              <span className="block font-display text-lg font-semibold">Drop an image here</span>
              <span className="text-sm text-muted">or click to browse · JPG, PNG, WebP up to {MAX_MB} MB</span>
            </span>
          </span>
        )}
        <input
          id={id}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-labelledby={`${id}-label`}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e: ChangeEvent<HTMLInputElement>) => accept(e.target.files?.[0])}
        />
      </label>
      <div className="mt-1.5 flex items-center justify-between gap-3 text-xs">
        <span className="truncate text-muted">{preview ? preview.name : "No image — the drawn cover is used."}</span>
        {preview ? (
          <button
            type="button"
            className="font-semibold text-danger hover:underline"
            onClick={() => {
              setPreview(null);
              onChange?.(null);
            }}
          >
            Remove
          </button>
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
