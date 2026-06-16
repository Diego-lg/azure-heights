import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { materials, palette } from "./materials";
import { VILLA_BOUNDS } from "../data/property";

const H1 = VILLA_BOUNDS.heightFirst;
const H2 = VILLA_BOUNDS.heightSecond;
const FT = VILLA_BOUNDS.floorThickness;

/* ============================================================================
   LIVING ROOM
   ============================================================================ */

export function LivingRoom() {
  return (
    <group>
      {/* L-shaped sectional sofa */}
      <Sectional position={[2.0, 0, -2.5]} rotation={[0, -Math.PI / 8, 0]} />
      {/* Coffee table */}
      <mesh position={[2.0, 0.22, -0.5]} material={materials.walnutTable} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.06, 0.7]} />
      </mesh>
      <mesh position={[2.0, 0.1, -0.5]} material={materials.concreteDark} castShadow>
        <boxGeometry args={[0.08, 0.2, 0.08]} />
      </mesh>
      <mesh position={[3.0, 0.1, -0.5]} material={materials.concreteDark} castShadow>
        <boxGeometry args={[0.08, 0.2, 0.08]} />
      </mesh>
      <mesh position={[1.0, 0.1, -0.5]} material={materials.concreteDark} castShadow>
        <boxGeometry args={[0.08, 0.2, 0.08]} />
      </mesh>
      {/* Side chair */}
      <Armchair position={[4.5, 0, -3.5]} />
      {/* Floor lamp */}
      <FloorLamp position={[5.5, 0, -4.5]} />
      {/* Wall art above fireplace (north wall) */}
      <mesh position={[-W2() + 0.18, 4.5, -2.5]} material={materials.beddingAccent}>
        <boxGeometry args={[0.05, 1.4, 1.8]} />
      </mesh>
      {/* Large rug */}
      <mesh position={[2.0, 0.005, -1.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4, 5]} />
        <meshStandardMaterial color="#a89070" roughness={1.0} />
      </mesh>
    </group>
  );
}

function W2() {
  return VILLA_BOUNDS.width / 2;
}

function Sectional({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Long bench seat */}
      <mesh material={materials.bedding} position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.4, 1.0]} />
      </mesh>
      {/* Backrest */}
      <mesh material={materials.bedding} position={[-0.7, 0.6, -0.45]} castShadow>
        <boxGeometry args={[1.2, 0.6, 0.12]} />
      </mesh>
      {/* Side return */}
      <mesh material={materials.bedding} position={[1.3, 0.25, -1.0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.4, 1.4]} />
      </mesh>
      <mesh material={materials.bedding} position={[1.78, 0.6, -0.9]} castShadow>
        <boxGeometry args={[0.12, 0.6, 0.8]} />
      </mesh>
      {/* Cushions */}
      <mesh material={materials.warmAccent} position={[-0.4, 0.5, -0.3]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
      </mesh>
      <mesh material={materials.beddingAccent} position={[0.5, 0.5, -0.3]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
      </mesh>
      {/* Wood legs */}
      {[-1.2, 0, 1.2].map((x) =>
        [-0.45, 0.45].map((z) => (
          <mesh key={`${x}-${z}`} material={materials.walnutTable} position={[x, 0.05, z]}>
            <cylinderGeometry args={[0.04, 0.04, 0.1]} />
          </mesh>
        )),
      )}
    </group>
  );
}

function Armchair({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      <mesh material={materials.headboard} position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.4, 0.9]} />
      </mesh>
      <mesh material={materials.headboard} position={[0, 0.65, -0.4]} castShadow>
        <boxGeometry args={[0.9, 0.5, 0.1]} />
      </mesh>
      <mesh material={materials.headboard} position={[0.4, 0.65, 0]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.9]} />
      </mesh>
      <mesh material={materials.headboard} position={[-0.4, 0.65, 0]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.9]} />
      </mesh>
    </group>
  );
}

function FloorLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh material={materials.bronzeBright} position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.8]} />
      </mesh>
      <mesh material={materials.warm} position={[0, 1.8, 0]}>
        <coneGeometry args={[0.25, 0.4, 16, 1, true]} />
      </mesh>
      <pointLight position={[0, 1.7, 0]} intensity={0.4} color="#ffd9a8" distance={3} decay={2} />
    </group>
  );
}

/* ============================================================================
   KITCHEN
   ============================================================================ */

export function Kitchen() {
  return (
    <group>
      {/* Island */}
      <mesh position={[-3.5, 0.45, 1.5]} material={materials.marble} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.9, 1.2]} />
      </mesh>
      {/* Island base */}
      <mesh position={[-3.5, 0.4, 1.5]} material={materials.cabinetDark} castShadow>
        <boxGeometry args={[3.2, 0.8, 1.0]} />
      </mesh>
      {/* Bar stools */}
      {[-2.3, -1.5, -0.7].map((x) => (
        <BarStool key={x} position={[x, 0, 2.4]} />
      ))}

      {/* Back counter — runs along west wall */}
      <mesh position={[-7.6, 0.45, 3.0]} material={materials.cabinetLight} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.9, 4.5]} />
      </mesh>
      <mesh position={[-7.6, 0.92, 3.0]} material={materials.marble} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.06, 4.6]} />
      </mesh>
      {/* Upper cabinets */}
      <mesh position={[-7.6, 1.9, 3.0]} material={materials.cabinetLight} castShadow>
        <boxGeometry args={[0.45, 1.4, 4.5]} />
      </mesh>
      {/* Range */}
      <mesh position={[-7.55, 0.95, 1.5]} material={materials.cabinetDark} castShadow>
        <boxGeometry args={[0.6, 0.08, 0.8]} />
      </mesh>
      <mesh position={[-7.5, 0.99, 1.5]} material={materials.black}>
        <cylinderGeometry args={[0.08, 0.08, 0.02]} />
      </mesh>
      {/* Hood */}
      <mesh position={[-7.5, 1.9, 1.5]} material={materials.concreteDark} castShadow>
        <boxGeometry args={[0.7, 0.7, 0.9]} />
      </mesh>
      {/* Fridge */}
      <mesh position={[-7.55, 1.0, 5.0]} material={materials.cabinetLight} castShadow receiveShadow>
        <boxGeometry args={[0.7, 2.0, 0.9]} />
      </mesh>
      <mesh position={[-7.5, 1.0, 5.0]} material={materials.bronzeBright}>
        <boxGeometry args={[0.02, 0.8, 0.02]} />
      </mesh>
      {/* Sink */}
      <mesh position={[-7.5, 0.93, 4.0]} material={materials.tubWhite} castShadow>
        <boxGeometry args={[0.6, 0.02, 0.9]} />
      </mesh>
      <mesh position={[-7.55, 1.1, 4.0]} material={materials.bronze}>
        <cylinderGeometry args={[0.025, 0.025, 0.3]} />
      </mesh>

      {/* Wine column / butler pantry on east side */}
      <mesh position={[-1.0, 1.0, 5.5]} material={materials.cabinetDark} castShadow receiveShadow>
        <boxGeometry args={[0.7, 2.0, 0.7]} />
      </mesh>
    </group>
  );
}

function BarStool({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh material={materials.cabinetDark} position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.06]} />
      </mesh>
      <mesh material={materials.bronzeBright} position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.9]} />
      </mesh>
      <mesh material={materials.headboard} position={[0, 0.85, -0.1]}>
        <boxGeometry args={[0.36, 0.3, 0.05]} />
      </mesh>
    </group>
  );
}

/* ============================================================================
   DINING
   ============================================================================ */

export function DiningArea() {
  return (
    <group>
      {/* Dining table */}
      <mesh position={[3.0, 0.4, 3.0]} material={materials.walnutTable} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.06, 1.1]} />
      </mesh>
      {/* Trestle legs */}
      {[-1.0, 1.0].map((x) => (
        <mesh key={x} material={materials.walnutTable} position={[3.0 + x, 0.2, 3.0]} castShadow>
          <boxGeometry args={[0.06, 0.4, 0.7]} />
        </mesh>
      ))}
      {/* Dining chairs (6) */}
      {[-0.9, 0, 0.9].map((x) => (
        <group key={x}>
          <DiningChair position={[3.0 + x, 0, 3.85]} />
          <DiningChair position={[3.0 + x, 0, 2.15]} rotation={[0, Math.PI, 0]} />
        </group>
      ))}
      {/* Pendant above the table */}
      <Pendant3 position={[3.0, H1 - 0.05, 3.0]} />
    </group>
  );
}

function DiningChair({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh material={materials.headboard} position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
      </mesh>
      <mesh material={materials.headboard} position={[0, 0.55, -0.22]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.04]} />
      </mesh>
      {[-0.2, 0.2].map((x) =>
        [-0.2, 0.2].map((z) => (
          <mesh key={`${x}-${z}`} material={materials.bronze} position={[x, 0.12, z]}>
            <cylinderGeometry args={[0.018, 0.018, 0.25]} />
          </mesh>
        )),
      )}
    </group>
  );
}

function Pendant3({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh material={materials.glassEdge} position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.7]} />
      </mesh>
      <mesh material={materials.bronzeBright} position={[0, 0, 0]}>
        <torusGeometry args={[0.4, 0.02, 8, 32]} />
      </mesh>
      <pointLight position={[0, -0.1, 0]} intensity={0.5} color="#ffd9a8" distance={6} decay={2} />
    </group>
  );
}

/* ============================================================================
   PRIMARY BEDROOM (second floor, north side)
   ============================================================================ */

export function PrimaryBedroom() {
  return (
    <group>
      {/* Bed centered in the primary suite, headboard against the north wall */}
      <Bed position={[-4.5, 0, -4.3]} />
      {/* Nightstands */}
      <Nightstand position={[-5.7, 0, -4.3]} />
      <Nightstand position={[-3.3, 0, -4.3]} />
      {/* Dresser on west wall */}
      <mesh position={[-6.8, 0.5, -4.3]} material={materials.walnutTable} castShadow receiveShadow>
        <boxGeometry args={[0.6, 1.0, 1.6]} />
      </mesh>
      {/* Bench at foot of bed */}
      <mesh position={[-4.5, 0.25, -3.3]} material={materials.headboard} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.1, 0.4]} />
      </mesh>
      {[-0.7, 0.7].map((x) => (
        <mesh key={x} material={materials.bronze} position={[-4.5 + x, 0.12, -3.3]}>
          <boxGeometry args={[0.04, 0.24, 0.4]} />
        </mesh>
      ))}
      {/* Table lamps on nightstands */}
      <pointLight position={[-5.7, 0.8, -4.3]} intensity={0.25} color="#ffd9a8" distance={2.5} decay={2} />
      <pointLight position={[-3.3, 0.8, -4.3]} intensity={0.25} color="#ffd9a8" distance={2.5} decay={2} />
    </group>
  );
}

function Bed({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Frame */}
      <mesh material={materials.headboard} position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.4, 2.2]} />
      </mesh>
      {/* Headboard */}
      <mesh material={materials.headboard} position={[0, 0.8, -1.0]} castShadow>
        <boxGeometry args={[2.2, 1.2, 0.1]} />
      </mesh>
      {/* Mattress / duvet */}
      <mesh material={materials.bedding} position={[0, 0.46, 0.1]} castShadow>
        <boxGeometry args={[1.95, 0.12, 2.1]} />
      </mesh>
      {/* Pillows */}
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} material={materials.white} position={[x, 0.55, -0.6]} castShadow>
          <boxGeometry args={[0.7, 0.12, 0.4]} />
        </mesh>
      ))}
      {/* Throw blanket */}
      <mesh material={materials.beddingAccent} position={[0, 0.54, 0.7]} castShadow>
        <boxGeometry args={[1.6, 0.04, 0.7]} />
      </mesh>
    </group>
  );
}

function Nightstand({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh material={materials.walnutTable} position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.6, 0.4]} />
      </mesh>
      {/* Drawer pulls */}
      <mesh material={materials.bronze} position={[0, 0.3, 0.21]}>
        <boxGeometry args={[0.2, 0.02, 0.01]} />
      </mesh>
      {/* Lamp */}
      <mesh material={materials.tubWhite} position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.3]} />
      </mesh>
      <mesh material={materials.warm} position={[0, 0.95, 0]}>
        <coneGeometry args={[0.12, 0.2, 12, 1, true]} />
      </mesh>
    </group>
  );
}

/* ============================================================================
   PRIMARY BATH
   ============================================================================ */

export function PrimaryBath() {
  // Bath occupies the east side of the primary suite, north of the partition
  // at z=-3.2 and east of wall 2 at x=-2.8. All fixtures fit within the
  // second-floor envelope (x: -2.8..+7.4, z: -5.4..-3.2).
  return (
    <group>
      {/* Freestanding tub - hero piece, against the north window */}
      <mesh position={[3.0, 0.32, -4.5]} material={materials.tubWhite} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.6, 1.7]} />
      </mesh>
      <mesh position={[3.0, 0.62, -4.5]} material={materials.tubWhite} castShadow>
        <boxGeometry args={[0.78, 0.05, 1.6]} />
      </mesh>
      {/* Tub filler */}
      <mesh position={[2.65, 0.95, -4.5]} material={materials.bronze} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.9]} />
      </mesh>
      <mesh position={[2.65, 0.95, -4.5]} material={materials.bronze}>
        <boxGeometry args={[0.15, 0.04, 0.04]} />
      </mesh>
      {/* Vanity — on the south partition wall */}
      <mesh position={[2.5, 0.45, -3.55]} material={materials.walnutTable} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.9, 0.55]} />
      </mesh>
      <mesh material={materials.tundra} position={[2.5, 0.92, -3.55]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.04, 0.65]} />
      </mesh>
      {/* Vessel sinks */}
      <mesh position={[2.0, 0.98, -3.55]} material={materials.tubWhite} castShadow>
        <cylinderGeometry args={[0.2, 0.16, 0.1]} />
      </mesh>
      <mesh position={[3.0, 0.98, -3.55]} material={materials.tubWhite} castShadow>
        <cylinderGeometry args={[0.2, 0.16, 0.1]} />
      </mesh>
      {/* Mirror on north wall behind the tub */}
      <mesh material={materials.glass} position={[3.0, 1.7, -5.18]}>
        <boxGeometry args={[1.6, 1.0, 0.04]} />
      </mesh>
      {/* Toilet - east of vanity, tucked into the corner */}
      <Toilet position={[4.2, 0, -3.55]} />
      {/* Glass shower enclosure - west of tub */}
      <mesh material={materials.glass} position={[1.0, 1.2, -4.5]}>
        <boxGeometry args={[0.04, 2.4, 1.6]} />
      </mesh>
      <mesh material={materials.glass} position={[1.5, 1.2, -5.18]}>
        <boxGeometry args={[1.0, 2.4, 0.04]} />
      </mesh>
    </group>
  );
}

function Toilet({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh material={materials.tubWhite} position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.55]} />
      </mesh>
      <mesh material={materials.tubWhite} position={[0, 0.05, 0.25]} castShadow>
        <boxGeometry args={[0.35, 0.1, 0.4]} />
      </mesh>
      <mesh material={materials.tubWhite} position={[0, 0.55, -0.25]} castShadow>
        <boxGeometry args={[0.45, 0.7, 0.18]} />
      </mesh>
    </group>
  );
}

/* ============================================================================
   GUEST BEDROOM
   ============================================================================ */

export function GuestBedroom() {
  return (
    <group>
      <Bed position={[-5.0, 0, 0.0]} />
      <Nightstand position={[-3.8, 0, 0.0]} />
      <mesh material={materials.walnutTable} position={[-6.5, 0.4, 0.0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.8, 1.4]} />
      </mesh>
      <pointLight position={[-3.8, 0.8, 0.0]} intensity={0.2} color="#ffd9a8" distance={2} decay={2} />
    </group>
  );
}

/* ============================================================================
   HALLWAY + EN-SUITE
   ============================================================================ */

export function HallBath() {
  return (
    <group>
      <mesh position={[4.5, 0.45, 0.0]} material={materials.walnutTable} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.9, 1.2]} />
      </mesh>
      <mesh material={materials.tundra} position={[4.5, 0.92, 0.0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.04, 1.3]} />
      </mesh>
      <mesh material={materials.tubWhite} position={[4.5, 0.98, 0.0]} castShadow>
        <cylinderGeometry args={[0.18, 0.14, 0.1]} />
      </mesh>
      <Toilet position={[5.4, 0, -0.7]} />
    </group>
  );
}

/* ============================================================================
   OUTDOOR / POOL DECK
   ============================================================================ */

export function PoolDeck() {
  return (
    <group>
      {/* Ipe deck */}
      <mesh position={[2.0, 0.05, 11.5]} material={materials.ipe} receiveShadow>
        <boxGeometry args={[12, 0.1, 6]} />
      </mesh>
      {/* Sunken lounge / fire pit circle */}
      <mesh position={[2.0, 0.25, 13.5]} material={materials.concreteDark} receiveShadow>
        <cylinderGeometry args={[1.6, 1.6, 0.5, 32]} />
      </mesh>
      <mesh position={[2.0, 0.55, 13.5]} material={materials.warm}>
        <cylinderGeometry args={[0.9, 0.9, 0.05, 32]} />
      </mesh>
      <pointLight position={[2.0, 0.6, 13.5]} intensity={0.8} color="#ff8a3a" distance={5} decay={2} />
      {/* Pool loungers */}
      {[-1, 1].map((i) => (
        <group key={i} position={[-2.5 + i * 1.5, 0.1, 9.0]}>
          <mesh material={materials.white} position={[0, 0.05, 0]}>
            <boxGeometry args={[0.7, 0.04, 1.7]} />
          </mesh>
          <mesh material={materials.white} position={[0, 0.2, 0.7]}>
            <boxGeometry args={[0.7, 0.3, 0.1]} />
          </mesh>
        </group>
      ))}
      {/* Planters */}
      {[-4, 4].map((x) => (
        <group key={x} position={[x, 0, 11.5]}>
          <mesh material={materials.concrete} position={[0, 0.3, 0]}>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
          </mesh>
          <mesh material={materials.grassDark} position={[0, 0.65, 0]}>
            <boxGeometry args={[0.5, 0.1, 0.5]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ============================================================================
   (no extra helpers — all materials live in materials.ts)
   ============================================================================ */
