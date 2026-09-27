import Image from "next/image";
import { getPhoto, type PhotoId } from "@/lib/trip-data";

// Card header image with Commons attribution (required by the CC BY / BY-SA licences).
export function Photo({ id, alt }: { id: PhotoId; alt: string }) {
  const p = getPhoto(id);
  return (
    <figure className="relative -mx-5 -mt-5 mb-1 aspect-[16/10] overflow-hidden rounded-t-2xl bg-panel">
      <Image
        src={p.src}
        alt={p.caption ? `${alt} — ${p.caption.toLowerCase()}` : alt}
        fill
        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
        className="object-cover"
      />
      {p.caption && (
        <span className="absolute left-2.5 top-2.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white">
          {p.caption}
        </span>
      )}
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-3 pb-1.5 pt-5 text-right text-[10px] text-white/85">
        <a href={p.source} target="_blank" rel="noopener noreferrer" className="hover:underline">
          Photo: {p.credit} · {p.license}
        </a>
      </figcaption>
    </figure>
  );
}
