import "./App.css";
import { Routes, Route } from "react-router-dom";
import SigninForm from "./_auth/forms/SigninForm";
import {
  Home,
  UpdateProfile,
  Explore,
  Profile,
  Saved,
  Create,
  PostDetails,
  AllUSers,
  UpdatePost,
} from "./_root/pages";
import SignupForm from "./_auth/forms/SignupForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import { Toaster } from "./components/ui/toaster";

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/*Publiec routes*/}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>
        {/*Private routes*/}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" index element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/people" element={<AllUSers />} />
          <Route path="/create-post" element={<Create />} />
          <Route path="/update-post/:id" element={<UpdatePost />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id/*" element={<UpdateProfile />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};

export default App;
