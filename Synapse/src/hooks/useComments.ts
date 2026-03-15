import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEditorStore } from "../store/editorStore";
import type { CommentThread, Comment, CommentReply } from "../types/editor";

async function fetchComments(documentId: string): Promise<CommentThread[]> {
  await new Promise((r) => setTimeout(r, 200));
  return useEditorStore.getState().comments;
}

export function useComments() {
  const documentId = useEditorStore((s) => s.documentId);

  return useQuery({
    queryKey: ["comments", documentId],
    queryFn: () => fetchComments(documentId),
    staleTime: 5_000,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  const addComment = useEditorStore((s) => s.addComment);
  const documentId = useEditorStore((s) => s.documentId);

  return useMutation({
    mutationFn: async (thread: CommentThread) => {
      await new Promise((r) => setTimeout(r, 100));
      addComment(thread);
      return thread;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", documentId] });
    },
  });
}

export function useAddReply() {
  const queryClient = useQueryClient();
  const addReply = useEditorStore((s) => s.addReply);
  const documentId = useEditorStore((s) => s.documentId);

  return useMutation({
    mutationFn: async ({
      commentId,
      reply,
    }: {
      commentId: string;
      reply: CommentReply;
    }) => {
      await new Promise((r) => setTimeout(r, 100));
      addReply(commentId, reply);
      return reply;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", documentId] });
    },
  });
}

export function useResolveComment() {
  const queryClient = useQueryClient();
  const resolveComment = useEditorStore((s) => s.resolveComment);
  const documentId = useEditorStore((s) => s.documentId);

  return useMutation({
    mutationFn: async (commentId: string) => {
      await new Promise((r) => setTimeout(r, 100));
      resolveComment(commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", documentId] });
    },
  });
}
