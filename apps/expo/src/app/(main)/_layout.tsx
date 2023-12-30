import { Slot } from "expo-router";
import { Provider, useAtom } from "jotai";

import { USE_PROVIDER_KEY_TO_RESET_ATOMS } from "~/lib/constants";
import { globalStore, providerKeyAtom } from "~/lib/global-store";
import { TRPCProvider } from "~/utils/api";

export default function MainLayout() {
  const [providerKey] = useAtom(providerKeyAtom, { store: globalStore });

  return (
    <TRPCProvider>
      <Provider key={USE_PROVIDER_KEY_TO_RESET_ATOMS ? providerKey : undefined}>
        <Slot />
      </Provider>
    </TRPCProvider>
  );
}
