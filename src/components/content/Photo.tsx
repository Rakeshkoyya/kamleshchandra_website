import Image from "next/image";
import { photoMeta } from "./photos";

interface PhotoProps {
  src: string;
  /** Overrides the default alt text; pass "" when the image is decorative. */
  alt?: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  captionClassName?: string;
  /** Above-the-fold hero: load eagerly with high fetch priority. */
  isHero?: boolean;
  /** Optional caption text shown before the credit. */
  caption?: string;
}

/** A photo with its licence credit underneath (required for the CC stand-ins). */
export function Photo({
  src,
  alt,
  sizes,
  className = "",
  imgClassName = "",
  captionClassName = "text-muted",
  isHero = false,
  caption,
}: PhotoProps) {
  const meta = photoMeta(src);
  const hasCaption = Boolean(caption || meta.credit);
  return (
    <figure className={className}>
      <Image
        src={src}
        alt={alt ?? meta.alt}
        width={meta.width}
        height={meta.height}
        sizes={sizes}
        loading={isHero ? "eager" : "lazy"}
        fetchPriority={isHero ? "high" : "auto"}
        className={`h-auto w-full ${imgClassName}`}
      />
      {hasCaption ? (
        <figcaption className={`mt-2 text-xs ${captionClassName}`}>
          {caption ? <span>{caption} </span> : null}
          {meta.credit ? <span>{meta.credit}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
