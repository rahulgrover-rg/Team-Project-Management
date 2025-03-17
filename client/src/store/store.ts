import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import createSelectors from "./selectors";
import { create,StateCreator } from "zustand";

type AuthState = {
    accessToken : string | null,
    user: null,
    setAccessToken: (token: string)=>void;
    clearAccessToken: ()=>void;
}

const createAuthSlice: StateCreator<AuthState> = (set) => ({
    accessToken: null,
    user: null,
    setAccessToken: (token) => set({accessToken:token}),
    clearAccessToken: () => set({accessToken:null}),
})

type StoreType = AuthState;

export const useStoreBase = create<StoreType>()(
    devtools(
      persist(
          immer((...a) => ({
            ...createAuthSlice(...a),
          })),
        {
          name: "session-storage", // Name of the item in localStorage (or sessionStorage)
          getStorage: () => sessionStorage, 
        }
      )
    )
  );

export const useStore = createSelectors(useStoreBase);