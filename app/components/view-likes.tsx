import { Link } from "@remix-run/react";
import { FaStar, FaRegStar } from "react-icons/fa";

type ViewLikesProps = {
  likes: number;
  likedByUser?: boolean;
  pathname: string;
};

export function ViewLikes({ likes, likedByUser, pathname }: ViewLikesProps) {
  return (
    <Link
      to={pathname}
      preventScrollReset
      className="flex justify-center items-center group"
    >
      {likedByUser ? (
        <>
          <FaStar className="w-4 h-4 text-yellow-500 group-hover:text-gray-500" />
          <span className="ml-2 text-sm text-yellow-500 group-hover:text-gray-500">
            {likes}
          </span>
        </>
      ) : (
        <>
          <FaRegStar className="w-4 h-4 text-gray-500 group-hover:text-yellow-500" />
          <span className="ml-2 text-sm text-gray-500 group-hover:text-yellow-500">
            {likes}
          </span>
        </>
      )}
    </Link>
  );
}
