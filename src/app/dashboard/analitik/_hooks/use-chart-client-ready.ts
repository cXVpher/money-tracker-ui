"use client";

import { useSyncExternalStore } from "react";

const subscribeToClientReadyState = () => () => {};
const getClientReadySnapshot = () => true;
const getServerReadySnapshot = () => false;

export function useChartClientReady() {
  return useSyncExternalStore(
    subscribeToClientReadyState,
    getClientReadySnapshot,
    getServerReadySnapshot
  );
}
