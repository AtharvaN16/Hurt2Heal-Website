import Image from "next/image";
import type { FeaturedInLogo } from "@/lib/content";

// Desaturates each logo to the same neutral gray (rather than masking to a
// flat silhouette) — several of these marks rely on light text set against
// a solid dark shape with no transparency, so an alpha-based mask collapses
// them into unreadable blobs. Grayscale preserves each logo's internal
// light/dark contrast while still giving the strip a uniform, muted color.
export function FeaturedInLogoMark({ name, src, width, height }: FeaturedInLogo) {
  return (
    <Image
      src={src}
      alt={name}
      width={width}
      height={height}
      className="h-10 w-auto md:h-14 grayscale opacity-70 transition-opacity hover:opacity-100"
    />
  );
}
