import { create } from "zustand";
import type { ViewId } from "../data/property";
import { ROOMS, viewById } from "../data/property";

interface ViewState {
  current: ViewId;
  hoveredRoom: ViewId | null;
  isTransitioning: boolean;
  setView: (id: ViewId) => void;
  setHovered: (id: ViewId | null) => void;
  setTransitioning: (b: boolean) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  current: "exterior",
  hoveredRoom: null,
  isTransitioning: false,
  setView: (id) => set({ current: id, hoveredRoom: null }),
  setHovered: (id) => set({ hoveredRoom: id }),
  setTransitioning: (b) => set({ isTransitioning: b }),
}));

export const viewOrder: ViewId[] = ROOMS.map((r) => r.id);
export const currentView = () => viewById(useViewStore.getState().current);
