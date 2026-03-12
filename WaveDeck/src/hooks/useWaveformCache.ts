import { useRef, useCallback } from "react";

const DB_NAME = "wavedeck-cache";
const STORE_NAME = "waveforms";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE_NAME)) {
        req.result.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function generateFromAudioBuffer(
  audioContext: AudioContext,
  arrayBuffer: ArrayBuffer,
  samples = 80,
): Promise<number[]> {
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const channelData = audioBuffer.getChannelData(0);
  const blockSize = Math.floor(channelData.length / samples);
  const waveform: number[] = [];

  for (let i = 0; i < samples; i++) {
    let sum = 0;
    const start = i * blockSize;
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(channelData[start + j]);
    }
    waveform.push(sum / blockSize);
  }

  const max = Math.max(...waveform);
  return max > 0 ? waveform.map((v) => v / max) : waveform;
}

export function useWaveformCache() {
  const memCache = useRef<Map<string, number[]>>(new Map());
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getWaveform = useCallback(
    async (trackId: string, audioUrl?: string): Promise<number[] | null> => {
      if (memCache.current.has(trackId)) {
        return memCache.current.get(trackId)!;
      }

      try {
        const db = await openDB();
        const stored = await new Promise<number[] | undefined>((resolve) => {
          const tx = db.transaction(STORE_NAME, "readonly");
          const req = tx.objectStore(STORE_NAME).get(trackId);
          req.onsuccess = () => resolve(req.result as number[] | undefined);
          req.onerror = () => resolve(undefined);
        });

        if (stored) {
          memCache.current.set(trackId, stored);
          return stored;
        }

        if (audioUrl) {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContext();
          }
          const response = await fetch(audioUrl);
          const buffer = await response.arrayBuffer();
          const waveform = await generateFromAudioBuffer(
            audioCtxRef.current,
            buffer,
          );

          memCache.current.set(trackId, waveform);
          const writeTx = db.transaction(STORE_NAME, "readwrite");
          writeTx.objectStore(STORE_NAME).put(waveform, trackId);

          return waveform;
        }
      } catch (e) {
        console.warn("Waveform cache error:", e);
      }

      return null;
    },
    [],
  );

  const setWaveform = useCallback(
    async (trackId: string, waveform: number[]) => {
      memCache.current.set(trackId, waveform);
      try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put(waveform, trackId);
      } catch (e) {
        console.warn("Waveform save error:", e);
      }
    },
    [],
  );

  return { getWaveform, setWaveform };
}
