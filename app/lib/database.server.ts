import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "database.types";

export async function getAllPostsWithDetails({
  dbClient,
}: {
  dbClient: SupabaseClient<Database>;
}) {
  const postQuery = dbClient
    .from("posts")
    .select("*, author: profiles(*), likes(user_id), comments(*)")
    .order("created_at", { ascending: false });

  const { data, error } = await postQuery;

  if (error) {
    console.log("Error occured at getAllPostsWithDetails", error);
  }

  return { data, error };
}
