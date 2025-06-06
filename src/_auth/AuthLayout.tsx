import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const isAuth = false;
  return (
    <>
      {isAuth ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>

          <img
            src="/assets/images/side-img_2.png"
            alt="Side Image"
            className="hidden xl:block h-screen object-cover w-1/2  bg-no-repeat py"
          />
        </>
      )}
    </>
  );
};

export default AuthLayout;
