import { useEffect, type DependencyList } from 'react';
import { whenIdle } from './motion';

/**
 * Like useEffect, but the setup runs when the browser is idle.
 * Keeps hydration short and splits start-up work into small tasks (better TBT and INP).
 */
export function useIdleEffect(setup: () => void | (() => void), deps: DependencyList): void {
  useEffect(() => {
    let dispose: void | (() => void);
    const cancel = whenIdle(() => {
      dispose = setup();
    });
    return () => {
      cancel();
      dispose?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
