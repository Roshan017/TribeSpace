import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { SigninValidation } from "@/lib/validation/schemas";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"; // ✅ Fixed import
import { useUserContext } from "@/context/Authcontext";

const SigninForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkAutheUser, isLoading: isUserLoading } = useUserContext();

  const { mutateAsync: signIn } = useSignInAccount(); // ✅ Renamed for clarity

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    try {
      const session = await signIn({
        email: values.email,
        password: values.password,
      });

      if (!session) {
        throw new Error("No session returned");
      }

      const isLoggedin = await checkAutheUser();

      if (isLoggedin) {
        form.reset();
        toast({
          title: "Success",
          description: "User Login successful.",
          variant: "default",
        });
        navigate("/");
      } else {
        throw new Error("Auth check failed");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col bg-black py-5">
        <img src="/assets/images/Frame 1.png" className="w-100% h-24" />
        <h2 className="text-sm h3-bold md:h2-bold pt-5 sm:pt-2 mb-6">
          Login to your Account
        </h2>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="shad-input"
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="shad-button_primary " type="submit">
            {isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader />
              </div>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <div className="flex w-full items-center justify-center space-x-2 pt-8 text-sm font-medium text-muted-foreground">
          <p>
            Don't have an Account?{" "}
            <a className="ml-1 text-purple-600" href="/sign-up">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </Form>
  );
};

export default SigninForm;
