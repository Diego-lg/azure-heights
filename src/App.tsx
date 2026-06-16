import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Scene } from "./three/Scene";
import { Overlay } from "./ui/Overlay";
import { Loader } from "./ui/Loader";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Slight delay so the loader catches the eye.
    const t = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink-950 text-white">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [22, 8, 22], fov: 38, near: 0.1, far: 250 }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#0c0e14");
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      <Overlay />
      {!ready && <Loader />}
    </div>
  );
}
