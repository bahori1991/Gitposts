import { LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  Link,
  Outlet,
  redirect,
  ShouldRevalidateFunctionArgs,
  useLoaderData,
} from "@remix-run/react";
import { InfiniteVirtualList } from "~/components/infinite-virtual-list";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { getPostsForUser, getProfileForUsername } from "~/lib/database.server";
import { getSupabaseWithSessionAndHeaders } from "~/lib/supabase.server";
import { combinePostsWithLikes, getUserDataFromSession } from "~/lib/utils";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { username } = params;
  const { supabase, headers, user } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  if (!user) {
    return redirect("/login", { headers });
  }

  if (!username) {
    return redirect("/404", { headers });
  }

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const page = Number(searchParams.get("page")) || 1;

  const { data: profile } = await getProfileForUsername({
    dbClient: supabase,
    username,
  });

  if (!profile) {
    return redirect("/404", { headers });
  }

  const { data: rawPosts, totalPages } = await getPostsForUser({
    dbClient: supabase,
    page: isNaN(page) ? 1 : page,
    userId: profile.id,
  });

  const {
    userId: userId,
    // username,
    // userAvatarUrl,
  } = getUserDataFromSession(user);

  const posts = combinePostsWithLikes(rawPosts, userId);

  return json(
    { posts, totalPages, profile, userDetails: { userId } },
    { headers }
  );
};

export default function Profile() {
  const {
    profile: { avatar_url, name, username },
    posts,
    totalPages,
  } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col w-full max-w-xl px-4 my-2">
      <Outlet />
      <div className="flex flex-col justify-center items-center m-4">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage alt="User avatar" src={avatar_url}></AvatarImage>
        </Avatar>
        <h1 className="text-xl font-bold">{name}</h1>
        <Link to={`https://github.com/${username}`}>
          <p className="text-zinc-500">@{username}</p>
        </Link>
      </div>
      <br />
      <Separator />
      <br />
      <h1 className="text-xl font-heading font-bold">{"User posts"}</h1>
      <br />
      <InfiniteVirtualList
        incomingPosts={posts}
        totalPages={totalPages}
        isProfile
      />
    </div>
  );
}

export function shouldRevalidate({
  actionResult,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  const skipRevalidation =
    actionResult?.skipRevalidation &&
    actionResult?.skipRevalidation?.includes("profile.$username");

  if (skipRevalidation) {
    return false;
  }

  return defaultShouldRevalidate;
}
