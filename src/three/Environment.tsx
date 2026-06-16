import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { materials, palette } from "./materials";
import { GROUND_SIZE } from "../data/property";

/* ============================================================================
   GROUND
   ============================================================================ */

export function Ground() {
  // Two-tone lawn: a dark base with a slightly lighter rectangle around the
  // house for a "landscaped" look.
  return (
    <group>
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[GROUND_SIZE, GROUND_SIZE]} />
        <meshStandardMaterial color={palette.grass} roughness={1.0} />
      </mesh>
      <mesh position={[2, -0.2, 6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 24]} />
        <meshStandardMaterial color={palette.grassDark} roughness={1.0} />
      </mesh>
      {/* Driveway */}
      <mesh position={[-3, -0.18, 12]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4, 14]} />
        <meshStandardMaterial color="#9a958a" roughness={0.9} />
      </mesh>
      {/* Path to entry */}
      <mesh position={[6, -0.19, 8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2, 4]} />
        <meshStandardMaterial color="#bcb6a8" roughness={0.85} />
      </mesh>
    </group>
  );
}

/* ============================================================================
   POOL
   ============================================================================ */

export function Pool() {
  const waterRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (waterRef.current) {
      const m = waterRef.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.35 + Math.sin(clock.elapsedTime * 0.6) * 0.08;
    }
  });

  // Pool is a long lap pool stretching south of the house.
  // Center at (3, 0, 14), size 4 x 18
  return (
    <group position={[3, 0, 14]}>
      {/* Pool shell (dark inside) */}
      <mesh position={[0, -0.6, 0]} material={materials.poolDeep} receiveShadow>
        <boxGeometry args={[4.2, 1.0, 18.2]} />
      </mesh>
      {/* Water surface */}
      <mesh ref={waterRef} position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.pool} receiveShadow>
        <planeGeometry args={[4, 18]} />
      </mesh>
      {/* Pool coping (light limestone border) */}
      <mesh position={[0, 0.02, 0]} material={materials.limestone} receiveShadow>
        <boxGeometry args={[4.6, 0.1, 18.6]} />
      </mesh>
    </group>
  );
}

/* ============================================================================
   SKY
   ============================================================================ */

export function SkyDome() {
  // Soft gradient sky: warm horizon, cool zenith, with a sun glow and a
  // subtle field of stars in the upper hemisphere.
  const skyMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color("#0e1424") },
        midColor: { value: new THREE.Color("#3a4868") },
        horizonColor: { value: new THREE.Color("#d68a52") },
        sunDir: { value: new THREE.Vector3(0.6, 0.18, 0.78).normalize() },
        sunColor: { value: new THREE.Color("#ffd9a0") },
        time: { value: 0 },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 horizonColor;
        uniform vec3 sunDir;
        uniform vec3 sunColor;
        uniform float time;
        varying vec3 vWorldPosition;

        float hash21(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        void main() {
          vec3 dir = normalize(vWorldPosition);
          float h = clamp(dir.y, -0.05, 1.0);

          // Two-stop gradient: horizon → mid → top
          vec3 col = mix(horizonColor, midColor, smoothstep(0.0, 0.25, h));
          col = mix(col, topColor, smoothstep(0.25, 0.9, h));

          // Sun glow on the horizon
          float sunDot = max(dot(dir, sunDir), 0.0);
          float sunGlow = pow(sunDot, 32.0) * 0.8 + pow(sunDot, 4.0) * 0.2;
          col += sunColor * sunGlow;

          // Stars in the upper hemisphere
          if (h > 0.3) {
            vec2 starUV = dir.xz * 80.0 + dir.y * 40.0;
            float s = hash21(floor(starUV));
            if (s > 0.997) {
              float twinkle = 0.5 + 0.5 * sin(time * 2.0 + s * 100.0);
              float starFade = smoothstep(0.3, 0.7, h);
              col += vec3(0.9, 0.92, 1.0) * twinkle * starFade * 0.6;
            }
          }

          gl_FragColor = vec4(col, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
    });
  }, []);

  useFrame(({ clock }) => {
    (skyMat.uniforms.time as any).value = clock.elapsedTime;
  });

  return (
    <mesh material={skyMat}>
      <sphereGeometry args={[160, 48, 24]} />
    </mesh>
  );
}

/* ============================================================================
   TREES — simple stylized low-poly silhouettes
   ============================================================================ */

interface TreeProps {
  position: [number, number, number];
  scale?: number;
  variant?: 0 | 1 | 2;
}

function Tree({ position, scale = 1, variant = 0 }: TreeProps) {
  const trunkH = 1.4 * scale;
  const canopyR = 1.2 * scale;
  return (
    <group position={position} scale={scale}>
      <mesh material={materials.headboard} position={[0, trunkH / 2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, trunkH]} />
      </mesh>
      {variant === 0 && (
        <mesh material={materials.grassDark} position={[0, trunkH + canopyR * 0.6, 0]} castShadow>
          <icosahedronGeometry args={[canopyR, 1]} />
        </mesh>
      )}
      {variant === 1 && (
        <mesh material={materials.grass} position={[0, trunkH + canopyR * 0.7, 0]} castShadow>
          <coneGeometry args={[canopyR, canopyR * 2, 8]} />
        </mesh>
      )}
      {variant === 2 && (
        <group position={[0, trunkH + canopyR * 0.5, 0]}>
          <mesh material={materials.grass} position={[0.5, 0, 0]} castShadow>
            <icosahedronGeometry args={[canopyR * 0.7, 0]} />
          </mesh>
          <mesh material={materials.grassDark} position={[-0.4, 0.3, 0.2]} castShadow>
            <icosahedronGeometry args={[canopyR * 0.5, 0]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export function Trees() {
  // A loose ring of trees framing the property.
  const placements: { p: [number, number, number]; s: number; v: 0 | 1 | 2 }[] = [
    { p: [-18, 0, -10], s: 1.3, v: 0 },
    { p: [-22, 0, 0], s: 1.0, v: 1 },
    { p: [-18, 0, 12], s: 1.4, v: 2 },
    { p: [-12, 0, 22], s: 1.1, v: 0 },
    { p: [10, 0, 26], s: 1.2, v: 1 },
    { p: [22, 0, 18], s: 1.4, v: 0 },
    { p: [26, 0, -2], s: 1.0, v: 2 },
    { p: [22, 0, -16], s: 1.2, v: 1 },
    { p: [8, 0, -22], s: 1.3, v: 0 },
    { p: [-6, 0, -22], s: 1.1, v: 2 },
    { p: [16, 0, 8], s: 0.8, v: 1 },
    { p: [-14, 0, -18], s: 1.0, v: 0 },
  ];
  return (
    <group>
      {placements.map((t, i) => (
        <Tree key={i} position={t.p} scale={t.s} variant={t.v} />
      ))}
    </group>
  );
}

/* ============================================================================
   STARS / FIREFLIES — small twinkling points to add life at twilight
   ============================================================================ */

function useFireflies(count: number = 24) {
  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      arr.push([
        (Math.random() - 0.5) * 24,
        1 + Math.random() * 4,
        (Math.random() - 0.5) * 24,
      ]);
    }
    return arr;
  }, [count]);
  const ref = useRef<THREE.Points>(null!);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime;
      const pos = ref.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const base = positions[i];
        const phase = i * 0.7;
        pos.setY(i, base[1] + Math.sin(t * 0.5 + phase) * 0.3);
        pos.setX(i, base[0] + Math.cos(t * 0.3 + phase) * 0.5);
        pos.setZ(i, base[2] + Math.sin(t * 0.4 + phase * 1.3) * 0.5);
      }
      pos.needsUpdate = true;
    }
  });
  return { ref, positions };
}

export function Fireflies() {
  const { ref, positions } = useFireflies(30);
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length}
          array={new Float32Array(positions.flat())}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffd9a8" size={0.06} sizeAttenuation transparent opacity={0.9} depthWrite={false} />
    </points>
  );
}
