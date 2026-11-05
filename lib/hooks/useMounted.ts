import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** true en el cliente después de hidratar, false en el servidor. */
export function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}
