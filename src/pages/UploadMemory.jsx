import { useState } from "react";
import { Upload, CheckCircle2, ImagePlus } from "lucide-react";
import { uploadMemory } from "../lib/uploadMemory";

function UploadMemory() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      await uploadMemory(file);

      setMessage("Image uploaded successfully!");
      setFile(null);

      document.getElementById("memory-file").value = "";
    } catch (err) {
      console.error(err);
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl sm:p-8">

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
              <ImagePlus size={30} />
            </div>

            <h1 className="text-2xl font-black sm:text-3xl">
              Upload Memory
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Upload an image to the MJPCSU gallery
            </p>
          </div>

          <label
            htmlFor="memory-file"
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/60 px-6 py-12 text-center transition hover:border-cyan-400 hover:bg-cyan-500/5"
          >
            <Upload className="mb-3 text-cyan-400" size={30} />

            <span className="font-semibold">
              {file ? file.name : "Choose an image"}
            </span>

            <span className="mt-1 text-xs text-slate-500">
              JPG, JPEG, PNG, WEBP
            </span>

            <input
              id="memory-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setMessage("");
                setError("");
              }}
            />
          </label>

          {message && (
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400">
              <CheckCircle2 size={18} />
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3.5 font-bold text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload size={18} />

            {uploading ? "Uploading..." : "Upload Memory"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default UploadMemory;