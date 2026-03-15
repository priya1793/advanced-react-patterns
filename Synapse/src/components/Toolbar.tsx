import React, { useCallback } from "react";
import { useSlate } from "slate-react";
import { Editor, Transforms, Element as SlateElement } from "slate";
import type { CustomElement, CustomText } from "../types/editor";
import { useEditorStore } from "../store/editorStore";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
  HighlightIcon,
  ListBulletIcon,
  ListNumberIcon,
  QuoteIcon,
  CommentIcon,
  HistoryIcon,
  UndoIcon,
  RedoIcon,
} from "./icons";

type MarkFormat = keyof Omit<CustomText, "text" | "commentId">;
type BlockFormat = CustomElement["type"];

// ---- Helpers ----

function isMarkActive(editor: Editor, format: MarkFormat): boolean {
  const marks = Editor.marks(editor);
  return marks ? (marks as Record<string, boolean>)[format] === true : false;
}

function toggleMark(editor: Editor, format: MarkFormat) {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

function isBlockActive(editor: Editor, format: BlockFormat): boolean {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });
  return !!match;
}

function toggleBlock(editor: Editor, format: BlockFormat) {
  const isActive = isBlockActive(editor, format);
  const isList = format === "bulleted-list" || format === "numbered-list";

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n.type === "bulleted-list" || n.type === "numbered-list"),
    split: true,
  });

  const newType: BlockFormat = isActive
    ? "paragraph"
    : isList
      ? "list-item"
      : format;
  Transforms.setNodes(editor, { type: newType } as Partial<CustomElement>);

  if (!isActive && isList) {
    const block: CustomElement = { type: format, children: [] } as any;
    Transforms.wrapNodes(editor, block);
  }
}

// ---- Components ----

function MarkButton({
  format,
  icon: Icon,
  title,
}: {
  format: MarkFormat;
  icon: React.FC;
  title: string;
}) {
  const editor = useSlate();
  const active = isMarkActive(editor, format);

  return (
    <div className="tooltip-wrapper">
      <button
        className={`toolbar-btn ${active ? "toolbar-btn--active" : ""}`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, format);
        }}
        aria-label={title}
      >
        <Icon />
      </button>
      <span className="tooltip-text">{title}</span>
    </div>
  );
}

function BlockButton({
  format,
  icon: Icon,
  title,
}: {
  format: BlockFormat;
  icon: React.FC;
  title: string;
}) {
  const editor = useSlate();
  const active = isBlockActive(editor, format);

  return (
    <div className="tooltip-wrapper">
      <button
        className={`toolbar-btn ${active ? "toolbar-btn--active" : ""}`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlock(editor, format);
        }}
        aria-label={title}
      >
        <Icon />
      </button>
      <span className="tooltip-text">{title}</span>
    </div>
  );
}

function HeadingSelect() {
  const editor = useSlate();

  const current = (() => {
    const [match] = Editor.nodes(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n),
    });
    if (match) {
      const node = match[0] as CustomElement;
      if (node.type === "heading-one") return "heading-one";
      if (node.type === "heading-two") return "heading-two";
      if (node.type === "heading-three") return "heading-three";
    }
    return "paragraph";
  })();

  return (
    <select
      className="toolbar-select"
      value={current}
      onChange={(e) => {
        const format = e.target.value as BlockFormat;
        if (format === "paragraph") {
          Transforms.setNodes(editor, {
            type: "paragraph",
          } as Partial<CustomElement>);
        } else {
          toggleBlock(editor, format);
        }
      }}
    >
      <option value="paragraph">Normal text</option>
      <option value="heading-one">Heading 1</option>
      <option value="heading-two">Heading 2</option>
      <option value="heading-three">Heading 3</option>
    </select>
  );
}

export function Toolbar() {
  const editor = useSlate();
  const setSidebarPanel = useEditorStore((s) => s.setSidebarPanel);
  const sidebarPanel = useEditorStore((s) => s.sidebarPanel);

  const handleAddComment = useCallback(() => {
    const { selection } = editor;
    if (!selection) return;
    setSidebarPanel("comments");
    // The comment creation is handled in the sidebar
  }, [editor, setSidebarPanel]);

  return (
    <div
      className="synapse-toolbar"
      role="toolbar"
      aria-label="Formatting options"
    >
      <div className="tooltip-wrapper">
        <button
          className="toolbar-btn"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.undo();
          }}
          aria-label="Undo"
        >
          <UndoIcon />
        </button>
        <span className="tooltip-text">Undo (Ctrl+Z)</span>
      </div>

      <div className="tooltip-wrapper">
        <button
          className="toolbar-btn"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.redo();
          }}
          aria-label="Redo"
        >
          <RedoIcon />
        </button>
        <span className="tooltip-text">Redo (Ctrl+Y)</span>
      </div>

      <div className="synapse-toolbar__separator" />

      <HeadingSelect />

      <div className="synapse-toolbar__separator" />

      <MarkButton format="bold" icon={BoldIcon} title="Bold (Ctrl+B)" />
      <MarkButton format="italic" icon={ItalicIcon} title="Italic (Ctrl+I)" />
      <MarkButton
        format="underline"
        icon={UnderlineIcon}
        title="Underline (Ctrl+U)"
      />
      <MarkButton
        format="strikethrough"
        icon={StrikethroughIcon}
        title="Strikethrough"
      />

      <div className="synapse-toolbar__separator" />

      <MarkButton format="code" icon={CodeIcon} title="Inline code" />
      <MarkButton format="highlight" icon={HighlightIcon} title="Highlight" />

      <div className="synapse-toolbar__separator" />

      <BlockButton
        format="bulleted-list"
        icon={ListBulletIcon}
        title="Bulleted list"
      />
      <BlockButton
        format="numbered-list"
        icon={ListNumberIcon}
        title="Numbered list"
      />
      <BlockButton format="blockquote" icon={QuoteIcon} title="Quote" />

      <div className="synapse-toolbar__separator" />

      <div className="tooltip-wrapper">
        <button
          className={`toolbar-btn ${sidebarPanel === "comments" ? "toolbar-btn--active" : ""}`}
          onClick={handleAddComment}
          aria-label="Comments"
        >
          <CommentIcon />
        </button>
        <span className="tooltip-text">Comments</span>
      </div>

      <div className="tooltip-wrapper">
        <button
          className={`toolbar-btn ${sidebarPanel === "history" ? "toolbar-btn--active" : ""}`}
          onClick={() => setSidebarPanel("history")}
          aria-label="Version history"
        >
          <HistoryIcon />
        </button>
        <span className="tooltip-text">Version history</span>
      </div>
    </div>
  );
}
