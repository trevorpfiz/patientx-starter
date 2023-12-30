import { globalStore, providerKeyAtom } from "~/lib/global-store";

// Reset state of all atoms in child provider by iterating the key and remounting it. For "log out" feature.
export const useResetState = () => {
  return () => globalStore.set(providerKeyAtom, (prev) => prev + 1);
};
