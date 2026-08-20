/**
 * A flat spectral accent — a single hairline band (red → amber → white → cyan
 * → blue) with a soft bloom under it. Pure CSS gradients, no scene: it sits at
 * the bottom edge of a section and reads as brand color, never as artwork.
 */
const spectrum =
  "linear-gradient(90deg, transparent 0%, #ff5f2e 14%, #ffb020 28%, #ffe66d 38%, #ffffff 50%, #7fe3d8 62%, #4aa8ff 76%, #3b6dff 88%, transparent 100%)";

const edgeFade = "linear-gradient(90deg, transparent, #000 22%, #000 78%, transparent)";

export function SpectralWash({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-1 overflow-hidden ${className}`}
    >
      {/* bloom: the band's light spilling up into the section */}
      <div
        className="absolute inset-x-0 bottom-0 h-56 opacity-25 blur-3xl"
        style={{ background: spectrum, maskImage: edgeFade, WebkitMaskImage: edgeFade }}
      />
      {/* the band itself, hairline thin */}
      <div
        className="absolute inset-x-0 bottom-0 h-px opacity-70"
        style={{ background: spectrum, maskImage: edgeFade, WebkitMaskImage: edgeFade }}
      />
    </div>
  );
}
