"use client";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export default function DeleteModal({ isOpen, onClose, onConfirm, loading }: Props) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-brand-dark">Delete product?</h3>
        <p className="mt-2 text-sm text-gray-500">This action cannot be undone.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
