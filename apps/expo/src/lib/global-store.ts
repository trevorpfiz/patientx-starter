import { atom, createStore } from "jotai";

export const globalStore = createStore();
export const providerKeyAtom = atom(1);

// Set initial value of providerKeyAtom in globalStore
globalStore.set(providerKeyAtom, 1);

// Note: this is the global store for the root Jotai Provider with the main goal of housing the providerKeyAtom to reset the child Provider's atoms on "log out"
