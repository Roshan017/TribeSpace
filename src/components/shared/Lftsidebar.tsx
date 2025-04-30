import React, { useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/Authcontext";
import { sidebarLinks } from "@/constants/indexx";
import { INavLink } from "@/types";

const Lftsidebar = () => {
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { user } = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) {
      navigate(0);
    }
  }, [isSuccess]);
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11 ">
        <Link to="/" className="flex gap-3 items-center">
          <img
            width={240}
            height={36}
            alt="logo"
            src={"/assets/images/Logo.png"}
          />
        </Link>

        <Link className="flex gap-3 items-center " to={`/profile/${user.id}`}>
          <img
            src={user.image_url || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="h-13 w-14 rounded-full"
          />
          <div className="flex flex-col mt-1 ">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3 ">@{user.username}</p>
          </div>
        </Link>
        <ul className="flex flex-col gap-6 py-2 ">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`} // Increased font size and weight
              >
                <NavLink
                  className="flex gap-4 items-center p-4 text-lg  font-poppins"
                  to={link.route}
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    } `}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <Button
          onClick={() => signOut()}
          variant={"ghost"}
          className="shad-button_ghost"
        >
          <img alt="logout" src="/assets/icons/logout.svg" />
          <p className="small-medium lg: base-medium">Logout</p>
        </Button>
      </div>
    </nav>
  );
};

export default Lftsidebar;
