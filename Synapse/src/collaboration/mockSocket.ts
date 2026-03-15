/**
 * Mock Socket.IO-like transport for collaborative editing demo.
 * Simulates remote users joining, typing, and cursor movements
 * without needing an actual WebSocket server.
 *
 * In production, replace this with real socket.io-client connections.
 */

import { useEditorStore } from "../store/editorStore";
import type { Participant, CursorPosition } from "../types/editor";

type EventHandler = (...args: any[]) => void;

const SIMULATED_USERS: Omit<Participant, "cursor" | "isTyping" | "lastSeen">[] =
  [
    { id: "sim-user-1", name: "Sarah Chen", color: "var(--cursor-user-1)" },
    { id: "sim-user-2", name: "Marcus Lee", color: "var(--cursor-user-2)" },
  ];

class MockSocket {
  private handlers = new Map<string, Set<EventHandler>>();
  private intervals: ReturnType<typeof setInterval>[] = [];
  private connected = false;

  connect(): this {
    if (this.connected) return this;
    this.connected = true;

    // Simulate users joining after a short delay
    setTimeout(() => {
      const store = useEditorStore.getState();
      SIMULATED_USERS.forEach((user) => {
        store.setParticipant(user.id, {
          ...user,
          cursor: null,
          isTyping: false,
          lastSeen: Date.now(),
        });
      });
      this.emit("participants-updated");
    }, 1200);

    // Simulate cursor movements
    const cursorInterval = setInterval(() => {
      const store = useEditorStore.getState();
      const content = store.content;
      if (!content.length) return;

      SIMULATED_USERS.forEach((user) => {
        const pathIndex = Math.floor(
          Math.random() * Math.min(content.length, 6),
        );
        const offset = Math.floor(Math.random() * 20);
        const cursor: CursorPosition = {
          anchor: { path: [pathIndex, 0], offset },
          focus: { path: [pathIndex, 0], offset },
        };
        store.setParticipant(user.id, {
          ...user,
          cursor,
          isTyping: Math.random() > 0.6,
          lastSeen: Date.now(),
        });
      });
    }, 3000);

    this.intervals.push(cursorInterval);

    // Simulate typing indicators
    const typingInterval = setInterval(() => {
      const store = useEditorStore.getState();
      SIMULATED_USERS.forEach((user) => {
        const isTyping = Math.random() > 0.7;
        store.setParticipantTyping(user.id, isTyping);
        if (isTyping) {
          setTimeout(
            () => {
              store.setParticipantTyping(user.id, false);
            },
            1500 + Math.random() * 2000,
          );
        }
      });
    }, 5000);

    this.intervals.push(typingInterval);

    return this;
  }

  on(event: string, handler: EventHandler): this {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    return this;
  }

  off(event: string, handler?: EventHandler): this {
    if (handler) {
      this.handlers.get(event)?.delete(handler);
    } else {
      this.handlers.delete(event);
    }
    return this;
  }

  emit(event: string, ...args: any[]): this {
    this.handlers.get(event)?.forEach((h) => h(...args));
    return this;
  }

  disconnect(): this {
    this.connected = false;
    this.intervals.forEach(clearInterval);
    this.intervals = [];
    const store = useEditorStore.getState();
    SIMULATED_USERS.forEach((u) => store.removeParticipant(u.id));
    return this;
  }
}

// Singleton
let instance: MockSocket | null = null;

export function getMockSocket(): MockSocket {
  if (!instance) {
    instance = new MockSocket();
  }
  return instance;
}
