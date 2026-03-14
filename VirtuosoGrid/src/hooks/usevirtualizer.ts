/**
 * Custom virtualization hook for both rows and columns.
 * Handles dynamic sizing, overscan, and measurement caching.
 */
import { useState, useRef, useCallback, useMemo, useEffect } from "react";

export interface VirtualItem {
  index: number;
  start: number;
  size: number;
  end: number;
}

interface UseVirtualizerOptions {
  count: number;
  getItemSize: (index: number) => number;
  overscan?: number;
  paddingStart?: number;
  paddingEnd?: number;
}

interface VirtualizerResult {
  virtualItems: VirtualItem[];
  totalSize: number;
  scrollOffset: number;
  setScrollOffset: (offset: number) => void;
  measurementsCache: number[];
}

export function useVirtualizer({
  count,
  getItemSize,
  overscan = 5,
  paddingStart = 0,
  paddingEnd = 0,
}: UseVirtualizerOptions): VirtualizerResult {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [viewportSize, setViewportSize] = useState(800);
  const measurementsRef = useRef<number[]>([]);

  // Build prefix-sum array for O(1) offset lookups
  const measurements = useMemo(() => {
    const arr: number[] = new Array(count + 1);
    arr[0] = paddingStart;
    for (let i = 0; i < count; i++) {
      arr[i + 1] = arr[i] + getItemSize(i);
    }
    measurementsRef.current = arr;
    return arr;
  }, [count, getItemSize, paddingStart]);

  const totalSize = useMemo(() => {
    return (measurements[count] || 0) + paddingEnd;
  }, [measurements, count, paddingEnd]);

  // Binary search for start index
  const findIndex = useCallback(
    (offset: number): number => {
      let lo = 0,
        hi = count - 1;
      while (lo <= hi) {
        const mid = (lo + hi) >>> 1;
        if (measurements[mid + 1] <= offset) lo = mid + 1;
        else if (measurements[mid] > offset) hi = mid - 1;
        else return mid;
      }
      return lo;
    },
    [measurements, count],
  );

  const virtualItems = useMemo((): VirtualItem[] => {
    if (count === 0) return [];

    const startIdx = findIndex(scrollOffset);
    const endOffset = scrollOffset + viewportSize;
    let endIdx = findIndex(endOffset);

    // Apply overscan
    const overscanStart = Math.max(0, startIdx - overscan);
    const overscanEnd = Math.min(count - 1, endIdx + overscan);

    const items: VirtualItem[] = [];
    for (let i = overscanStart; i <= overscanEnd; i++) {
      items.push({
        index: i,
        start: measurements[i],
        size: measurements[i + 1] - measurements[i],
        end: measurements[i + 1],
      });
    }
    return items;
  }, [count, scrollOffset, viewportSize, overscan, measurements, findIndex]);

  return {
    virtualItems,
    totalSize,
    scrollOffset,
    setScrollOffset,
    measurementsCache: measurementsRef.current,
  };
}

// Viewport size tracker hook
export function useViewportSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return size;
}
