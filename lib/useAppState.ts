import { readonlyArray, string } from "fp-ts";
import { pipe } from "fp-ts/function";
import create from "zustand";
import { AppState } from "../types";

export const useAppState = create<AppState>((set) => ({
  filter: string.empty,
  setFilter: (filter) => set((s) => ({ ...s, filter })),
  sortBy: "timestamp",
  setSortBy: (sortBy) => set((s) => ({ ...s, sortBy })),
  selected: readonlyArray.empty,
  select: (timestamp) =>
    set(({ selected }) => ({
      selected: pipe(
        selected,
        readonlyArray.append(timestamp),
        readonlyArray.uniq(string.Eq)
      ),
    })),
  setSelected: (selected) => set({ selected }),
  unselect: (timestamp) =>
    set(({ selected }) => ({
      selected: pipe(
        selected,
        readonlyArray.filter((t) => t !== timestamp)
      ),
    })),
  unselectAll: () => set(() => ({ selected: readonlyArray.empty })),
}));
