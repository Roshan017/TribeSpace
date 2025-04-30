import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useToast } from "@/hooks/use-toast";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";

const AllUser = () => {
  const { toast } = useToast();
  const { data: Users, isLoading, isError: isErrorUsers } = useGetUsers();

  if (isErrorUsers) {
    toast({
      title: "Something went Wrong",
      description: "Please try after sometime",
      variant: "default",
    });
    return;
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">People</h2>
        {isLoading && !Users ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {Users?.documents.map((user) => (
              <li key={user?.$id} className="flex-1 min-w-[200px] w-full">
                <UserCard user={user} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUser;
