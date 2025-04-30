import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { useGetPostbyId } from "@/lib/react-query/queriesAndMutations";
import React from "react";
import { useParams } from "react-router-dom";

const CreatePost = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostbyId(id || "");

  if (isPending) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-1 ">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            alt="Add Post"
            height={36}
            width={36}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full ">Edit Post</h2>
        </div>
        <PostForm action="Update" post={post} />
      </div>
    </div>
  );
};

export default CreatePost;
