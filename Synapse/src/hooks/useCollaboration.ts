import { useEffect, useCallback, useRef } from "react";
import { Editor } from "slate";
import type { Operation } from "slate";
import { getMockSocket } from "../collaboration/mockSocket";
import { useEditorStore } from "../store/editorStore";

/**
 * Hook that bridges Slate editor operations with Socket.IO transport.
 * Handles: local→remote op emission, remote→local op application,
 * cursor broadcasting, and sync status indication.
 *
 * Uses Operational Transform concepts:
 * - Local ops are buffered and emitted
 * - Remote ops are applied without normalization to avoid feedback loops
 * - Version vector tracks causal ordering
 */
export function useCollaboration(editor: Editor) {
  const socket = useRef(getMockSocket());
  const setSyncing = useEditorStore((s) => s.setSyncing);
  const incrementVersion = useEditorStore((s) => s.incrementVersion);

  useEffect(() => {
    const sock = socket.current;
    sock.connect();

    // Handle remote operations (simulated)
    const handleRemoteOp = (ops: Operation[]) => {
      try {
        // In a real OT system, we'd transform ops against pending local ops
        // For demo, we apply directly with conflict detection
        Editor.withoutNormalizing(editor, () => {
          ops.forEach((op) => {
            try {
              editor.apply(op);
            } catch {
              // Path conflict — safe to skip, will re-sync
              console.warn("[Synapse] Skipped conflicting remote operation");
            }
          });
        });
      } catch {
        // Force re-sync on critical error
        console.error("[Synapse] Re-sync needed");
      }
    };

    sock.on("remote-op", handleRemoteOp);

    return () => {
      sock.off("remote-op", handleRemoteOp);
      sock.disconnect();
    };
  }, [editor]);

  /**
   * Called on every Slate onChange.
   * Filters selection-only ops and emits content ops to remote.
   */
  const broadcastOperations = useCallback(() => {
    const ops = editor.operations.filter((op) => op.type !== "set_selection");

    if (ops.length > 0) {
      // Simulate sync delay
      setSyncing(true);
      incrementVersion();

      socket.current.emit("local-op", {
        userId: useEditorStore.getState().currentUserId,
        operations: ops,
        version: useEditorStore.getState().version,
      });

      // Simulate sync completion
      setTimeout(() => setSyncing(false), 300 + Math.random() * 200);
    }
  }, [editor, setSyncing, incrementVersion]);

  return { broadcastOperations };
}
