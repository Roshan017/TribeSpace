import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { GetPosts } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

const Home = () => {
  const { data: posts, isPending: isPostLoading } = GetPosts();
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          <div className="mt-4">
            {isPostLoading && !posts ? (
              <Loader />
            ) : (
              <ul className="flex flex-col gap-9 w-full">
                {posts?.documents.map((post: Models.Document) => (
                  <li>
                    <PostCard post={post} key={post.$id} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
