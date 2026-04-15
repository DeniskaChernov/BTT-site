"use client";

import { BTT_SPRING_SNAPPY } from "@/lib/motion";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  intensity?: number;
};

/** 3D tilt при наведении — паттерн как у animated 3d card (21st.dev) */
export function TiltCard({
  children,
  className = "",
  intensity = 12,
}: Props) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, {
    stiffness: BTT_SPRING_SNAPPY.stiffness,
    damping: BTT_SPRING_SNAPPY.damping,
  });
  const sy = useSpring(y, {
    stiffness: BTT_SPRING_SNAPPY.stiffness,
    damping: BTT_SPRING_SNAPPY.damping,
  });
  const rotateX = useTransform(sy, [-0.5, 0.5], [`${intensity}deg`, `-${intensity}deg`]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [`-${intensity}deg`, `${intensity}deg`]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className="perspective-[1400px]" style={{ perspective: 1400 }}>
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}
