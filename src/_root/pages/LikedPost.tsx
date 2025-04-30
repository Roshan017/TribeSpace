import GridPosts from "@/components/shared/GridPosts";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import React from "react";

const LikedPost = () => {
  const { data: currentUser } = useGetCurrentUser();

  if (!currentUser) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }
  return (
    <div>
      {currentUser.liked.length === 0 && (
        <p className="text-light-4">No Liked Posts</p>
      )}
      <GridPosts posts={currentUser.liked} ShowStats={false} />
    </div>
  );
};

export default LikedPost;
