import type { Notification, NotificationType } from "../types/notification";

const ACTORS = [
  { name: "Sarah Chen", avatar: "SC" },
  { name: "Marcus Johnson", avatar: "MJ" },
  { name: "Emily Rivera", avatar: "ER" },
  { name: "David Kim", avatar: "DK" },
  { name: "Aisha Patel", avatar: "AP" },
  { name: "James Wright", avatar: "JW" },
  { name: "Olivia Torres", avatar: "OT" },
  { name: "Liam Nakamura", avatar: "LN" },
];

const COLORS = [
  "#1877F2",
  "#42B72A",
  "#F02849",
  "#F7B928",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#F97316",
];

const TEMPLATES: Record<NotificationType, string[]> = {
  like: [
    "liked your post about weekend hiking",
    "liked your photo from the concert",
    "liked your comment on the group thread",
    "reacted ❤️ to your story",
  ],
  comment: [
    'commented: "This is amazing, great work!"',
    'replied to your comment: "Totally agree with you"',
    "commented on your post in React Developers",
    'commented: "Can you share the link?"',
  ],
  mention: [
    "mentioned you in a comment",
    "tagged you in a post about the team meetup",
    "mentioned you in React Developers group",
  ],
  share: [
    "shared your post with 3 others",
    "shared your article to their timeline",
    "shared your photo in a group",
  ],
  friend_request: ["sent you a friend request", "accepted your friend request"],
};

let idCounter = 0;

export function generateNotification(
  overrides?: Partial<Notification>,
): Notification {
  const types: NotificationType[] = [
    "like",
    "comment",
    "mention",
    "share",
    "friend_request",
  ];
  const type = types[Math.floor(Math.random() * types.length)];
  const actor = ACTORS[Math.floor(Math.random() * ACTORS.length)];
  const templates = TEMPLATES[type];
  const content = templates[Math.floor(Math.random() * templates.length)];

  return {
    id: `notif-${Date.now()}-${++idCounter}`,
    actor,
    content,
    timestamp: new Date(),
    isRead: false,
    type,
    ...overrides,
  };
}

export function generateHistoricalNotifications(count: number): Notification[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const minutesAgo = i * 15 + Math.floor(Math.random() * 10);
    return generateNotification({
      timestamp: new Date(now - minutesAgo * 60 * 1000),
      isRead: i > 2, // first 3 are unread
    });
  });
}

export function getAvatarColor(initials: string): string {
  let hash = 0;
  for (const ch of initials) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

// Simulated fetch for React Query
export async function fetchNotifications(): Promise<Notification[]> {
  await new Promise((r) => setTimeout(r, 600));
  return generateHistoricalNotifications(15);
}
