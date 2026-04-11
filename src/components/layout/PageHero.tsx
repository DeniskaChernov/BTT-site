import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  kicker: string;
  title: string;
  lead?: string;
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
};

export function PageHero({
  kicker,
  title,
  lead,
  children,
  className,
  titleClassName,
}: Props) {
  return (
    <header className={cn(className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-500/90">
        {kicker}
      </p>
      <h1
        className={cn(
          "mt-3 max-w-4xl text-4xl font-bold tracking-tight text-stone-50 md:text-5xl",
          titleClassName,
        )}
      >
        {title}
      </h1>
      {lead ? (
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-stone-400">
          {lead}
        </p>
      ) : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </header>
  );
}
