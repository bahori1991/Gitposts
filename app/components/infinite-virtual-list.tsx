import { CombinedPostsWithAuthorAndLikes } from "~/lib/types";
import { useInfinitePosts } from "./use-infinite-posts";
import { Virtuoso } from "react-virtuoso";
import { MemorizedPostListItem } from "./memorized-post-list-item";
import { PostSkeleton } from "./post";

export function InfiniteVirtualList({
  totalPages,
  incomingPosts,
}: {
  totalPages: number;
  incomingPosts: CombinedPostsWithAuthorAndLikes;
}) {
  const { posts, loadMore, hasMorePages } = useInfinitePosts({
    incomingPosts,
    totalPages,
  });

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
