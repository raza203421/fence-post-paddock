import { useEffect, useState } from 'react';
import { Records, Settings, getRecords, getSettings, subscribe } from '../game/storage';

/** Thin subscription to the device-local records/settings singleton. */
export function useStore(): { records: Records; settings: Settings } {
  const [snapshot, setSnapshot] = useState(() => ({
    records: getRecords(),
    settings: getSettings(),
  }));

  useEffect(
    () => subscribe(() => setSnapshot({ records: getRecords(), settings: getSettings() })),
    [],
  );

  return snapshot;
}

export default useStore;
