import { create } from "zustand";
import type { Descendant } from "slate";
import type {
  Participant,
  CommentThread,
  CommentReply,
  DocumentVersion,
  SidebarPanel,
} from "../types/editor";

interface EditorState {
  // Document
  documentId: string;
  documentTitle: string;
  content: Descendant[];
  isSyncing: boolean;
  version: number;

  // Presence
  currentUserId: string;
  currentUserName: string;
  participants: Map<string, Participant>;

  // Comments
  comments: CommentThread[];
  activeCommentId: string | null;

  // History
  versions: DocumentVersion[];
  activeVersionId: string | null;

  // UI
  sidebarPanel: SidebarPanel;

  // Actions — Document
  setDocumentTitle: (title: string) => void;
  setContent: (content: Descendant[]) => void;
  setSyncing: (syncing: boolean) => void;
  incrementVersion: () => void;

  // Actions — Presence
  setParticipant: (id: string, participant: Participant) => void;
  removeParticipant: (id: string) => void;
  setParticipantTyping: (id: string, isTyping: boolean) => void;

  // Actions — Comments
  addComment: (thread: CommentThread) => void;
  addReply: (commentId: string, reply: CommentReply) => void;
  resolveComment: (commentId: string) => void;
  setActiveComment: (id: string | null) => void;

  // Actions — History
  addVersion: (version: DocumentVersion) => void;
  setActiveVersion: (id: string | null) => void;

  // Actions — UI
  setSidebarPanel: (panel: SidebarPanel) => void;
}

// Generate random user for demo
const userId = crypto.randomUUID();
const userNames = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
const userName = userNames[Math.floor(Math.random() * userNames.length)];

const initialContent: Descendant[] = [
  {
    type: "heading-one",
    children: [{ text: "Welcome to Synapse" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Synapse is a collaborative document editor. Start typing to edit this document. ",
      },
      { text: "Bold", bold: true },
      { text: ", " },
      { text: "italic", italic: true },
      { text: ", and " },
      { text: "underline", underline: true },
      { text: " formatting are all supported." },
    ],
  },
  {
    type: "heading-two",
    children: [{ text: "Features" }],
  },
  {
    type: "bulleted-list",
    children: [
      {
        type: "list-item",
        children: [{ text: "Rich text editing with Slate.js" }],
      },
      {
        type: "list-item",
        children: [{ text: "Multi-user collaboration with live cursors" }],
      },
      {
        type: "list-item",
        children: [{ text: "Comment threads on selected text" }],
      },
      {
        type: "list-item",
        children: [{ text: "Version history with snapshots" }],
      },
    ] as any,
  },
  {
    type: "blockquote",
    children: [
      {
        text: "The best way to predict the future is to invent it. — Alan Kay",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Try selecting text and using the toolbar above, or press Ctrl+B for bold, Ctrl+I for italic, and Ctrl+U for underline.",
      },
    ],
  },
];

export const useEditorStore = create<EditorState>((set, get) => ({
  documentId: "doc-001",
  documentTitle: "Untitled Document",
  content: initialContent,
  isSyncing: false,
  version: 1,
  currentUserId: userId,
  currentUserName: userName,
  participants: new Map(),
  comments: [],
  activeCommentId: null,
  versions: [],
  activeVersionId: null,
  sidebarPanel: null,

  setDocumentTitle: (title) => set({ documentTitle: title }),
  setContent: (content) => set({ content }),
  setSyncing: (syncing) => set({ isSyncing: syncing }),
  incrementVersion: () => set((s) => ({ version: s.version + 1 })),

  setParticipant: (id, participant) =>
    set((s) => {
      const next = new Map(s.participants);
      next.set(id, participant);
      return { participants: next };
    }),

  removeParticipant: (id) =>
    set((s) => {
      const next = new Map(s.participants);
      next.delete(id);
      return { participants: next };
    }),

  setParticipantTyping: (id, isTyping) =>
    set((s) => {
      const p = s.participants.get(id);
      if (!p) return s;
      const next = new Map(s.participants);
      next.set(id, { ...p, isTyping });
      return { participants: next };
    }),

  addComment: (thread) => set((s) => ({ comments: [...s.comments, thread] })),

  addReply: (commentId, reply) =>
    set((s) => ({
      comments: s.comments.map((t) =>
        t.comment.id === commentId
          ? { ...t, replies: [...t.replies, reply] }
          : t,
      ),
    })),

  resolveComment: (commentId) =>
    set((s) => ({
      comments: s.comments.map((t) =>
        t.comment.id === commentId
          ? { ...t, comment: { ...t.comment, resolved: true } }
          : t,
      ),
    })),

  setActiveComment: (id) => set({ activeCommentId: id }),

  addVersion: (version) => set((s) => ({ versions: [version, ...s.versions] })),

  setActiveVersion: (id) => set({ activeVersionId: id }),

  setSidebarPanel: (panel) =>
    set((s) => ({
      sidebarPanel: s.sidebarPanel === panel ? null : panel,
    })),
}));
