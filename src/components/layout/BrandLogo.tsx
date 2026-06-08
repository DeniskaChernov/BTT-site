import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  /** Компактный вариант для шапки */
  variant?: "header" | "footer";
};

export function BrandLogo({ className, variant = "header" }: BrandLogoProps) {
  const isHeader = variant === "header";

  return (
    <Link
      href="/"
      className={cn(
        "btt-focus group inline-flex shrink-0 items-center rounded-xl outline-none transition-opacity hover:opacity-90 motion-reduce:transition-none",
        className,
      )}
      aria-label="Bententrade"
    >
      <Image
        src="/media/brand/btt-logo.png"
        alt="Bententrade"
        width={isHeader ? 120 : 140}
        height={isHeader ? 40 : 48}
        className={cn(
          "h-auto w-auto object-contain",
          isHeader ? "max-h-9 w-[7.5rem] sm:max-h-10 sm:w-[8.5rem]" : "max-h-11 w-[9.5rem]",
        )}
        priority={isHeader}
      />
    </Link>
  );
}
