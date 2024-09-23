import { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData, useNavigation } from "@remix-run/react";
import { Post } from "~/components/post";
import { PostSearch } from "~/components/post-search";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ViewComments } from "~/components/view-comments";
import { ViewLikes } from "~/components/view-likes";
import { WritePost } from "~/components/write-post";
import { getAllPostsWithDetails } from "~/lib/database.server";
import { getSupabaseWithSessionAndHeaders } from "~/lib/supabase.server";
import {
  combinePostsWithLikes,
  formatToXDate,
  getUserDataFromSession,
} from "~/lib/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, supabase, serverSession } =
    await getSupabaseWithSessionAndHeaders({
      request,
    });

  if (!serverSession) {
    return redirect("/login", { headers });
  }

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const query = searchParams.get("query");

  const { data } = await getAllPostsWithDetails({ dbClient: supabase });

  const {
    userId: sessionUserId,
    // username,
    // userAvatarUrl,
  } = getUserDataFromSession(serverSession);

  const posts = combinePostsWithLikes(data, sessionUserId);

  return json({ query, posts }, { headers });
};

export default function Gitposts() {
  const { query, posts } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const post = posts[0];

  console.log("🚀 > Gitposts > post:", post);

  const isSearching = Boolean(
    navigation.location &&
      new URLSearchParams(navigation.location.search).has("query")
  );

  return (
    <div className="w-full max-w-xl px-4 flex flex-col">
      <Tabs defaultValue="view-posts" className="my-2">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view-posts">View Posts</TabsTrigger>
          <TabsTrigger value="write-post">Write Post</TabsTrigger>
        </TabsList>
        <TabsContent value="view-posts">
          <Separator />
          <PostSearch isSearching={isSearching} searchQuery={query} />
          <Post
            avatarUrl={post.author.avatar_url}
            name={post.author.name}
            username={post.author.username}
            title={post.title}
            userId={post.author.id}
            id={post.id}
            dateTimeString={formatToXDate(post.created_at)}
          >
            <ViewLikes
              likes={post.likes.length}
              likedByUser={post.isLikedByUser}
              pathname={"profile/bahori1991"}
            />
            <ViewComments
              comments={post.comments.length}
              pathname="/profile/baori1991"
            />
          </Post>
        </TabsContent>
        <TabsContent value="write-post">
          <WritePost sessionUserId="1234" postId="1234" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
