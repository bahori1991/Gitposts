import { Link } from "@remix-run/react";
import { TbMessageCircle } from "react-icons/tb";

type ViewCommentsProps = {
  comments: number;
  pathname: string;
  readonly?: boolean;
};

export const ViewComments = ({
  comments,
  pathname,
  readonly,
}: ViewCommentsProps) => {
  return (
    <>
      {readonly ? (
        <div className="flex justify-center items-center group">
          <TbMessageCircle className="h-4 w-4 text-gray-500" />
          <span className="ml-2 text-sm text-gray-500">{comments}</span>
        </div>
      ) : (
        <Link
          to={pathname}
          preventScrollReset
          className="flex justify-center items-center group"
        >
          <TbMessageCircle className="w-4 h-4 text-gray-500 group-hover:text-green-400" />
          <span className="ml-2 text-sm text-gray-500 group-hover:text-green-400">
            {comments}
          </span>
        </Link>
      )}
    </>
  );
};
