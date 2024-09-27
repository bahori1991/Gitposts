import { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, useFetcher } from "@remix-run/react";
import { FaStar } from "react-icons/fa";
import { deleteLike, insertLike } from "~/lib/database.server";
import { getSupabaseWithSessionAndHeaders } from "~/lib/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
  const { supabase, headers, user } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  if (!user) {
    return redirect("/login", { headers });
  }

  const formData = await request.formData();
  const action = formData.get("action");
  const postId = formData.get("postId")?.toString();
  const userId = formData.get("userId")?.toString();

  const skipRevalidation = ["gitposts", "profile.$username"];

  if (!userId || !postId) {
    return json(
      { error: "User or Tweet Id missing" },
      { status: 400, headers }
    );
  }

  if (action === "like") {
    const { error } = await insertLike({ dbClient: supabase, userId, postId });

    if (error) {
      return json(
        { error: "Failed to like", skipRevalidation },
        { status: 500, headers }
      );
    }
  } else {
    const { error } = await deleteLike({ dbClient: supabase, userId, postId });

    if (error) {
      return json(
        { error: "Faild to dislike", skipRevalidation },
        { status: 500, headers }
      );
    }
  }

  return json({ ok: true, error: null, skipRevalidation }, { headers });
}

type LikeProps = {
  likedByUser: boolean;
  likes: number;
  postId: string;
  userId: string;
};

export function Like({ likedByUser, likes, postId, userId }: LikeProps) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form action="/resources/like" method="post">
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="userId" value={userId} />
      <input
        type="hidden"
        name="action"
        value={likedByUser ? "unlike" : "like"}
      />
      <button className="group flex items-center focus:outline-none">
        <FaStar
          className={`w-4 h-4 text-yellow-500 group-hover:text-gray-500 ${
            likedByUser ? "text-blue-700" : "text-gray-500"
          }`}
        />
        <span className="ml-2 text-sm text-yellow-500 group-hover:text-gray-500">
          {likes}
        </span>
      </button>
    </fetcher.Form>
  );
}
