"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";

const FRAME = "#3d2e24";
const WICKER_MAIN = "#7a6249";
const WICKER_HI = "#9a7d63";

export function RattanChairModel() {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.35) * 0.06;
  });

  const seatStrips = useMemo(() => {
    const rows: { pos: [number, number, number]; scale: [number, number, number] }[] = [];
    const w = 0.36;
    const count = 14;
    for (let i = 0; i < count; i++) {
      const z = -0.17 + (i / (count - 1)) * 0.34;
      rows.push({
        pos: [0, 0.444, z],
        scale: [w, 0.022, 0.018],
      });
    }
    return rows;
  }, []);

  const backStrips = useMemo(() => {
    const cols: { pos: [number, number, number]; scale: [number, number, number] }[] = [];
    const h = 0.28;
    const count = 11;
    for (let i = 0; i < count; i++) {
      const x = -0.17 + (i / (count - 1)) * 0.34;
      cols.push({
        pos: [x, 0.62, -0.195],
        scale: [0.02, h, 0.016],
      });
    }
    return cols;
  }, []);

  const legPositions: [number, number, number][] = [
    [-0.17, 0.21, -0.14],
    [0.17, 0.21, -0.14],
    [-0.17, 0.21, 0.14],
    [0.17, 0.21, 0.14],
  ];

  return (
    <group ref={group} dispose={null} position={[0, 0, 0]}>
      {legPositions.map((pos, i) => (
        <mesh key={`leg-${i}`} castShadow position={pos}>
          <cylinderGeometry args={[0.022, 0.026, 0.42, 12]} />
          <meshStandardMaterial color={FRAME} roughness={0.88} metalness={0.08} />
        </mesh>
      ))}

      <mesh castShadow receiveShadow position={[0, 0.41, 0]}>
        <boxGeometry args={[0.42, 0.045, 0.38]} />
        <meshStandardMaterial color={FRAME} roughness={0.82} metalness={0.06} />
      </mesh>

      {seatStrips.map((s, i) => (
        <mesh
          key={`seat-${i}`}
          castShadow
          position={s.pos}
          scale={s.scale}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? WICKER_MAIN : WICKER_HI}
            roughness={0.94}
            metalness={0.02}
          />
        </mesh>
      ))}

      <mesh
        castShadow
        position={[0, 0.62, -0.2]}
        rotation={[-0.22, 0, 0]}
      >
        <boxGeometry args={[0.4, 0.32, 0.035]} />
        <meshStandardMaterial color={FRAME} roughness={0.85} metalness={0.05} />
      </mesh>

      {backStrips.map((b, i) => (
        <mesh
          key={`back-${i}`}
          castShadow
          position={b.pos}
          rotation={[-0.22, 0, 0]}
          scale={b.scale}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? WICKER_HI : WICKER_MAIN}
            roughness={0.93}
            metalness={0.02}
          />
        </mesh>
      ))}

      <mesh castShadow position={[0, 0.51, -0.05]}>
        <boxGeometry args={[0.42, 0.025, 0.34]} />
        <meshStandardMaterial color={FRAME} roughness={0.9} metalness={0.04} />
      </mesh>
    </group>
  );
}
