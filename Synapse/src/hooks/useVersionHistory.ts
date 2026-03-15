import { useQuery } from "@tanstack/react-query";
import { useEditorStore } from "../store/editorStore";
import type { DocumentVersion } from "../types/editor";

/**
 * React Query hook for fetching version history.
 * In production this would hit an API; here we read from Zustand store
 * and simulate network latency.
 */

async function fetchVersions(documentId: string): Promise<DocumentVersion[]> {
  // Simulate API delay
  await new Promise((r) => setTimeout(r, 400));
  return useEditorStore.getState().versions;
}

export function useVersionHistory() {
  const documentId = useEditorStore((s) => s.documentId);

  return useQuery({
    queryKey: ["versions", documentId],
    queryFn: () => fetchVersions(documentId),
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}
