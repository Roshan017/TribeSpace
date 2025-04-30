import { useUserContext } from "@/context/Authcontext";
import { Models } from "appwrite";
import React from "react";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type GridPostsList = {
  posts: Models.Document[];
  ShowUser?: boolean;
  ShowStats?: boolean;
};
const GridPosts = ({
  posts,
  ShowStats = true,
  ShowUser = true,
}: GridPostsList) => {
  const user = useUserContext();

  return (
    <ul className="grid-container">
      {posts?.map((post) => (
        <li className="relative min-w-80 h-80" key={post.$id}>
          <Link to={`/post/${post.$id}`} className="grid-post_link">
            <img
              src={post.imageUrl}
              alt="Post Image"
              className="h-full w-full object-cover"
            />
          </Link>
          <div className="grid-post_user">
            {ShowUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={post.creator.image_url || post.creator.imageUrl}
                  alt="Hello"
                  className="h-8 w-8 rounded-full"
                />
                <p className="line-clamp-1">{post.creator.name}</p>
              </div>
            )}
            {ShowStats && <PostStats post={post} userId={user.user.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPosts;
