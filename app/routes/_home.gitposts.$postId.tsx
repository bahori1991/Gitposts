import { json, redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Post } from "~/components/post";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "~/components/ui/dialog";
import { ViewComments } from "~/components/view-comments";
import { getPostWithDetailsById } from "~/lib/database.server";
import { getSupabaseWithSessionAndHeaders } from "~/lib/supabase.server";
import {
  combinePostsWithLikesAndComments,
  formatToXDate,
  getUserDataFromSession,
} from "~/lib/utils";
import { Like } from "./resources.like";
import { WritePost } from "~/components/write-post";
import { AppLogo } from "~/components/app-logo";
import { Card } from "~/components/ui/card";
import { ShowComment } from "~/components/show-comment";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { postId } = params;
  const { supabase, headers, user } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  if (!user) {
    return redirect("/login", { headers });
  }

  if (!postId) {
    return redirect("/404", { headers });
  }

  const { userId } = getUserDataFromSession(user);
  const { data } = await getPostWithDetailsById({ dbClient: supabase, postId });

  const posts = combinePostsWithLikesAndComments(data, userId);

  return json({ post: posts[0], userId }, { headers });
};

export default function CurrentPost() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { post, userId } = useLoaderData<typeof loader>();

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        navigate(-1);
        setOpen(open);
      }}
    >
      <DialogContent className="max-w-xl h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogDescription className="my-2 text-left">
            <Post
              avatarUrl={post.author.avatar_url}
              name={post.author.name}
              username={post.author.username}
              title={post.title}
              userId={post.author.id}
              id={post.id}
              dateTimeString={formatToXDate(post.created_at)}
            >
              <Like
                likes={post.likes.length}
                likedByUser={post.isLikedByUser}
                userId={userId}
                postId={post.id}
              />
              <ViewComments
                comments={post.comments.length}
                pathname={`/`}
                readonly
              />
            </Post>
            <WritePost userId={userId} postId={post.id} />
            {post.comments.length ? (
              <div>
                {post.comments.map(({ title, author }, index) => (
                  <Card key={index} className="my-2 min-h-24 p-4">
                    <ShowComment
                      title={title}
                      avatarUrl={author.avatarUrl}
                      username={author.username}
                    />
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-full">
                <AppLogo className="h-10 w-10 opacity-60" />
                <h2 className="ml-2">No comments yet...</h2>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
