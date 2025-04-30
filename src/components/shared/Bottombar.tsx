import { bottombarLinks } from "@/constants/indexx";
import { Link, useLocation } from "react-router-dom";

const Bottombar = () => {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            to={link.route}
            key={`bottombar-${link.label}`}
            className={`${
              isActive && "rounded-[10px] bg-primary-500"
            } flex-center flex-row gap-1 p-2 transition`} // Increased font size and weight
          >
            <img
              src={link.imgURL}
              alt={link.label}
              width={28}
              height={16}
              className={` ${isActive && "invert-white"} `}
            />
            <p className="tiny-medium text-light-2">{link.label}</p>
          </Link>
        );
      })}
    </section>
  );
};

export default Bottombar;
