import GridPosts from "@/components/shared/GridPosts";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/Authcontext";
import { useToast } from "@/hooks/use-toast";
import {
  useDeletePost,
  useGetUserPosts,
  useGetPostbyId,
} from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";

const PostDetails = () => {
  const { user } = useUserContext();
  const nav = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const { data: post, isPending } = useGetPostbyId(id || "");
  const { data: userPosts, isLoading: isUserLoading } = useGetUserPosts(
    post?.creator.$id
  );
  const { mutate: deletePost } = useDeletePost();

  const realatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.$id !== id
  );
  // console.log("Id:", id, "Post ID:", post?.imageId);

  const handleDltPost = () => {
    if (id && post?.imageId) {
      deletePost({ postId: id, imageId: post.imageId });
      toast({
        title: "Post Deleted!",
      });
    } else {
      console.error("Post ID or Image ID is undefined");
    }
    nav(-1);
  };

  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img
            alt="post Image"
            className="post_details-img"
            src={post?.imageUrl}
          />
          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                className="flex items-center gap-3"
                to={`/profile/${post?.creator.$id}`}
              >
                <img
                  src={
                    post?.creator?.image_url ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="Creator"
                  className="rounded-full w-12 lg:h-12"
                />

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-4">
                    <p className="subtle-semibold lg:small-regular">
                      {
                        multiFormatDateString(post?.$createdAt) // Assuming you have a function to format the date
                      }
                    </p>
                    -
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex-center gap-2 ">
                <Link
                  className={`${user.id !== post?.creator.$id && "hidden"}`}
                  to={`/update-post/${post?.$id}`}
                >
                  <img
                    width={24}
                    height={24}
                    alt="edit"
                    src="/assets/icons/edit.svg"
                  />
                </Link>
                <Button
                  onClick={handleDltPost}
                  variant={"ghost"}
                  className={`ghost_details-delete_btn ${
                    user.id !== post?.creator.$id && "hidden"
                  }`}
                >
                  <img
                    width={24}
                    height={24}
                    src="/assets/icons/delete.svg"
                    alt="dlt"
                  />
                </Button>
              </div>
            </div>
            <hr className=" border w-full border-dark-4/80" />
            <div className="flex flex-col flex-1 w-full small-medium lg: base-medium">
              <p>{post?.caption}</p>

              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />
        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserLoading || !realatedPosts ? (
          <Loader />
        ) : (
          <GridPosts posts={realatedPosts} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
