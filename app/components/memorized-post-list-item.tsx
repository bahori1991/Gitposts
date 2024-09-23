import { memo } from "react";
import { CombinedPostWithAuthorAndLikes } from "~/lib/types";
import { Post } from "./post";
import { ViewLikes } from "./view-likes";
import { ViewComments } from "./view-comments";
import { formatToXDate } from "~/lib/utils";

export const MemorizedPostListItem = memo(
  ({
    post,
    index,
  }: {
    post: CombinedPostWithAuthorAndLikes;
    index: number;
  }) => {
    return (
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
    );
  }
);

MemorizedPostListItem.displayName = "MemorizedPostListItem";
