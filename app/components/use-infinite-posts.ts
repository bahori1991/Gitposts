import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { loader as postsLoader } from "~/routes/_home.gitposts";
import { CombinedPostsWithAuthorAndLikes } from "~/lib/types";

type UseInfnitePosts = {
  incomingPosts: CombinedPostsWithAuthorAndLikes;
  totalPages: number;
};

export const useInfinitePosts = ({
  incomingPosts,
  totalPages,
}: UseInfnitePosts) => {
  const [posts, setPosts] =
    useState<CombinedPostsWithAuthorAndLikes>(incomingPosts);
  const fetcher = useFetcher<typeof postsLoader>();
  const [currentPage, setCurrentPage] = useState(1);
  const hasMorePages = currentPage < totalPages;

  const loadMore = () => {
    if (hasMorePages && fetcher.state === "idle") {
      fetcher.load(`/gitposts?page=${currentPage + 1}`);
    }
  };

  useEffect(() => {
    if (fetcher.data?.posts) {
      setPosts((prevPosts) => [...prevPosts, ...(fetcher.data?.posts || [])]);
      setCurrentPage((currentPage) => currentPage + 1);
    }
  }, [fetcher.data]);

  return { posts, loadMore, hasMorePages };
};
