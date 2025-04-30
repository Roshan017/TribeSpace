import GridPosts from "@/components/shared/GridPosts";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

const Saved = () => {
  const { data: CurrentUser } = useGetCurrentUser();
  const savedPosts = CurrentUser?.saved
    .map((saves: Models.Document) => ({
      ...saves.post,
      creator: {
        imageUrl: CurrentUser.image_url,
      },
    }))
    .reverse();

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="Save"
          className="invert-white"
        />
        <p className="h3-bold md:h2-bold text-left w-full">Saved Posts</p>
      </div>
      {!CurrentUser ? (
        <Loader />
      ) : (
        <ul className="w-full flex-justify-center max-w-5xl gap-9">
          {savedPosts.lengths === 0 ? (
            <p className="text-light-4">No Posts Saved</p>
          ) : (
            <GridPosts posts={savedPosts} ShowStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
