import { useState } from "react";

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

export function FileInput({ onFile, accept = "image/*" }: { onFile?: (file: File | null) => void; accept?: string }) {
  const [name, setName] = useState("");
  return <label className="file-input"><span>Choose File</span><span>{name || "No file chosen"}</span><input type="file" accept={accept} onChange={(e) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > MAX_IMAGE_BYTES) {
      window.alert("This image is too large. The maximum allowed size is 3 MB.");
      e.target.value = "";
      setName("");
      onFile?.(null);
      return;
    }
    setName(file?.name ?? "");
    onFile?.(file);
  }} /></label>;
}
