import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useUserContext } from "@/context/Authcontext";
import { ProfileValidation } from "@/lib/validation/schemas";
import {
  useGetUserbyID,
  useUpdateUser,
} from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import ProfileUploader from "@/components/shared/ProfileUploader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const UpdateProfile = () => {
  const { toast } = useToast();
  const nav = useNavigate();
  const { id } = useParams();
  const { user, setUser } = useUserContext();

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
    },
  });
  const { data: currentuser } = useGetUserbyID(id || "");
  const { mutateAsync: updateUser, isLoading: isLoaded } = useUpdateUser();
  //console.log(currentuser);
  if (!currentuser) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }
  const handleUpdate = async (value: z.infer<typeof ProfileValidation>) => {
    const updatedUser = await updateUser({
      userId: currentuser.$id,
      name: value.name,
      bio: value.bio,
      file: value.file,
      imageUrl: currentuser.image_url,
      imageId: currentuser.image_id,
    });
    console.log(updatedUser);
    if (!updatedUser) {
      toast({
        title: "Profile Update Failed",
        description: "Please Try After Sometime",
        variant: "default",
      });
    }
    setUser({
      ...user,
      name: updatedUser?.name,
      bio: updatedUser?.bio,
      image_url: updatedUser?.imageUrl,
    });
    return nav(`/profile/${id}`);
  };
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl ">
          <img
            src="/assets/icons/edit.svg"
            alt="Edit"
            height={36}
            width={36}
            className="invert-white"
          />
          <p className="h3-bold md:h2-bold text-left w-full">Edit Profile</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl"
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader
                      fieldchange={field.onChange}
                      mediaUrl={currentuser.imageUrl}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Bio</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <div className="flex gap-4 items-center justify-end">
              <Button
                type="button"
                className="shad-button_dark_4"
                onClick={() => nav(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoaded}
                className="shad=button_primary whitespace-nowrap"
              >
                {isLoaded && <Loader />}Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;
