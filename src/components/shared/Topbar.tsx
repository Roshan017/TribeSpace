import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/Authcontext";

const Topbar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { user } = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) {
      navigate(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);
  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            width={220}
            height={320}
            alt="logo"
            src="/assets/images/Logo.png"
          />
        </Link>
        <div className="flex gap-4 ">
          <Button
            onClick={() => signOut()}
            variant={"ghost"}
            className="shad-button_ghost"
          >
            <img alt="logout" src="/assets/icons/logout.svg" />
          </Button>
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              className="h-8 w-8 rounded-full"
              src={user.image_url || "/assets/icons/profile-placeholder.svg"}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
