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
import { SignupValidation } from "@/lib/validation/schemas";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  useCreateUSerAccMutation,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/Authcontext";
const SignupForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast(); // Corrected to use the toast hook
  const { checkAutheUser } = useUserContext();

  const { mutateAsync: createUserAcc, isPending: isCreatingUser } =
    useCreateUSerAccMutation();

  const { mutateAsync: siginAcc } = useSignInAccount();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    try {
      const Newuser = await createUserAcc(values);

      if (!Newuser) {
        return toast({
          title: "Error",
          description: "User account creation failed. Please try again.",
          variant: "destructive",
        });
      }
      toast({
        title: "Success",
        description: "User account created successfully.",
        variant: "default",
      });
      const session = await siginAcc({
        email: values.email,
        password: values.password,
      });
      if (!session) {
        return toast({
          title: "Error",
          description: "User account creation failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating user account:", error);
    }
    const isLoggedin = await checkAutheUser();
    if (isLoggedin) {
      form.reset();
      navigate("/");
    } else {
      toast({
        title: "Error",
        description: "Signup Failed. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col bg-black py-5">
        <img src="/assets/images/Frame 1.png" className="w-100% h-24" />
        <h2 className="text-sm h3-bold md:h2-bold pt-5 sm:pt-2 mb-6">
          Create a new account
        </h2>
        <p className="text-light-4 small-medium md:base-regular">
          Please enter your details here
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)} // Trigger the onSubmit function
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    placeholder="Name"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    placeholder="Username"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
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
          <Button
            className="shad-button_primary "
            type="submit"
            // Disable the button while loading
          >
            {isCreatingUser ? (
              <div className="flex-center gap-2">
                <Loader />
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="flex w-full items-center justify-center space-x-2 pt-8 text-sm font-medium text-muted-foreground">
          <p className="">
            Already have an Account?{" "}
            <a className=" text-purple-600 ml-1" href="/sign-in">
              Log in
            </a>
          </p>
        </div>
      </div>
    </Form>
  );
};

export default SignupForm;
