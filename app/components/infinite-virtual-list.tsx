import { CombinedPostsWithAuthorAndLikes } from "~/lib/types";
import { useInfinitePosts } from "./use-infinite-posts";
import { Virtuoso } from "react-virtuoso";
import { MemorizedPostListItem } from "./memorized-post-list-item";
import { PostSkeleton } from "./post";
import { AppLogo } from "./app-logo";

export function InfiniteVirtualList({
  totalPages,
  incomingPosts,
  isProfile,
}: {
  totalPages: number;
  incomingPosts: CombinedPostsWithAuthorAndLikes;
  isProfile?: boolean;
}) {
  const postRouteId = isProfile
    ? "routes/_home.profile.$username.$postId"
    : "routes/_home.gitposts.$postId";
  const { posts, loadMore, hasMorePages } = useInfinitePosts({
    incomingPosts,
    totalPages,
    postRouteId,
  });

  if (!posts.length) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <AppLogo className="h-10 w-10" />
        <h2 className="ml-2">No posts found</h2>
      </div>
    );
  }

  return (
    <Virtuoso
      data={posts}
      useWindowScroll
      initialTopMostItemIndex={0}
      endReached={loadMore}
      initialItemCount={5}
      overscan={500}
      itemContent={(index, post) => {
        if (!post) {
          return <div></div>;
        }

        return <MemorizedPostListItem post={post} index={index} />;
      }}
      components={{
        Footer: () => {
          if (!hasMorePages) {
            return null;
          }
          return <PostSkeleton />;
        },
      }}
    ></Virtuoso>
  );
}
