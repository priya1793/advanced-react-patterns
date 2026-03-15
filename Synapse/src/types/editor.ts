import { z } from "zod";
import type { BaseEditor, Descendant, BaseRange } from "slate";
import type { ReactEditor } from "slate-react";
import type { HistoryEditor } from "slate-history";

// ---- Custom Slate Types ----

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  highlight?: boolean;
  commentId?: string;
};

export type ParagraphElement = { type: "paragraph"; children: CustomText[] };
export type HeadingOneElement = { type: "heading-one"; children: CustomText[] };
export type HeadingTwoElement = { type: "heading-two"; children: CustomText[] };
export type HeadingThreeElement = {
  type: "heading-three";
  children: CustomText[];
};
export type BlockquoteElement = { type: "blockquote"; children: CustomText[] };
export type BulletedListElement = {
  type: "bulleted-list";
  children: ListItemElement[];
};
export type NumberedListElement = {
  type: "numbered-list";
  children: ListItemElement[];
};
export type ListItemElement = { type: "list-item"; children: CustomText[] };
export type CodeBlockElement = { type: "code-block"; children: CustomText[] };

export type CustomElement =
  | ParagraphElement
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | BlockquoteElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement
  | CodeBlockElement;

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
    Range: BaseRange & { commentId?: string };
  }
}

// ---- Collaboration Types ----

export interface Participant {
  id: string;
  name: string;
  color: string;
  cursor: CursorPosition | null;
  isTyping: boolean;
  lastSeen: number;
}

export interface CursorPosition {
  anchor: { path: number[]; offset: number };
  focus: { path: number[]; offset: number };
}

// ---- Comment Schema (Zod) ----

export const CommentSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(1),
  authorId: z.string(),
  authorName: z.string(),
  createdAt: z.number(),
  selectionText: z.string().optional(),
  resolved: z.boolean().default(false),
});

export type Comment = z.infer<typeof CommentSchema>;

export const CommentReplySchema = z.object({
  id: z.string().uuid(),
  commentId: z.string().uuid(),
  text: z.string().min(1),
  authorId: z.string(),
  authorName: z.string(),
  createdAt: z.number(),
});

export type CommentReply = z.infer<typeof CommentReplySchema>;

export interface CommentThread {
  comment: Comment;
  replies: CommentReply[];
}

// ---- Version History ----

export interface DocumentVersion {
  id: string;
  content: Descendant[];
  timestamp: number;
  authorName: string;
  summary: string;
}

// ---- Operation Transform ----

export interface RemoteOperation {
  userId: string;
  operations: any[];
  version: number;
}

// ---- Editor Store ----

export type SidebarPanel = "comments" | "history" | null;
