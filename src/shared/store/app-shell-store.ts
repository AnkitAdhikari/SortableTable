import { create } from "zustand";

type ThemePreference = "light" | "system";
type TableDensity = "comfortable" | "compact";

type AppShellState = {
  sidebarCollapsed: boolean;
  theme: ThemePreference;
  /** Session UI preference — not URL/shareable. Reference usage: modules/users/ui/UsersPage. */
  tableDensity: TableDensity;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: ThemePreference) => void;
  setTableDensity: (density: TableDensity) => void;
  toggleTableDensity: () => void;
};

export const useAppShellStore = create<AppShellState>((set) => ({
  sidebarCollapsed: false,
  theme: "light",
  tableDensity: "comfortable",
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setTheme: (theme) => set({ theme }),
  setTableDensity: (tableDensity) => set({ tableDensity }),
  toggleTableDensity: () =>
    set((state) => ({
      tableDensity:
        state.tableDensity === "comfortable" ? "compact" : "comfortable",
    })),
}));
