import { z } from "zod";
export const SignupValidation = z.object({
  username: z.string().min(1, "Username is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter email correctly"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
export const SigninValidation = z.object({
  email: z.string().email("Enter email correctly"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
export const PostValidation = z.object({
  caption: z.string().min(5).max(2000),
  tags: z.string().optional(),
  location: z.string().optional(),
  file: z.custom<File[]>(),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});
