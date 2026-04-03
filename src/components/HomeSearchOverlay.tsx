"use client";

type HomeSearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export default function HomeSearchOverlay({
  open,
  onClose,
}: HomeSearchOverlayProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-black p-6">
        <input
          autoFocus
          placeholder="Buscar produtos..."
          className="w-full rounded bg-white/10 p-3 text-white outline-none placeholder:text-white/50"
        />

        <button
          onClick={onClose}
          className="mt-4 text-sm text-white/60 transition hover:text-white"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}