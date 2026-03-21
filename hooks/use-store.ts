import { useSyncExternalStore } from "react";
import { subscribe, getSnapshot } from "@/utils/store";
export const useStore = () => useSyncExternalStore(subscribe, getSnapshot);
