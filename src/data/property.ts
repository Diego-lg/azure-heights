import { Vector3 } from "three";

export type ViewId =
  | "exterior"
  | "aerial"
  | "floorplan"
  | "living"
  | "kitchen"
  | "bedroom"
  | "bathroom"
  | "pool";

export interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface RoomFeature {
  icon: string;
  label: string;
}

export interface RoomMeta {
  id: ViewId;
  label: string;
  subtitle: string;
  description: string;
  area: string;
  features: RoomFeature[];
  camera: CameraPreset;
  bounds?: { width: number; depth: number; height: number; center: [number, number, number] };
}

export interface PropertyData {
  name: string;
  tagline: string;
  address: string;
  price: string;
  pricePerSqft: string;
  beds: number;
  baths: number;
  halfBaths: number;
  sqft: number;
  lot: string;
  yearBuilt: number;
  type: string;
  status: "For Sale" | "For Rent" | "Just Sold" | "Coming Soon";
  mls: string;
  agent: {
    name: string;
    title: string;
    phone: string;
  };
}

export const property: PropertyData = {
  name: "Azure Heights",
  tagline: "A modern sanctuary above the bay",
  address: "1280 Coastal Ridge, Malibu, CA 90265",
  price: "$4,295,000",
  pricePerSqft: "$1,484 / sqft",
  beds: 4,
  baths: 4,
  halfBaths: 1,
  sqft: 2895,
  lot: "0.42 acres",
  yearBuilt: 2024,
  type: "Single Family Residence",
  status: "For Sale",
  mls: "#25-462981",
  agent: {
    name: "Elena Marchetti",
    title: "Senior Listing Agent",
    phone: "+1 (310) 555-0184",
  },
};

// World units: 1 unit = 1 meter. Villa footprint is 16m x 12m, two stories.
export const VILLA_BOUNDS = {
  width: 16,
  depth: 12,
  heightFirst: 3.4,
  heightSecond: 3.2,
  roof: 1.6,
  floorThickness: 0.25,
  setback: 0.6, // first floor is set back from the edge on the second level
};

// Interior room layout (ground floor). Coordinates are in meters, origin at the
// center of the building footprint. +x = east, +z = south, +y = up.
export const ROOMS: RoomMeta[] = [
  {
    id: "exterior",
    label: "Exterior",
    subtitle: "Twilight facade",
    description:
      "Floor-to-ceiling glass, cantilevered concrete, and a 14-meter infinity pool that pours toward the Pacific. The facade is clad in hand-troweled limestone with bronze reveals.",
    area: "0.42 acres",
    features: [
      { icon: "◆", label: "Infinity pool" },
      { icon: "◆", label: "3-car garage" },
      { icon: "◆", label: "Smart lighting" },
      { icon: "◆", label: "Drone security" },
    ],
    camera: {
      position: [22, 8, 22],
      target: [0, 4, 0],
      fov: 38,
    },
  },
  {
    id: "aerial",
    label: "Aerial",
    subtitle: "Site plan view",
    description:
      "A 0.42-acre parcel oriented to capture the south-west sunset. Mature olive trees frame the arrival court, with native grasses and a lap pool stretching toward the bluff.",
    area: "0.42 acres",
    features: [
      { icon: "◆", label: "Coastal bluff" },
      { icon: "◆", label: "Olive grove" },
      { icon: "◆", label: "Outdoor kitchen" },
      { icon: "◆", label: "Fire pit lounge" },
    ],
    camera: {
      position: [0, 30, 0.01],
      target: [0, 0, 0],
      fov: 32,
    },
  },
  {
    id: "floorplan",
    label: "Floor Plan",
    subtitle: "Architectural layout",
    description:
      "An open-plan ground floor flows from the chef's kitchen through the dining gallery to the double-height living room. The second story holds three bedroom suites and a flex studio.",
    area: "2,895 sqft",
    features: [
      { icon: "◆", label: "Open plan" },
      { icon: "◆", label: "Double-height" },
      { icon: "◆", label: "Flex studio" },
      { icon: "◆", label: "Elevator" },
    ],
    camera: {
      position: [0, 34, 0.01],
      target: [0, 0, 0],
      fov: 30,
    },
  },
  {
    id: "living",
    label: "Living Room",
    subtitle: "Double-height great room",
    description:
      "A 6.2-meter double-height great room with a cast-concrete hearth, custom Italian travertine floors, and a wall of operable glass that disappears into the wall cavity on warm afternoons.",
    area: "720 sqft",
    features: [
      { icon: "◆", label: "Concrete hearth" },
      { icon: "◆", label: "Travertine floors" },
      { icon: "◆", label: "Smart shades" },
      { icon: "◆", label: "Sonance audio" },
    ],
    camera: {
      position: [3.5, 1.7, -2.5],
      target: [-2, 2.5, -4.0],
      fov: 60,
    },
    bounds: {
      width: 9.5,
      depth: 7,
      height: 6.2,
      center: [0, 3.1, 1.5],
    },
  },
  {
    id: "kitchen",
    label: "Chef's Kitchen",
    subtitle: "Marble & brass",
    description:
      "Calacatta Vagli quartzite waterfall island, integrated Gaggenau appliances, brass reeted hardware, and a butler's pantry with a secondary dishwasher and 90-bottle wine column.",
    area: "385 sqft",
    features: [
      { icon: "◆", label: "Calacatta island" },
      { icon: "◆", label: "Gaggenau suite" },
      { icon: "◆", label: "Wine column" },
      { icon: "◆", label: "Butler's pantry" },
    ],
    camera: {
      position: [-4.0, 1.7, 4.5],
      target: [-5.5, 1.2, 1.5],
      fov: 58,
    },
    bounds: {
      width: 5.5,
      depth: 5.8,
      height: 3.2,
      center: [-3.5, 1.5, 1.5],
    },
  },
  {
    id: "bedroom",
    label: "Primary Suite",
    subtitle: "Ocean-facing retreat",
    description:
      "A serene primary suite with a private terrace, walk-through dressing room, and spa bath finished in honed Tundra Grey marble with a freestanding cast-stone tub.",
    area: "640 sqft",
    features: [
      { icon: "◆", label: "Private terrace" },
      { icon: "◆", label: "Spa bath" },
      { icon: "◆", label: "Walk-in dressing" },
      { icon: "◆", label: "Heated floors" },
    ],
    camera: {
      position: [-4.25, 5.0, -3.4],
      target: [-4.5, 4.6, -4.3],
      fov: 55,
    },
    bounds: {
      width: 4.6,
      depth: 2.2,
      height: 3.2,
      center: [-4.5, 5.0, -4.3],
    },
  },
  {
    id: "bathroom",
    label: "Spa Bath",
    subtitle: "Tundra Grey marble",
    description:
      "A deep-windowed spa bath with a freestanding tub, double rain shower, and custom walnut vanity. Honed marble is book-matched across the wet wall for a continuous veining flow.",
    area: "210 sqft",
    features: [
      { icon: "◆", label: "Freestanding tub" },
      { icon: "◆", label: "Rain shower" },
      { icon: "◆", label: "Walnut vanity" },
      { icon: "◆", label: "Heated floors" },
    ],
    camera: {
      position: [-0.5, 5.0, -3.4],
      target: [3.0, 4.6, -4.5],
      fov: 58,
    },
    bounds: {
      width: 4.0,
      depth: 2.4,
      height: 3.2,
      center: [3.0, 5.0, -4.5],
    },
  },
  {
    id: "pool",
    label: "Pool & Terrace",
    subtitle: "Infinity edge to the Pacific",
    description:
      "A 22-meter infinity pool with a sunken fire lounge, an outdoor kitchen, and an Ipe deck that wraps to a private bluff staircase down to the beach cove.",
    area: "1,180 sqft",
    features: [
      { icon: "◆", label: "22m lap pool" },
      { icon: "◆", label: "Sunken lounge" },
      { icon: "◆", label: "Outdoor kitchen" },
      { icon: "◆", label: "Beach access" },
    ],
    camera: {
      position: [-6, 5, 26],
      target: [3, 0.5, 14],
      fov: 50,
    },
  },
];

export const viewById = (id: ViewId): RoomMeta => ROOMS.find((r) => r.id === id) ?? ROOMS[0];

// Used for the "ground" plane to tile texture in meters
export const GROUND_SIZE = 80;
