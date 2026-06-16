import { useMemo } from "react";
import * as THREE from "three";
import { VILLA_BOUNDS } from "../data/property";

const W = VILLA_BOUNDS.width;
const D = VILLA_BOUNDS.depth;

/**
 * FloorPlan
 * ---------------------------------------------------------------------------
 * A 2D floor plan drawn into a CanvasTexture and laid on the ground. The
 * ground floor plan is centered on the building footprint in world space, and
 * the second floor plan is shown as a smaller inset in the bottom-right
 * corner. The composition is always centered on the building, so the camera
 * looking straight down frames it perfectly.
 */
export function FloorPlan() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = "#0c0e14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    /* ------------------------------------------------------------------
       GROUND FLOOR PLAN — centered on the canvas (and therefore on the
       building footprint in world space). 1400x800 box, centered at
       (1024, 512).
       ------------------------------------------------------------------ */
    const gW = 1400;
    const gH = 800;
    const gX = (canvas.width - gW) / 2; // 324
    const gY = (canvas.height - gH) / 2; // 112

    // Plan frame
    ctx.strokeStyle = "rgba(212,175,122,0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(gX - 4, gY - 4, gW + 8, gH + 8);

    // Title
    ctx.fillStyle = "#d4af7a";
    ctx.font = "600 28px Inter, system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("GROUND FLOOR", gX, gY - 28);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "400 16px Inter, system-ui, sans-serif";
    ctx.fillText("Open plan · 1,540 sqft", gX, gY - 8);

    // Coordinate mappers for the ground floor plan
    const sx = (x: number) => gX + ((x + W / 2) / W) * gW;
    const sy = (z: number) => gY + ((z + D / 2) / D) * gH;

    // Background fill for the building footprint
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.fillRect(sx(-W / 2), sy(-D / 2), sx(W / 2) - sx(-W / 2), sy(D / 2) - sy(-D / 2));

    // Outer walls
    ctx.strokeStyle = "#f3f1ec";
    ctx.lineWidth = 6;
    ctx.strokeRect(sx(-W / 2), sy(-D / 2), sx(W / 2) - sx(-W / 2), sy(D / 2) - sy(-D / 2));

    // Interior partition (z = -1) — half-wall in the building, so draw it
    // thinner and lighter
    ctx.strokeStyle = "rgba(243,241,236,0.6)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sx(-W / 2), sy(-1));
    ctx.lineTo(sx(-3.5), sy(-1));
    ctx.moveTo(sx(-3.5), sy(-1));
    ctx.lineTo(sx(-3.5), sy(D / 2));
    ctx.stroke();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#f3f1ec";

    // Stair opening
    ctx.fillStyle = "rgba(212,175,122,0.15)";
    ctx.fillRect(sx(-6.5), sy(2), sx(-5.3) - sx(-6.5), sy(4) - sy(2));
    ctx.strokeStyle = "rgba(212,175,122,0.6)";
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(sx(-6.5), sy(2), sx(-5.3) - sx(-6.5), sy(4) - sy(2));
    ctx.setLineDash([]);
    // Stair direction lines
    ctx.strokeStyle = "rgba(212,175,122,0.4)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 16; i++) {
      const z1 = 2 + (i / 16) * 2;
      const z2 = 2 + ((i + 1) / 16) * 2;
      ctx.beginPath();
      ctx.moveTo(sx(-6.5) + (i / 16) * (sx(-5.3) - sx(-6.5)), sy(z1));
      ctx.lineTo(sx(-6.5) + (i / 16) * (sx(-5.3) - sx(-6.5)), sy(z2));
      ctx.stroke();
    }
    // "UP" label for stairs
    ctx.fillStyle = "#d4af7a";
    ctx.font = "600 11px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("UP", sx(-5.9), sy(3) - 4);
    ctx.textAlign = "left";
    ctx.lineWidth = 6;

    // Glass south wall — dashed
    ctx.setLineDash([10, 6]);
    ctx.beginPath();
    ctx.moveTo(sx(-W / 2), sy(D / 2));
    ctx.lineTo(sx(W / 2 - 1.4), sy(D / 2));
    ctx.stroke();
    ctx.setLineDash([]);

    // Door swing
    ctx.strokeStyle = "rgba(212,175,122,0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sx(W / 2 - 1.4), sy(D / 2), 35, -Math.PI / 2, 0);
    ctx.stroke();
    ctx.lineWidth = 6;

    // Helpers for labels and furniture icons
    function label(text: string, x: number, z: number, size = 22) {
      ctx.fillStyle = "#f3f1ec";
      ctx.font = `500 ${size}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(text, sx(x), sy(z));
      ctx.textAlign = "left";
    }
    function sublabel(text: string, x: number, z: number, size = 13) {
      ctx.fillStyle = "rgba(212,175,122,0.9)";
      ctx.font = `400 ${size}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(text, sx(x), sy(z));
      ctx.textAlign = "start";
    }
    function icon(x: number, z: number, w: number, d: number, rot = 0, color = "212,175,122") {
      ctx.save();
      ctx.translate(sx(x), sy(z));
      ctx.rotate(rot);
      ctx.fillStyle = `rgba(${color},0.25)`;
      ctx.fillRect(-w / 2, -d / 2, w, d);
      ctx.strokeStyle = `rgba(${color},0.7)`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-w / 2, -d / 2, w, d);
      ctx.restore();
      ctx.lineWidth = 6;
    }

    // Room labels
    label("LIVING ROOM", 2, -3.5, 26);
    sublabel("Double-height · 720 sqft", 2, -2.5);
    icon(2, -2, 2.6, 1.0);

    label("KITCHEN", -3.5, 2, 22);
    sublabel("Chef's island · 385 sqft", -3.5, 2.7);
    icon(-3.5, 1.5, 3.4, 1.2, 0);

    label("DINING", 3, 3, 18);
    sublabel("Seats 6", 3, 3.6);
    icon(3, 3, 2.4, 1.1, 0);

    label("ENTRY", 5.5, 4.8, 14);
    sublabel("Foyer", 5.5, 5.2);

    // North arrow (inside the plan, top-center)
    ctx.fillStyle = "#d4af7a";
    ctx.font = "500 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("N", sx(0), sy(-D / 2) - 12);
    ctx.beginPath();
    ctx.moveTo(sx(0), sy(-D / 2) - 6);
    ctx.lineTo(sx(0) - 4, sy(-D / 2));
    ctx.lineTo(sx(0) + 4, sy(-D / 2));
    ctx.closePath();
    ctx.fill();
    ctx.textAlign = "start";

    // Scale bar (bottom of plan)
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "400 12px Inter, system-ui, sans-serif";
    ctx.fillText("0    2m    4m", sx(-W / 2), sy(D / 2) + 22);
    ctx.fillRect(sx(-W / 2), sy(D / 2) + 12, sx(-W / 2 + 4) - sx(-W / 2), 3);

    /* ------------------------------------------------------------------
       SECOND FLOOR PLAN — inset in the bottom-right corner. Smaller,
       shows the same coordinate system as the ground floor.
       ------------------------------------------------------------------ */
    const sW = 560;
    const sH = 380;
    const sX = canvas.width - sW - 60; // ~1428
    const sY = canvas.height - sH - 60; // ~584

    // Inset frame
    ctx.strokeStyle = "rgba(212,175,122,0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(sX - 4, sY - 4, sW + 8, sH + 8);

    // Title
    ctx.fillStyle = "#d4af7a";
    ctx.font = "600 20px Inter, system-ui, sans-serif";
    ctx.fillText("SECOND FLOOR", sX, sY - 22);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "400 13px Inter, system-ui, sans-serif";
    ctx.fillText("3 bedrooms · 1,355 sqft", sX, sY - 6);

    // Second floor coordinate mappers (second floor is set back from edges
    // by VILLA_BOUNDS.setback, so the actual interior is inset).
    const SET = VILLA_BOUNDS.setback;
    const sfX0 = -W / 2 + SET;
    const sfX1 = W / 2 - SET;
    const sfZ0 = -D / 2 + SET;
    const sfZ1 = D / 2 - SET - 0.5; // -0.5 to account for slab offset
    const sfW = sfX1 - sfX0;
    const sfD = sfZ1 - sfZ0;
    const ssx = (x: number) => sX + ((x - sfX0) / sfW) * sW;
    const ssy = (z: number) => sY + ((z - sfZ0) / sfD) * sH;

    // Outer walls
    ctx.strokeStyle = "#f3f1ec";
    ctx.lineWidth = 5;
    ctx.strokeRect(ssx(sfX0), ssy(sfZ0), ssx(sfX1) - ssx(sfX0), ssy(sfZ1) - ssy(sfZ0));

    // Interior partition between primary bedroom and bath (z=-3.2)
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ssx(sfX0), ssy(-3.2));
    ctx.lineTo(ssx(-2.4), ssy(-3.2));
    ctx.moveTo(ssx(-0.8), ssy(-3.2));
    ctx.lineTo(ssx(0.8), ssy(-3.2));
    ctx.stroke();

    // Wall between primary and guest bedroom (x=-2.8)
    ctx.beginPath();
    ctx.moveTo(ssx(-2.8), ssy(sfZ0));
    ctx.lineTo(ssx(-2.8), ssy(1.0));
    ctx.stroke();

    // Wall between guest bedroom and stair/landing (z=1.0)
    ctx.beginPath();
    ctx.moveTo(ssx(-2.9), ssy(1.0));
    ctx.lineTo(ssx(0.1), ssy(1.0));
    ctx.stroke();
    ctx.lineWidth = 5;

    // Labels
    function sLabel(text: string, x: number, z: number, size = 14) {
      ctx.fillStyle = "#f3f1ec";
      ctx.font = `500 ${size}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(text, ssx(x), ssy(z));
      ctx.textAlign = "start";
    }
    sLabel("PRIMARY", -4.5, -4.2, 13);
    sLabel("SUITE", -4.5, -3.9, 13);
    sLabel("BATH", 1.8, -4.2, 11);
    sLabel("BED 2", -4.5, -1.5, 12);
    sLabel("BED 3", -0.5, -1.5, 12);
    sLabel("STUDY", 3.5, -1, 11);
    sLabel("STAIR", -1.5, 2, 11);

    // Bed icon in primary suite
    ctx.fillStyle = "rgba(212,175,122,0.3)";
    ctx.fillRect(ssx(-5.2), ssy(-4.8), ssx(-3.8) - ssx(-5.2), ssy(-4.0) - ssy(-4.8));
    ctx.strokeStyle = "rgba(212,175,122,0.7)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(ssx(-5.2), ssy(-4.8), ssx(-3.8) - ssx(-5.2), ssy(-4.0) - ssy(-4.8));
    ctx.lineWidth = 5;

    // Tub icon in bath
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.ellipse(ssx(2.0), ssy(-4.5), 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    /* ------------------------------------------------------------------
       HEADER + FOOTER
       ------------------------------------------------------------------ */
    // Title (top-left)
    ctx.fillStyle = "#f3f1ec";
    ctx.font = "italic 600 36px 'Playfair Display', serif";
    ctx.fillText("Azure Heights", 40, 56);

    // Subtitle
    ctx.fillStyle = "rgba(212,175,122,0.9)";
    ctx.font = "400 14px Inter, system-ui, sans-serif";
    ctx.fillText("Floor Plans · 2,895 sqft total", 40, 80);

    // Footer (bottom-left)
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "400 12px Inter, system-ui, sans-serif";
    ctx.fillText("Scale 1 : 200 · Dimensions in meters", 40, canvas.height - 30);

    // Legend (top-right)
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "400 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("─── solid wall", canvas.width - 40, 50);
    ctx.fillText("─ ─ glass / opening", canvas.width - 40, 70);
    ctx.fillText("██ furniture", canvas.width - 40, 90);
    ctx.textAlign = "start";

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    <group position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh material={new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false })}>
        <planeGeometry args={[W * 2.0, D * 1.33]} />
      </mesh>
    </group>
  );
}
