import * as THREE from "three";

// Centralized material library. Pre-built shared instances so we don't churn
// GPU memory and so the palette stays consistent across every component.

export const palette = {
  // Exterior
  limestone: "#e6dccd",
  limestoneDeep: "#cfc4b0",
  concrete: "#a8a39a",
  concreteDark: "#7c7872",
  bronze: "#8a6a3e",
  bronzeBright: "#c79a5e",
  // Roof
  roofMatte: "#1f2125",
  // Interiors
  wallWarm: "#f0e8d8",
  wallCool: "#e6e2d8",
  wallAccent: "#2b2a28",
  floorTravertine: "#d8c8a8",
  floorWalnut: "#5a3f28",
  floorConcrete: "#b8b1a3",
  floorMarble: "#ece4d2",
  // Kitchen
  marble: "#ece4d2",
  marbleVein: "#bcb09a",
  cabinetLight: "#d6cbb6",
  cabinetDark: "#2a2622",
  brass: "#b5904d",
  // Bedroom
  bedding: "#d8c8b4",
  beddingAccent: "#7a5a3a",
  headboard: "#3a2e22",
  // Bathroom
  tubWhite: "#f1ede4",
  tundra: "#bcb6a8",
  // Outdoor
  grass: "#5a6e3a",
  grassDark: "#3f4f29",
  pool: "#2a8fb5",
  poolDeep: "#185d7d",
  ipe: "#6e4a2c",
  // Misc
  glass: "#9fcfd8",
  glassEdge: "#3a4f55",
  black: "#0e0f12",
  white: "#f5f1e8",
  warm: "#f1c486",
};

const make = (color: string, params: Partial<THREE.MeshStandardMaterialParameters> = {}) => {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.05, ...params });
};

/**
 * Build a procedural noise normal map at the given resolution. We use a
 * simple value-noise function so we don't need any external textures.
 */
function makeNoiseNormalMap(size = 256, strength = 0.5): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  const grid = 32;
  const gridData: number[] = new Array(grid * grid);
  for (let i = 0; i < gridData.length; i++) gridData[i] = Math.random();
  const noise = (x: number, y: number) => {
    const gx = (x / size) * grid;
    const gy = (y / size) * grid;
    const x0 = Math.floor(gx) % grid;
    const y0 = Math.floor(gy) % grid;
    const x1 = (x0 + 1) % grid;
    const y1 = (y0 + 1) % grid;
    const fx = gx - Math.floor(gx);
    const fy = gy - Math.floor(gy);
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    const n00 = gridData[y0 * grid + x0];
    const n10 = gridData[y0 * grid + x1];
    const n01 = gridData[y1 * grid + x0];
    const n11 = gridData[y1 * grid + x1];
    return n00 * (1 - sx) * (1 - sy) + n10 * sx * (1 - sy) + n01 * (1 - sx) * sy + n11 * sx * sy;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const hx = noise(x + 1, y) - noise(x - 1, y);
      const hy = noise(x, y + 1) - noise(x, y - 1);
      const nx = -hx * strength;
      const ny = -hy * strength;
      const nz = 1.0;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      img.data[idx] = ((nx / len) * 0.5 + 0.5) * 255;
      img.data[idx + 1] = ((ny / len) * 0.5 + 0.5) * 255;
      img.data[idx + 2] = ((nz / len) * 0.5 + 0.5) * 255;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

/**
 * Procedural roughness map (slight variation) so highlights don't read as
 * perfectly uniform plastic.
 */
function makeNoiseRoughnessMap(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = 200 + Math.random() * 40;
    img.data[i * 4] = v;
    img.data[i * 4 + 1] = v;
    img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// Shared noise textures (lazy-instantiated)
let _normalMap: THREE.CanvasTexture | null = null;
let _normalMapCoarse: THREE.CanvasTexture | null = null;
let _roughnessMap: THREE.CanvasTexture | null = null;
const normalMap = () => (_normalMap ??= makeNoiseNormalMap(256, 0.5));
const normalMapCoarse = () => (_normalMapCoarse ??= makeNoiseNormalMap(256, 0.8));
const roughnessMap = () => (_roughnessMap ??= makeNoiseRoughnessMap(256));

export const materials = {
  // Exterior — plain MeshStandardMaterial (no normal maps on the big
  // surfaces; the procedural normal maps were eating fillrate)
  limestone: make(palette.limestone, { roughness: 0.88, metalness: 0.0 }),
  limestoneDeep: make(palette.limestoneDeep, { roughness: 0.88, metalness: 0.0 }),
  concrete: make(palette.concrete, { roughness: 0.9, metalness: 0.0 }),
  concreteDark: make(palette.concreteDark, { roughness: 0.95 }),
  // Metals — boost envMapIntensity so they actually pick up the IBL
  bronze: new THREE.MeshStandardMaterial({
    color: palette.bronze,
    metalness: 0.9,
    roughness: 0.32,
    envMapIntensity: 1.2,
  }),
  bronzeBright: new THREE.MeshStandardMaterial({
    color: palette.bronzeBright,
    metalness: 0.92,
    roughness: 0.22,
    envMapIntensity: 1.4,
  }),
  roofMatte: make(palette.roofMatte, { roughness: 0.7 }),

  // Walls
  wallWarm: make(palette.wallWarm, { roughness: 0.95 }),
  wallCool: make(palette.wallCool, { roughness: 0.95 }),
  wallAccent: make(palette.wallAccent, { roughness: 0.8 }),

  // Floors
  floorTravertine: make(palette.floorTravertine, { roughness: 0.6 }),
  floorWalnut: make(palette.floorWalnut, { roughness: 0.5, metalness: 0.05 }),
  floorConcrete: make(palette.floorConcrete, { roughness: 0.88 }),
  // Marble / polished surfaces get MeshPhysicalMaterial with clearcoat
  floorMarble: new THREE.MeshPhysicalMaterial({
    color: palette.floorMarble,
    roughness: 0.22,
    metalness: 0.05,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.0,
  }),
  floorDark: make("#1a1a1a", { roughness: 0.6 }),

  // Kitchen
  marble: new THREE.MeshPhysicalMaterial({
    color: palette.marble,
    roughness: 0.15,
    metalness: 0.05,
    clearcoat: 0.7,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.2,
  }),
  cabinetLight: make(palette.cabinetLight, { roughness: 0.35 }),
  cabinetDark: make(palette.cabinetDark, { roughness: 0.4, metalness: 0.05 }),
  brass: new THREE.MeshStandardMaterial({
    color: palette.brass,
    metalness: 0.92,
    roughness: 0.18,
    envMapIntensity: 1.3,
  }),

  // Bedroom
  bedding: make(palette.bedding, { roughness: 0.98 }),
  beddingAccent: make(palette.beddingAccent, { roughness: 0.9 }),
  headboard: make(palette.headboard, { roughness: 0.75 }),

  // Bathroom
  tubWhite: make(palette.tubWhite, { roughness: 0.2, metalness: 0.0 }),
  tundra: make(palette.tundra, { roughness: 0.3 }),

  // Outdoor
  grass: make(palette.grass, { roughness: 1.0 }),
  grassDark: make(palette.grassDark, { roughness: 1.0 }),
  // Pool water — plain MeshStandardMaterial, no transmission/clearcoat
  pool: new THREE.MeshStandardMaterial({
    color: palette.pool,
    roughness: 0.15,
    metalness: 0.0,
    envMapIntensity: 1.0,
    emissive: "#0a3a4a",
    emissiveIntensity: 0.3,
  }),
  poolDeep: new THREE.MeshStandardMaterial({
    color: palette.poolDeep,
    roughness: 0.15,
    metalness: 0.2,
  }),
  ipe: make(palette.ipe, { roughness: 0.7 }),

  // Glass — MeshStandardMaterial with low roughness + high envMapIntensity
  // fakes the look of glass without the cost of MeshPhysicalMaterial
  // transmission (which was forcing a second full-scene render pass).
  glass: new THREE.MeshStandardMaterial({
    color: palette.glass,
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity: 0.35,
    envMapIntensity: 1.4,
    emissive: "#3a6f7a",
    emissiveIntensity: 0.15,
  }),
  glassEdge: new THREE.MeshStandardMaterial({
    color: palette.glassEdge,
    metalness: 0.65,
    roughness: 0.3,
    envMapIntensity: 1.0,
  }),
  black: make(palette.black, { roughness: 0.5 }),
  white: make(palette.white, { roughness: 0.4 }),
  warm: make(palette.warm, {
    emissive: palette.warm,
    emissiveIntensity: 1.4,
    roughness: 0.4,
  }),
  walnutTable: make(palette.floorWalnut, { roughness: 0.45, metalness: 0.05 }),
  warmAccent: make("#c79a5e", { roughness: 0.7 }),
};
