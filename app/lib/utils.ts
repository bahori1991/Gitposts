import { User } from "@supabase/supabase-js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PostWithCommentDetails, PostWithDetails } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserDataFromSession(user: User) {
  const userId = user.id;
  const userAvatarUrl = user.user_metadata.avatar_url;
  const username = user.user_metadata.user_name;

  return { userId, userAvatarUrl, username };
}

export function combinePostsWithLikes(
  data: PostWithDetails[] | null,
  sessionUserId: string
) {
  const posts =
    data?.map((post) => {
      return {
        ...post,
        isLikedByUser: !!post.likes.find(
          (like) => like.user_id === sessionUserId
        ),
        likes: post.likes,
        comments: post.comments,
        author: post.author!,
      };
    }) ?? [];

  return posts;
}

export function formatToXDate(dateTimeString: string) {
  const date = new Date(dateTimeString);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "午後" : "午前";
  hours = hours % 12 || 12;

  const formattedDate = `${ampm}${hours}:${minutes} ･ ${year}年${month}月${day}日`;
  return formattedDate;
}

export function combinePostsWithLikesAndComments(
  data: PostWithCommentDetails[] | null,
  userId: string
) {
  const posts =
    data?.map((post) => {
      const commentsWithAvatarUrl = post.comments.map((comment) => ({
        ...comment,
        author: {
          username: comment.author!.username,
          avatarUrl: comment.author!.avatar_url,
        },
      }));

      return {
        ...post,
        isLikedByUser: !!post.likes.find((like) => like.user_id === userId),
        likes: post.likes,
        comments: commentsWithAvatarUrl,
        author: post.author!,
      };
    }) ?? [];

  return posts;
}
