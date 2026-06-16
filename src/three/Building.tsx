import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { materials, palette } from "./materials";
import { VILLA_BOUNDS } from "../data/property";

/**
 * Helpers
 * -------------------------------------------------------------------------- */

const W = VILLA_BOUNDS.width; // 16
const D = VILLA_BOUNDS.depth; // 12
const H1 = VILLA_BOUNDS.heightFirst; // 3.4
const H2 = VILLA_BOUNDS.heightSecond; // 3.2
const FT = VILLA_BOUNDS.floorThickness; // 0.25
const ROOF = VILLA_BOUNDS.roof;
const SET = VILLA_BOUNDS.setback; // second floor setback from edge

// A reusable wall segment: a box positioned in world space.
function Wall({
  size,
  position,
  rotation = [0, 0, 0],
  material = materials.wallWarm,
}: {
  size: [number, number, number];
  position: [number, number, number];
  rotation?: [number, number, number];
  material?: THREE.Material;
}) {
  return (
    <mesh position={position} rotation={rotation} material={material} castShadow receiveShadow>
      <boxGeometry args={size} />
    </mesh>
  );
}

// Window strip — emissive on interior view, dark from outside
function GlassPanel({
  size,
  position,
  rotation = [0, 0, 0],
}: {
  size: [number, number, number];
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh material={materials.glass}>
        <boxGeometry args={size} />
      </mesh>
      {/* Mullions */}
      <mesh material={materials.glassEdge} position={[0, 0, size[2] / 2 + 0.005]}>
        <boxGeometry args={[size[0], 0.04, 0.01]} />
      </mesh>
      <mesh material={materials.glassEdge} position={[0, 0, size[2] / 2 + 0.005]}>
        <boxGeometry args={[0.02, size[1], 0.01]} />
      </mesh>
      <mesh material={materials.glassEdge} position={[0, 0, size[2] / 2 + 0.005]}>
        <boxGeometry args={[0.02, size[1], 0.01]} />
      </mesh>
    </group>
  );
}

/**
 * FIRST FLOOR — modern villa with a 6m+ double-height living volume
 * -------------------------------------------------------------------------- */
function FirstFloorShell() {
  // Building footprint is from x=-8..8, z=-6..6. The double-height space
  // is the north half: z=-6..-1, plus a 3.2m zone on the south for kitchen.
  // We model exterior walls as 4 box-walls with window/door cutouts
  // implemented as multiple segments around the openings.

  return (
    <group>
      {/* Floor slab (ground level) */}
      <mesh position={[0, -FT / 2, 0]} material={materials.floorTravertine} receiveShadow>
        <boxGeometry args={[W, FT, D]} />
      </mesh>

      {/* EAST wall (x = +8). Two-story, but we only build the ground floor
          portion here; the second floor will set back inside. Solid limestone
          with a tall window opening. */}
      <Wall
        size={[0.3, H1, D]}
        position={[W / 2, H1 / 2, 0]}
        material={materials.limestone}
      />
      {/* tall window on east wall */}
      <GlassPanel
        size={[0.05, 2.2, 4.5]}
        position={[W / 2 - 0.18, 1.4, 1.5]}
      />

      {/* WEST wall (x = -8). Mostly solid with one strip window. */}
      <Wall size={[0.3, H1, D]} position={[-W / 2, H1 / 2, 0]} material={materials.limestone} />
      {/* West strip window */}
      <GlassPanel size={[0.05, 1.4, 6]} position={[-W / 2 + 0.18, 1.8, 0]} />

      {/* NORTH wall (z = -6). This wall extends up to the second floor.
          Solid limestone, with a slot window high up. */}
      <Wall size={[W, H1 + H2 + ROOF, 0.3]} position={[0, (H1 + H2 + ROOF) / 2, -D / 2]} material={materials.limestone} />
      {/* slot window high on north wall */}
      <GlassPanel
        size={[8, 0.8, 0.05]}
        position={[0, H1 + H2 + ROOF - 0.7, -D / 2 + 0.18]}
      />

      {/* SOUTH wall (z = +6). Mostly floor-to-ceiling glass for the
          living-room view out to the pool. A solid section on the right
          (east) frames the entry. */}
      {/* lower wall section under glass */}
      <Wall size={[W, 0.2, 0.3]} position={[0, 0.1, D / 2]} material={materials.limestone} />
      {/* glass floor-to-ceiling panels, split into 3 bays */}
      <GlassPanel size={[W / 3 - 0.1, 3.0, 0.05]} position={[-W / 3, 1.7, D / 2 - 0.18]} />
      <GlassPanel size={[W / 3 - 0.1, 3.0, 0.05]} position={[0, 1.7, D / 2 - 0.18]} />
      <GlassPanel size={[W / 3 - 0.1, 3.0, 0.05]} position={[W / 3, 1.7, D / 2 - 0.18]} />
      {/* top beam above glass */}
      <Wall size={[W, 0.2, 0.3]} position={[0, H1 - 0.1, D / 2]} material={materials.limestone} />
      {/* Entry door (right side) */}
      <Wall
        size={[1.4, 3.0, 0.3]}
        position={[W / 2 - 0.7, 1.5 + 0.2, D / 2]}
        material={materials.limestone}
      />
      {/* Door handle */}
      <mesh position={[W / 2 - 1.2, 1.4, D / 2 - 0.18]} material={materials.bronzeBright}>
        <boxGeometry args={[0.04, 0.6, 0.04]} />
      </mesh>

      {/* INTERIOR half-wall partition between living (north, double-height)
          and kitchen/dining (south, single height). The wall is only 1.0m
          tall so the kitchen has an open line of sight into the double-height
          living room, and the living room reads as one continuous space. */}
      <Wall
        size={[W, 1.0, 0.2]}
        position={[0, 0.5, -1]}
        material={materials.wallWarm}
      />
      {/* A slim bronze cap on top of the half-wall */}
      <Wall
        size={[W, 0.05, 0.25]}
        position={[0, 1.03, -1]}
        material={materials.bronze}
      />

      {/* Kitchen / dining partial wall (under second floor) */}
      <Wall
        size={[0.2, H1, 5]}
        position={[-3.5, H1 / 2, 3.5]}
        material={materials.wallWarm}
      />
    </group>
  );
}

/**
 * SECOND FLOOR — set back, three bedrooms, a primary bath
 * -------------------------------------------------------------------------- */
function SecondFloorShell() {
  // Floor 2 slab
  const floorY = H1;
  return (
    <group>
      {/* Floor slab */}
      <mesh position={[0, floorY - FT / 2, -1.5]} material={materials.floorWalnut} receiveShadow>
        <boxGeometry args={[W - 2 * SET, FT, D - 2 * SET - 0.5]} />
      </mesh>

      {/* Ceiling/roof slab — flat */}
      <mesh position={[0, floorY + H2 + FT / 2, -1.5]} material={materials.concreteDark} receiveShadow>
        <boxGeometry args={[W - 2 * SET + 0.4, FT, D - 2 * SET + 0.4]} />
      </mesh>

      {/* East exterior wall */}
      <Wall
        size={[0.3, H2, D - 2 * SET - 0.5]}
        position={[(W - 2 * SET) / 2, floorY + H2 / 2, -1.5]}
        material={materials.limestone}
      />
      {/* big window facing east (ocean view) */}
      <GlassPanel
        size={[0.05, 2.0, 5]}
        position={[(W - 2 * SET) / 2 - 0.18, floorY + 1.6, -1.5]}
      />

      {/* West exterior wall */}
      <Wall
        size={[0.3, H2, D - 2 * SET - 0.5]}
        position={[-(W - 2 * SET) / 2, floorY + H2 / 2, -1.5]}
        material={materials.limestone}
      />
      {/* strip window west */}
      <GlassPanel
        size={[0.05, 1.2, 5]}
        position={[-(W - 2 * SET) / 2 + 0.18, floorY + 1.8, -1.5]}
      />

      {/* North exterior wall (z = -D/2) */}
      <Wall
        size={[W - 2 * SET, H2, 0.3]}
        position={[0, floorY + H2 / 2, -D / 2 + SET]}
        material={materials.limestone}
      />
      <GlassPanel
        size={[6, 1.4, 0.05]}
        position={[-1, floorY + 1.6, -D / 2 + SET + 0.18]}
      />

      {/* South exterior wall — the south side is the "front" of the
          second floor; it overlooks the entry and the pool. Mostly glass
          with a guard rail below. We make the wall short and add a guard. */}
      <Wall
        size={[W - 2 * SET, 1.0, 0.3]}
        position={[0, floorY + 0.5, -1.5 + (D - 2 * SET - 0.5) / 2]}
        material={materials.limestone}
      />
      <GlassPanel
        size={[W - 2 * SET, 2.0, 0.05]}
        position={[0, floorY + 2.0, -1.5 + (D - 2 * SET - 0.5) / 2 - 0.18]}
      />

      {/* Interior walls — split bedrooms and the primary bath */}
      {/* Partition between primary suite (north) and guest area (south).
          West segment: bedroom's south wall, with a 1.5m doorway at x=[-5,-3.5].
          East segment: bath's south wall, with a 2m opening to the hallway. */}
      <Wall
        size={[2.4, H2, 0.15]}
        position={[-6.2, floorY + H2 / 2, -3.2]}
        material={materials.wallWarm}
      />
      <Wall
        size={[1.5, H2, 0.15]}
        position={[-2.75, floorY + H2 / 2, -3.2]}
        material={materials.wallWarm}
      />
      <Wall
        size={[5.4, H2, 0.15]}
        position={[2.7, floorY + H2 / 2, -3.2]}
        material={materials.wallWarm}
      />
      {/* Wall between primary bedroom (west) and primary bath (east) */}
      <Wall
        size={[0.15, H2, 2.1]}
        position={[-2.8, floorY + H2 / 2, -4.3]}
        material={materials.wallWarm}
      />
      {/* Wall between guest bedrooms and stair/landing */}
      <Wall
        size={[3.0, H2, 0.15]}
        position={[-1.4, floorY + H2 / 2, 1.0]}
        material={materials.wallWarm}
      />
      {/* Wall between study and stair landing (east of stair) */}
      <Wall
        size={[0.15, H2, 3.5]}
        position={[1.5, floorY + H2 / 2, 1.0]}
        material={materials.wallWarm}
      />
    </group>
  );
}

/**
 * STAIRCASE
 * -------------------------------------------------------------------------- */
function Staircase() {
  // A simple modern staircase from ground floor to second floor.
  const steps = 16;
  const stepRise = H1 / steps;
  const stepRun = 0.28;
  const startX = -6.5;
  const startZ = 4.5;
  const treads: { y: number; z: number }[] = [];
  for (let i = 0; i < steps; i++) {
    treads.push({ y: i * stepRise, z: startZ - i * stepRun });
  }
  return (
    <group>
      {treads.map((t, i) => (
        <mesh
          key={i}
          position={[startX, t.y + stepRise / 2, t.z]}
          material={i % 2 === 0 ? materials.floorWalnut : materials.concreteDark}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1.2, stepRise, stepRun]} />
        </mesh>
      ))}
      {/* Stringer */}
      <mesh
        position={[startX - 0.61, H1 / 2, startZ - (steps * stepRun) / 2]}
        rotation={[Math.atan2(stepRun, stepRise), 0, 0]}
        material={materials.concreteDark}
      >
        <boxGeometry args={[0.05, H1 * 1.05, 0.3]} />
      </mesh>
      {/* Railing glass */}
      <mesh
        position={[startX + 0.62, H1 / 2, startZ - (steps * stepRun) / 2]}
        rotation={[Math.atan2(stepRun, stepRise), 0, 0]}
        material={materials.glass}
      >
        <boxGeometry args={[0.04, H1 * 1.0, 0.05]} />
      </mesh>
      {/* Upper landing */}
      <mesh
        position={[startX, H1 + 0.05, startZ - steps * stepRun - 0.6]}
        material={materials.floorWalnut}
        receiveShadow
      >
        <boxGeometry args={[2.0, 0.1, 1.5]} />
      </mesh>
    </group>
  );
}

/**
 * ROOFTOP TERRACE
 * -------------------------------------------------------------------------- */
function RooftopTerrace() {
  const floorY = H1;
  return (
    <group position={[-(W - 2 * SET) / 2 + 1, floorY, 1.5]}>
      {/* Deck floor */}
      <mesh position={[0, 0.02, 0]} material={materials.ipe} receiveShadow>
        <boxGeometry args={[2.5, 0.04, 1.6]} />
      </mesh>
      {/* Two lounge chairs */}
      {[-0.7, 0.7].map((x, i) => (
        <group key={i} position={[x, 0.1, -0.3]}>
          <mesh material={materials.white}>
            <boxGeometry args={[0.7, 0.06, 1.4]} />
          </mesh>
          <mesh position={[0, 0.2, 0.6]} material={materials.white}>
            <boxGeometry args={[0.7, 0.4, 0.1]} />
          </mesh>
        </group>
      ))}
      {/* Planter */}
      <mesh position={[1.0, 0.3, 0]} material={materials.concrete}>
        <boxGeometry args={[0.5, 0.6, 0.5]} />
      </mesh>
      <mesh position={[1.0, 0.65, 0]} material={materials.grassDark}>
        <boxGeometry args={[0.4, 0.1, 0.4]} />
      </mesh>
    </group>
  );
}

/**
 * FIREPLACE — a tall cast-concrete hearth in the living room
 * -------------------------------------------------------------------------- */
function Fireplace() {
  return (
    <group position={[-W / 2 + 0.4, 0, -3.5]}>
      {/* Hearth block */}
      <mesh material={materials.concreteDark} castShadow receiveShadow>
        <boxGeometry args={[0.4, 2.4, 1.6]} />
      </mesh>
      {/* Mantel */}
      <mesh position={[0, 1.3, 0]} material={materials.concrete}>
        <boxGeometry args={[0.6, 0.08, 1.8]} />
      </mesh>
      {/* Fire opening */}
      <mesh position={[0, 0.4, 0]} material={materials.warm}>
        <boxGeometry args={[0.42, 0.9, 0.9]} />
      </mesh>
    </group>
  );
}

/**
 * LIGHT FIXTURES — pendant, recessed, exterior sconces
 * -------------------------------------------------------------------------- */
function Pendant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh material={materials.glassEdge} position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.6]} />
      </mesh>
      <mesh material={materials.bronzeBright} position={[0, 0, 0]}>
        <coneGeometry args={[0.18, 0.32, 16, 1, true]} />
      </mesh>
      <pointLight position={[0, -0.18, 0]} intensity={0.6} color="#ffd9a8" distance={6} decay={2} />
    </group>
  );
}

function RecessedRow({ count, start, end, y, x = 0, z = 0, rotation = [0, 0, 0] }: { count: number; start: number; end: number; y: number; x?: number; z?: number; rotation?: [number, number, number] }) {
  const lights: { pos: [number, number, number] }[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    lights.push({ pos: [start + (end - start) * t, 0, 0] });
  }
  return (
    <group position={[x, y, z]} rotation={rotation}>
      {lights.map((l, i) => (
        <pointLight key={i} position={l.pos} intensity={0.18} color="#ffe4c0" distance={3} decay={2} />
      ))}
    </group>
  );
}

/**
 * MAIN BUILDING
 * -------------------------------------------------------------------------- */
export function Building() {
  // Subtle wobble on the pool water tiles — use a ref to avoid re-renders.
  const poolRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (poolRef.current) {
      const m = poolRef.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.35 + Math.sin(clock.elapsedTime * 0.6) * 0.05;
    }
  });

  return (
    <group>
      <FirstFloorShell />
      <SecondFloorShell />
      <Staircase />
      <RooftopTerrace />
      <Fireplace />

      {/* Pendants over the kitchen island */}
      <Pendant position={[-3.5, H1 - 0.05, 1.0]} />
      <Pendant position={[-3.5, H1 - 0.05, 1.8]} />
      <Pendant position={[-3.5, H1 - 0.05, 2.6]} />

      {/* Recessed lighting — gentle ambience on the second floor */}
      <RecessedRow count={4} start={-3} end={3} y={H1 + H2 - 0.05} z={-3.5} />

      {/* Warm interior point light over the living area */}
      <pointLight position={[0, 5.2, -3]} intensity={1.0} color="#ffd9a8" distance={9} decay={2} castShadow={false} />
      <pointLight position={[-3.5, 2.8, 2.5]} intensity={0.6} color="#fff1d6" distance={5} decay={2} />
      <pointLight position={[3, 2.5, 5]} intensity={0.4} color="#fff1d6" distance={4} decay={2} />
    </group>
  );
}
