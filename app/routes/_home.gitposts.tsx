import { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData, useNavigation } from "@remix-run/react";
import { Post } from "~/components/post";
import { PostSearch } from "~/components/post-search";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ViewComments } from "~/components/view-comments";
import { ViewLikes } from "~/components/view-likes";
import { WritePost } from "~/components/write-post";
import { getSupabaseWithSessionAndHeaders } from "~/lib/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  if (!serverSession) {
    return redirect("/login", { headers });
  }

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const query = searchParams.get("query");

  return json({ query }, { headers });
};

export default function Gitposts() {
  const { query } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

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
            avatarUrl={
              "https://avatars.githubusercontent.com/u/67491712?s=400&v=4"
            }
            name="bahori"
            username="bahori1991"
            title={"### markdown title"}
            userId="12345"
            id="56789"
            dateTimeString="30, Nov 2024"
          >
            <ViewLikes likes={114514} pathname={"profile/bahori1991"} />
            <ViewComments comments={810} pathname="/profile/baori1991" />
          </Post>
        </TabsContent>
        <TabsContent value="write-post">
          <WritePost sessionUserId="1234" postId="1234" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
