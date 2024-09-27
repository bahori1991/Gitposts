import { LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  Outlet,
  redirect,
  ShouldRevalidateFunctionArgs,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { InfiniteVirtualList } from "~/components/infinite-virtual-list";
import { PostSearch } from "~/components/post-search";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WritePost } from "~/components/write-post";
import { getAllPostsWithDetails } from "~/lib/database.server";
import { getSupabaseWithSessionAndHeaders } from "~/lib/supabase.server";
import { combinePostsWithLikes, getUserDataFromSession } from "~/lib/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, supabase, user } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  if (!user) {
    return redirect("/login", { headers });
  }

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const query = searchParams.get("query");
  const page = Number(searchParams.get("page")) || 1;

  const { data, totalPages } = await getAllPostsWithDetails({
    dbClient: supabase,
    page: isNaN(page) ? 1 : page,
    searchQuery: query,
  });

  const {
    userId: userId,
    // username,
    // userAvatarUrl,
  } = getUserDataFromSession(user);

  const posts = combinePostsWithLikes(data, userId);

  return json(
    { query, posts, totalPages, userDetails: { userId } },
    { headers }
  );
};

export default function Gitposts() {
  const {
    query,
    posts,
    totalPages,
    userDetails: { userId },
  } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const isSearching = Boolean(
    navigation.location &&
      new URLSearchParams(navigation.location.search).has("query")
  );

  return (
    <div className="w-full max-w-xl px-4 flex flex-col">
      <Outlet />
      <Tabs defaultValue="view-posts" className="my-2">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view-posts">View Posts</TabsTrigger>
          <TabsTrigger value="write-post">Write Post</TabsTrigger>
        </TabsList>
        <TabsContent value="view-posts">
          <Separator />
          <PostSearch isSearching={isSearching} searchQuery={query} />
          <InfiniteVirtualList incomingPosts={posts} totalPages={totalPages} />
        </TabsContent>
        <TabsContent value="write-post">
          <WritePost userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function shouldRevalidate({
  actionResult,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  const skipRevalidation =
    actionResult?.skipRevalidation &&
    actionResult?.skipRevalidation?.includes("gitposts");

  if (skipRevalidation) {
    return false;
  }

  return defaultShouldRevalidate;
}
