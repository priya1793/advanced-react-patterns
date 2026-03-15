import React, { useMemo, useCallback } from "react";
import { createEditor, Element as SlateElement, type Descendant } from "slate";
import {
  Slate,
  Editable,
  withReact,
  type RenderElementProps,
  type RenderLeafProps,
} from "slate-react";
import { withHistory } from "slate-history";
import { EditorErrorBoundary } from "./ErrorBoundary";
import { Toolbar } from "./Toolbar";
import { CommentSidebar } from "./CommentSidebar";
import { VersionHistory } from "./VersionHistory";
import { PresenceBar } from "./PresenceBar";
import { LiveCursors } from "./LiveCursors";
import { CloseIcon } from "./icons";
import { useCollaboration } from "../hooks/useCollaboration";
import { useEditorStore } from "../store/editorStore";
import type { CustomElement, CustomText } from "../types/editor";
import { SyncIndicator } from "./SyncIndictor";

// ---- Renderers ----

function renderElement(props: RenderElementProps) {
  const { attributes, children, element } = props;
  const el = element as CustomElement;

  switch (el.type) {
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "heading-three":
      return <h3 {...attributes}>{children}</h3>;
    case "blockquote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "code-block":
      return (
        <pre {...attributes}>
          <code>{children}</code>
        </pre>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
}

function renderLeaf(props: RenderLeafProps) {
  const { attributes, children, leaf } = props;
  const l = leaf as CustomText;
  let el = children;

  if (l.bold) el = <strong>{el}</strong>;
  if (l.italic) el = <em>{el}</em>;
  if (l.underline) el = <u>{el}</u>;
  if (l.strikethrough) el = <s>{el}</s>;
  if (l.code) el = <code className="leaf-code">{el}</code>;

  const classNames: string[] = [];
  if (l.highlight) classNames.push("leaf-highlight");
  if (l.commentId) classNames.push("commented-text");

  return (
    <span
      {...attributes}
      className={classNames.length > 0 ? classNames.join(" ") : undefined}
    >
      {el}
    </span>
  );
}

// ---- Hotkeys ----

const HOTKEY_MAP: Record<string, keyof Omit<CustomText, "text" | "commentId">> =
  {
    "mod+b": "bold",
    "mod+i": "italic",
    "mod+u": "underline",
  };

function isHotkey(hotkey: string, event: React.KeyboardEvent): boolean {
  const [mod, key] = hotkey.split("+");
  const isMod = event.ctrlKey || event.metaKey;
  return isMod && event.key.toLowerCase() === key;
}

// ---- Main Editor ----

export function SynapseEditor() {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const { broadcastOperations } = useCollaboration(editor);

  const content = useEditorStore((s) => s.content);
  const setContent = useEditorStore((s) => s.setContent);
  const documentTitle = useEditorStore((s) => s.documentTitle);
  const setDocumentTitle = useEditorStore((s) => s.setDocumentTitle);
  const sidebarPanel = useEditorStore((s) => s.sidebarPanel);
  const setSidebarPanel = useEditorStore((s) => s.setSidebarPanel);
  const activeVersionId = useEditorStore((s) => s.activeVersionId);
  const addVersion = useEditorStore((s) => s.addVersion);
  const currentUserName = useEditorStore((s) => s.currentUserName);

  const handleChange = useCallback(
    (value: Descendant[]) => {
      setContent(value);
      broadcastOperations();

      // Auto-save version every 20 changes (simulated)
      const version = useEditorStore.getState().version;
      if (version > 0 && version % 20 === 0) {
        addVersion({
          id: crypto.randomUUID(),
          content: JSON.parse(JSON.stringify(value)),
          timestamp: Date.now(),
          authorName: currentUserName,
          summary: `Auto-saved at ${value.length} blocks`,
        });
      }
    },
    [setContent, broadcastOperations, addVersion, currentUserName],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      for (const [hotkey, mark] of Object.entries(HOTKEY_MAP)) {
        if (isHotkey(hotkey, event)) {
          event.preventDefault();
          const marks = editor.marks as Record<string, boolean> | null;
          const isActive = marks ? marks[mark] === true : false;
          if (isActive) {
            editor.removeMark(mark);
          } else {
            editor.addMark(mark, true);
          }
          return;
        }
      }
    },
    [editor],
  );

  return (
    <EditorErrorBoundary>
      <div className="synapse-root">
        {/* Header */}
        <div className="synapse-header">
          <span className="synapse-header__logo">✦ Synapse</span>
          <input
            className="synapse-header__title"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            aria-label="Document title"
          />
          <div className="synapse-header__spacer" />
          <SyncIndicator />
          <PresenceBar />
        </div>

        <Slate editor={editor} initialValue={content} onChange={handleChange}>
          {/* Toolbar */}
          <Toolbar />

          {/* Body */}
          <div className="synapse-body">
            {/* Workspace */}
            <div className="synapse-workspace">
              <div
                style={{
                  position: "relative",
                  maxWidth: "var(--document-max-width)",
                  margin: "0 auto",
                }}
              >
                <LiveCursors />
                <Editable
                  className="synapse-document"
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  onKeyDown={handleKeyDown}
                  placeholder="Start typing..."
                  spellCheck
                  readOnly={!!activeVersionId}
                  aria-label="Document editor"
                />
              </div>
            </div>

            {/* Sidebar */}
            {sidebarPanel && (
              <div className="synapse-sidebar">
                <div className="synapse-sidebar__header">
                  <span>
                    {sidebarPanel === "comments"
                      ? "Comments"
                      : "Version History"}
                  </span>
                  <button
                    className="toolbar-btn"
                    onClick={() => setSidebarPanel(null)}
                    aria-label="Close sidebar"
                  >
                    <CloseIcon />
                  </button>
                </div>

                {sidebarPanel === "comments" && <CommentSidebar />}
                {sidebarPanel === "history" && <VersionHistory />}
              </div>
            )}
          </div>
        </Slate>
      </div>
    </EditorErrorBoundary>
  );
}
