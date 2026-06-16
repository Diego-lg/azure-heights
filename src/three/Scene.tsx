import { Suspense } from "react";
import { Environment as DreiEnvironment, Lightformer } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ToneMapping,
  SMAA,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { useViewStore } from "../hooks/useView";
import { Building } from "./Building";
import {
  LivingRoom,
  Kitchen,
  DiningArea,
  PrimaryBedroom,
  PrimaryBath,
  GuestBedroom,
  HallBath,
  PoolDeck,
} from "./Furniture";
import { Ground, Pool, SkyDome, Trees, Fireflies } from "./Environment";
import { CameraRig } from "./CameraRig";
import { FloorPlan } from "./FloorPlan";

function RoomVisibility() {
  const view = useViewStore((s) => s.current);
  const isFloorplan = view === "floorplan";
  const showAll = view === "aerial" || view === "exterior";
  const showLiving = showAll || view === "living";
  const showKitchen = showAll || view === "kitchen";
  const showDining = showAll || view === "living" || view === "kitchen";
  const showPrimary = showAll || view === "bedroom";
  const showPrimaryBath = showAll || view === "bathroom";
  const showGuest = showAll;
  const showHallBath = showAll;
  const showPool = showAll || view === "pool";
  if (isFloorplan) return null;
  return (
    <>
      {showLiving && <LivingRoom />}
      {showKitchen && <Kitchen />}
      {showDining && <DiningArea />}
      {showPrimary && <PrimaryBedroom />}
      {showPrimaryBath && <PrimaryBath />}
      {showGuest && <GuestBedroom />}
      {showHallBath && <HallBath />}
      {showPool && <PoolDeck />}
    </>
  );
}

/**
 * ProcEnvironment — built from a small grid of Lightformers so the
 * metallic materials have something to reflect. Lower resolution than
 * before (256 vs 512) — it's a 1-frame bake so quality doesn't matter
 * much, but the GPU upload cost does.
 */
function ProcEnvironment() {
  return (
    <DreiEnvironment frames={1} resolution={256} background={false}>
      <Lightformer intensity={3.5} color="#ffb070" position={[10, 5, 10]} scale={[10, 5, 1]} target={[0, 0, 0]} />
      <Lightformer intensity={1.5} color="#ff9866" position={[0, 1.5, 18]} scale={[24, 3, 1]} target={[0, 0, 0]} />
      <Lightformer form="ring" intensity={1.2} color="#5a78a8" position={[0, 14, 0]} scale={20} target={[0, 0, 0]} />
      <Lightformer intensity={0.6} color="#6a85a8" position={[-12, 6, -10]} scale={[12, 6, 1]} target={[0, 0, 0]} />
    </DreiEnvironment>
  );
}

export function Scene() {
  const view = useViewStore((s) => s.current);
  const isFloorplan = view === "floorplan";
  return (
    <>
      <SkyDome />
      {!isFloorplan && <fog attach="fog" args={["#1f2638", 32, 120]} />}

      {/* Base lighting — only 3 lights now, was 7 */}
      <ambientLight intensity={0.3} color="#b0bcd0" />
      <hemisphereLight args={["#7a8eb8", "#2a1f12", 0.4]} />

      {/* Key sun: 1024 shadow map (was 2048), the only shadow-casting light */}
      <directionalLight
        position={[14, 18, 8]}
        intensity={1.8}
        color="#ffd0a0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0003}
      />

      {/* Sky fill (no shadow) */}
      <directionalLight position={[-8, 10, -6]} intensity={0.5} color="#7a8eb8" />

      {/* Warm rim from the ocean side (no shadow) */}
      <directionalLight position={[6, 2, 22]} intensity={0.7} color="#ff9466" />

      {/* Two interior point lights — the only ones. Was six. */}
      <pointLight position={[0, 4.5, -3]} intensity={1.0} color="#ffd9a8" distance={14} decay={2} />
      <pointLight position={[-3.5, 2.8, 2.5]} intensity={0.5} color="#fff1d6" distance={6} decay={2} />

      <Suspense fallback={null}>
        <Ground />
        {!isFloorplan && <Pool />}
        {!isFloorplan && <Trees />}
        {!isFloorplan && <Building />}
        {isFloorplan && <FloorPlan />}
        <RoomVisibility />
        {!isFloorplan && <Fireflies />}
        <ProcEnvironment />
      </Suspense>

      <CameraRig />

      {/* Lightweight post chain: bloom + vignette + SMAA + tone map.
          Dropped: chromatic aberration, film grain (both added full-screen
          passes for very little visual payoff). */}
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.3}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.2} darkness={0.7} />
        <SMAA />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}
