import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useViewStore } from "../hooks/useView";
import { viewById } from "../data/property";

const DAMP = 5.5; // Higher = snappier transitions

/**
 * CameraRig
 * -----------------------------------------------------------------------------
 * Smoothly animates the camera between the room presets. The OrbitControls
 * are disabled during the transition so they don't fight the lerp, and
 * re-enabled once the camera arrives. The user can orbit freely in any
 * non-aerial view after the transition completes.
 */
export function CameraRig() {
  const controls = useRef<any>(null);
  const { camera } = useThree();
  const current = useViewStore((s) => s.current);
  const setTransitioning = useViewStore((s) => s.setTransitioning);
  const isTransitioning = useViewStore((s) => s.isTransitioning);
  const firstRun = useRef(true);

  // Goal vectors we lerp toward. Held in refs so changes don't trigger re-renders.
  const goalPos = useRef(new THREE.Vector3());
  const goalTarget = useRef(new THREE.Vector3());
  const goalFov = useRef<number>(50);

  useEffect(() => {
    const view = viewById(current);
    goalPos.current.set(...view.camera.position);
    goalTarget.current.set(...view.camera.target);
    goalFov.current = view.camera.fov;

    // For the top-down (aerial / floor-plan) views, snap immediately. The
    // user expects these to feel like a still diagram rather than a flight.
    const isTopDown = current === "aerial" || current === "floorplan";

    if (firstRun.current || isTopDown) {
      // Snap to the goal — no fly-in animation.
      camera.position.copy(goalPos.current);
      camera.lookAt(goalTarget.current);
      if (controls.current) {
        controls.current.target.copy(goalTarget.current);
        controls.current.update();
      }
      if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
        (camera as THREE.PerspectiveCamera).fov = goalFov.current;
        (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
      }
      firstRun.current = false;
      // Make sure the UI doesn't sit in a "transitioning" state.
      if (isTransitioning) setTransitioning(false);
    } else {
      setTransitioning(true);
    }
  }, [current, camera, setTransitioning, isTransitioning]);

  useFrame((_, delta) => {
    if (!controls.current) return;

    // Clamp the lerp factor. At 60fps, delta ~ 0.016, so this is ~0.088/frame.
    // Camera reaches 99% of the goal in about 0.8s.
    const t = Math.min(1, delta * DAMP);

    // Damp camera position
    camera.position.lerp(goalPos.current, t);

    // Damp the orbit target
    controls.current.target.lerp(goalTarget.current, t);

    // Damp FOV
    const cam = camera as THREE.PerspectiveCamera;
    if (cam.isPerspectiveCamera) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, goalFov.current, t);
      cam.updateProjectionMatrix();
    }

    // Make the camera look at the (lerped) target. We do this here so the
    // orientation is correct even when OrbitControls are disabled mid-flight.
    camera.lookAt(controls.current.target);

    // Re-derive OrbitControls' internal spherical state from the new
    // (position, target) pair. Skipping this causes a small visual jump on
    // the first user input after a transition.
    controls.current.update();

    // Stop the "transitioning" flag once we're close enough to the goal.
    const posDist = camera.position.distanceTo(goalPos.current);
    const tgtDist = controls.current.target.distanceTo(goalTarget.current);
    if (isTransitioning && posDist < 0.02 && tgtDist < 0.02) {
      // Snap exactly to the goal to avoid any residual drift.
      camera.position.copy(goalPos.current);
      controls.current.target.copy(goalTarget.current);
      camera.lookAt(controls.current.target);
      controls.current.update();
      setTransitioning(false);
    }
  });

  // Disable orbit input while the camera is in flight, and for the locked
  // top-down views. Otherwise allow free orbit + a small zoom range.
  const isAerial = current === "aerial" || current === "floorplan";
  const allowOrbit = !isAerial && !isTransitioning;

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enabled={allowOrbit}
      enablePan={false}
      enableZoom={!isAerial}
      enableRotate={!isAerial}
      enableDamping
      dampingFactor={0.08}
      minDistance={1.2}
      maxDistance={isAerial ? 60 : 14}
      minPolarAngle={0.05}
      maxPolarAngle={Math.PI - 0.05}
    />
  );
}
