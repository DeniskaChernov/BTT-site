"use client";

import { RattanChairModel } from "@/components/furniture/RattanChairModel";
import { cn } from "@/lib/utils";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Suspense, useLayoutEffect, useState } from "react";

const STATIC_FALLBACK = "/media/catalog/furniture-chair-hero.webp";

type Props = {
  className?: string;
  "aria-label"?: string;
};

function Scene() {
  return (
    <>
      <ambientLight intensity={0.38} />
      <directionalLight
        castShadow
        position={[5, 9, 5]}
        intensity={1.35}
        color="#fcd9a8"
      />
      <directionalLight position={[-4, 3, -2]} intensity={0.35} color="#64748b" />
      <pointLight position={[0, 2.2, 1.8]} intensity={0.55} color="#f5f5f7" />

      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      <group position={[0, -0.02, 0]}>
        <RattanChairModel />
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <shadowMaterial opacity={0.35} />
      </mesh>

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.55}
        scale={12}
        blur={2.4}
        far={5}
      />

      <OrbitControls
        enablePan={false}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2 - 0.12}
        minDistance={2.2}
        maxDistance={5}
        target={[0, 0.42, 0]}
        enableDamping
        dampingFactor={0.06}
      />
    </>
  );
}

export function FurnitureRattanPreview({ className, "aria-label": ariaLabel }: Props) {
  const reduceMotion = useReducedMotion();
  const [narrowViewport, setNarrowViewport] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const apply = () => setNarrowViewport(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const useStaticPreview = Boolean(reduceMotion) || narrowViewport;

  return (
    <div
      className={cn(
        "relative isolate min-h-[260px] w-full overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-gradient-to-b from-[#141210] via-[#0f0e0c] to-[#0a0908] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        "aspect-[4/3] max-h-[min(52vh,520px)] md:min-h-[320px]",
        className,
      )}
      role="img"
      aria-label={ariaLabel}
    >
      {useStaticPreview ? (
        <div className="relative h-full min-h-[240px] w-full">
          <Image
            src={STATIC_FALLBACK}
            alt={ariaLabel ?? "Furniture preview"}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 896px"
            priority
          />
        </div>
      ) : (
        <Canvas
          shadows
          className="touch-none !bg-transparent"
          dpr={[1, 2]}
          camera={{ position: [2.35, 1.05, 2.65], fov: 38, near: 0.1, far: 100 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      )}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent"
        aria-hidden
      />
    </div>
  );
}
