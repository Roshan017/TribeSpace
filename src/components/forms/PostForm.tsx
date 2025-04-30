import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { Input } from "../ui/input";
import { PostValidation } from "@/lib/validation/schemas";
import { Models } from "appwrite";
import { useUserContext } from "@/context/Authcontext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutations";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

export function PostForm({ post, action }: PostFormProps) {
  const { user } = useUserContext();
  const { toast } = useToast();
  const Nav = useNavigate();
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: UpdatePost, isPending: isLoadingUpdate } =
    useUpdatePost();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      tags: post ? post?.tags.join(",") : "",
      location: post ? post?.location : "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    if (post && action == "Update") {
      const UpdatedPost = await UpdatePost({
        ...values,
        postId: post.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      });

      if (!UpdatedPost) {
        toast({
          title: "Post Update Failed",
          description: "Please Try Again",
          variant: "destructive",
        });
      }
      toast({
        title: "Post Updated!",
        variant: "default",
      });
      return Nav(`/post/${post.$id}`);
    }
    const NewPost = await createPost({
      ...values,
      userId: user.id,
    });

    if (!NewPost) {
      toast({
        title: "Post Upload Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
    Nav("/");
  }
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-9 w-full max-w-5xl"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  placeholder="Caption"
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>

              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Location"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags{" "}
                <p className="text-light-4">(separated by comma " , ")</p>
              </FormLabel>
              <FormControl>
                <Input
                  className="shad-input"
                  type="text"
                  placeholder="Place,Sunset,Music...."
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />
        <div className="flex  gap-3 items-center  justify-end">
          <Button
            onClick={() => form.reset()}
            className="shad-button_dark_4"
            variant={"destructive"}
            type="button"
          >
            Clear
          </Button>
          <Button
            className="shad-button_primary whitespace-nowrap"
            variant={"secondary"}
            type="submit"
            disabled={isLoadingUpdate || isLoadingCreate}
          >
            {isLoadingCreate || isLoadingUpdate ? "Loading.." : action}
          </Button>
        </div>
      </form>
    </Form>
  );
}
export default PostForm;
