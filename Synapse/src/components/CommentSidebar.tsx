import React, { useState, useCallback } from "react";
import { useSlate } from "slate-react";
import { Editor, Range } from "slate";
import { useEditorStore } from "../store/editorStore";
import {
  useComments,
  useAddComment,
  useAddReply,
  useResolveComment,
} from "../hooks/useComments";
import { CheckIcon } from "./icons";
import type { CommentThread, CommentReply } from "../types/editor";

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return d.toLocaleDateString();
}

function CommentThreadItem({ thread }: { thread: CommentThread }) {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const activeCommentId = useEditorStore((s) => s.activeCommentId);
  const setActiveComment = useEditorStore((s) => s.setActiveComment);
  const currentUserId = useEditorStore((s) => s.currentUserId);
  const currentUserName = useEditorStore((s) => s.currentUserName);
  const addReplyMutation = useAddReply();
  const resolveMutation = useResolveComment();

  const isActive = activeCommentId === thread.comment.id;

  const handleReply = useCallback(() => {
    if (!replyText.trim()) return;
    const reply: CommentReply = {
      id: crypto.randomUUID(),
      commentId: thread.comment.id,
      text: replyText.trim(),
      authorId: currentUserId,
      authorName: currentUserName,
      createdAt: Date.now(),
    };
    addReplyMutation.mutate({ commentId: thread.comment.id, reply });
    setReplyText("");
    setShowReplyInput(false);
  }, [
    replyText,
    thread.comment.id,
    currentUserId,
    currentUserName,
    addReplyMutation,
  ]);

  if (thread.comment.resolved) return null;

  return (
    <div
      className={`comment-thread ${isActive ? "comment-thread--active" : ""}`}
      onClick={() => setActiveComment(isActive ? null : thread.comment.id)}
    >
      {thread.comment.selectionText && (
        <div className="comment-thread__quote">
          "{thread.comment.selectionText}"
        </div>
      )}
      <div className="comment-thread__author">{thread.comment.authorName}</div>
      <div className="comment-thread__time">
        {formatTime(thread.comment.createdAt)}
      </div>
      <div className="comment-thread__text">{thread.comment.text}</div>

      {thread.replies.length > 0 && (
        <div className="comment-thread__replies">
          {thread.replies.map((reply) => (
            <div key={reply.id} className="comment-reply">
              <div className="comment-reply__author">
                {reply.authorName} · {formatTime(reply.createdAt)}
              </div>
              <div className="comment-reply__text">{reply.text}</div>
            </div>
          ))}
        </div>
      )}

      {isActive && (
        <div style={{ marginTop: 8, display: "flex", gap: 4 }}>
          <button
            className="toolbar-btn"
            style={{ fontSize: 12 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowReplyInput(!showReplyInput);
            }}
          >
            Reply
          </button>
          <button
            className="toolbar-btn"
            style={{ fontSize: 12 }}
            onClick={(e) => {
              e.stopPropagation();
              resolveMutation.mutate(thread.comment.id);
            }}
            title="Resolve"
          >
            <CheckIcon />
          </button>
        </div>
      )}

      {showReplyInput && (
        <div style={{ marginTop: 8 }} onClick={(e) => e.stopPropagation()}>
          <textarea
            className="comment-input__field"
            placeholder="Reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleReply();
              }
            }}
          />
          <button
            className="comment-input__submit"
            style={{ marginTop: 4, padding: "4px 12px", fontSize: 12 }}
            onClick={handleReply}
            disabled={!replyText.trim()}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

export function CommentSidebar() {
  const [newComment, setNewComment] = useState("");
  const editor = useSlate();
  const { data: comments = [] } = useComments();
  const addCommentMutation = useAddComment();
  const currentUserId = useEditorStore((s) => s.currentUserId);
  const currentUserName = useEditorStore((s) => s.currentUserName);
  const storeComments = useEditorStore((s) => s.comments);

  const handleAddComment = useCallback(() => {
    if (!newComment.trim()) return;

    let selectionText = "";
    const { selection } = editor;
    if (selection && !Range.isCollapsed(selection)) {
      selectionText = Editor.string(editor, selection);
    }

    const thread: CommentThread = {
      comment: {
        id: crypto.randomUUID(),
        text: newComment.trim(),
        authorId: currentUserId,
        authorName: currentUserName,
        createdAt: Date.now(),
        selectionText: selectionText || undefined,
        resolved: false,
      },
      replies: [],
    };

    addCommentMutation.mutate(thread);
    setNewComment("");
  }, [newComment, editor, currentUserId, currentUserName, addCommentMutation]);

  const activeThreads = storeComments.filter((t) => !t.comment.resolved);

  return (
    <>
      <div className="synapse-sidebar__body">
        {activeThreads.length === 0 ? (
          <div className="empty-state">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>No comments yet</span>
            <span style={{ fontSize: 12 }}>Select text and add a comment</span>
          </div>
        ) : (
          activeThreads.map((thread) => (
            <CommentThreadItem key={thread.comment.id} thread={thread} />
          ))
        )}
      </div>

      <div className="comment-input">
        <textarea
          className="comment-input__field"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAddComment();
            }
          }}
        />
        <button
          className="comment-input__submit"
          onClick={handleAddComment}
          disabled={!newComment.trim()}
        >
          Post
        </button>
      </div>
    </>
  );
}
