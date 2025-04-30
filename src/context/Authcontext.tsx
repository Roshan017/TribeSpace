import { getCurrentUSer } from "@/lib/appwrite/api";
import { IContextType, IUser } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const INITIAL_USER: IUser = {
  id: "",
  name: "",
  username: "",
  email: "",
  image_url: "",
  bio: "",
};

const INITIAL_STATE: IContextType = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAutheUser: async () => false,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkAutheUser = async () => {
    try {
      const currentUser = await getCurrentUSer();
      if (currentUser) {
        setUser({
          id: currentUser.$id,
          name: currentUser.name,
          username: currentUser.username,
          email: currentUser.email,
          image_url: currentUser.image_url,
          bio: currentUser.bio,
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Error checking authentication:", e);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const validateAuth = async () => {
      setIsLoading(true);
      const publicPaths = ["/sign-in", "/sign-up"];
      if (publicPaths.includes(location.pathname)) {
        setIsLoading(false);
        return;
      }

      const isLoggedIn = await checkAutheUser();
      if (!isLoggedIn) {
        navigate("/sign-in");
      }
    };

    validateAuth();
  }, [location.pathname]);

  const value: IContextType = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAutheUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
export const useUserContext = () => useContext(AuthContext);
