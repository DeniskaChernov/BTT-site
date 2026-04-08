"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { UserRound } from "lucide-react";
import { useTranslations } from "next-intl";

type NavAccountLinkProps = {
  className?: string;
};

export function NavAccountLink({ className }: NavAccountLinkProps) {
  const t = useTranslations("nav");

  return (
    <Link
      href="/account"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-stone-200 shadow-none backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.09] hover:text-stone-50 [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.1)] md:px-3.5",
        className,
      )}
    >
      <UserRound className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
      <span className="max-w-[8rem] truncate sm:max-w-none">{t("account")}</span>
    </Link>
  );
}
