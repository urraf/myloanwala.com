import Link from "next/link";
import { SITE } from "@/lib/site";

/** Logo: an image (NEXT_PUBLIC_LOGO_IMAGE) or two-colour wordmark + tagline badge — set in .env. */
export default function Logo({ light = false, href = "/" }: { light?: boolean; href?: string }) {
  if (SITE.logoImage) {
    return (
      <Link href={href} className="inline-flex items-center" aria-label={`${SITE.name} home`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SITE.logoImage} alt={SITE.name} className={`h-9 w-auto sm:h-11 ${light ? "rounded bg-white px-2 py-1" : ""}`} />
      </Link>
    );
  }
  return (
    <Link href={href} className="inline-flex flex-col items-start leading-none" aria-label={`${SITE.name} home`}>
      <span className="relative font-serif text-[22px] font-normal tracking-tight sm:text-[28px]">
        <span className={light ? "text-white" : "text-[#1b3a8c]"}>{SITE.logoText1}</span>
        <span className={light ? "text-white" : "text-brand"}>{SITE.logoText2}</span>
        <span className="absolute -right-4 -top-1 grid h-4 w-4 place-items-center rounded-full bg-brand text-[10px] font-semibold text-white sm:-right-5 sm:h-[18px] sm:w-[18px]">
          ₹
        </span>
      </span>
      {SITE.logoTagline && (
        <span
          className={`-mt-0.5 ml-1 -skew-x-12 px-2 py-[2px] text-[8px] font-bold tracking-[0.12em] sm:text-[9px] ${
            light ? "bg-white text-ink" : "bg-ink text-white"
          }`}
        >
          <span className="inline-block skew-x-12">{SITE.logoTagline}</span>
        </span>
      )}
    </Link>
  );
}
