import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "database.types";

export async function getAllPostsWithDetails({
  dbClient,
  page,
  searchQuery,
  limit = 10,
}: {
  dbClient: SupabaseClient<Database>;
  page: number;
  searchQuery: string | null;
  limit?: number;
}) {
  let postQuery = dbClient
    .from("posts")
    .select("*, author: profiles(*), likes(user_id), comments(*)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (searchQuery) {
    postQuery = postQuery.like("title", `%${searchQuery}%`);
  }

  const { data, error, count } = await postQuery;

  if (error) {
    console.log("Error occured at getAllPostsWithDetails", error);
  }

  return {
    data,
    error,
    totalPosts: count,
    limit,
    totalPages: count ? Math.ceil(count / limit) : 1,
  };
}

export async function createPost({
  dbClient,
  userId,
  title,
}: {
  dbClient: SupabaseClient<Database>;
  userId: string;
  title: string;
}) {
  const { error } = await dbClient
    .from("posts")
    .insert({ user_id: userId, title });

  return { error };
}

export async function getProfileForUsername({
  dbClient,
  username,
}: {
  dbClient: SupabaseClient<Database>;
  username: string;
}) {
  const profileQuery = dbClient
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  const { data, error } = await profileQuery;

  if (error) {
    console.log("Error occured during getProfileForUsername : ", error);
  }

  return { data, error };
}

export async function getPostsForUser({
  dbClient,
  page,
  userId,
  limit = 10,
}: {
  dbClient: SupabaseClient<Database>;
  page: number;
  userId: string;
  limit?: number;
}) {
  const postQuery = dbClient
    .from("posts")
    .select("*, author: profiles(*), likes(user_id), comments(*)", {
      count: "exact",
    })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  const { data, error, count } = await postQuery;

  if (error) {
    console.log("Error occured during getProfileForUsername : ", error);
  }

  return {
    data,
    error,
    totalPosts: count,
    limit,
    totalPages: count ? Math.ceil(count / limit) : 1,
  };
}

export async function insertLike({
  dbClient,
  userId,
  postId,
}: {
  dbClient: SupabaseClient<Database>;
  userId: string;
  postId: string;
}) {
  const { error } = await dbClient
    .from("likes")
    .insert({ user_id: userId, post_id: postId });

  if (error) {
    console.log("Error occured at insertLike", error);
  }

  return { error };
}

export async function deleteLike({
  dbClient,
  userId,
  postId,
}: {
  dbClient: SupabaseClient<Database>;
  userId: string;
  postId: string;
}) {
  const { error } = await dbClient
    .from("likes")
    .delete()
    .match({ user_id: userId, post_id: postId });

  if (error) {
    console.log("Error occured at deleteLike", error);
  }

  return { error };
}

export async function insertComment({
  dbClient,
  userId,
  postId,
  title,
}: {
  dbClient: SupabaseClient<Database>;
  userId: string;
  postId: string;
  title: string;
}) {
  const { error } = await dbClient
    .from("comments")
    .insert({ user_id: userId, post_id: postId, title });

  if (error) {
    console.log("Error occured at insertComment", error);
  }

  return { error };
}

export async function getPostWithDetailsById({
  dbClient,
  postId,
}: {
  dbClient: SupabaseClient<Database>;
  postId: string;
}) {
  const postQuery = dbClient
    .from("posts")
    .select(
      "*, author: profiles(*), likes(user_id), comments(*, author: profiles(username, avatar_url))"
    )
    .order("created_at", { referencedTable: "comments", ascending: false })
    .eq("id", postId);

  const { data, error } = await postQuery;

  if (error) {
    console.error("Error occurred during getPostWithDetailsById", error);
  }

  return {
    data,
    error,
  };
}
