import Link from "next/link";
import { SITE } from "@/lib/site";

/** Logo: badge image (NEXT_PUBLIC_LOGO_IMAGE, default /logo.png) + two-colour wordmark + tagline badge — set in .env. */
export default function Logo({ light = false, href = "/" }: { light?: boolean; href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 sm:gap-2.5" aria-label={`${SITE.name} home`}>
      {SITE.logoImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={SITE.logoImage} alt={SITE.name} className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12" />
      )}
      <span className="inline-flex flex-col items-start leading-none">
        <span className="relative font-serif text-[21px] font-normal tracking-tight sm:text-[26px]">
          <span className={light ? "text-white" : "text-[#1b3a8c]"}>{SITE.logoText1}</span>
          <span className={light ? "text-white" : "text-brand"}>{SITE.logoText2}</span>
          {!SITE.logoImage && (
            <span className="absolute -right-4 -top-1 grid h-4 w-4 place-items-center rounded-full bg-brand text-[10px] font-semibold text-white sm:-right-5 sm:h-[18px] sm:w-[18px]">
              ₹
            </span>
          )}
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
      </span>
    </Link>
  );
}
