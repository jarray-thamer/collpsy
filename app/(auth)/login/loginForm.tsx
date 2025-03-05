"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Loader2Icon } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState, useTransition } from "react";

import { login } from "./actions";

import Link from "next/link";
import { PasswordInput } from "@/components/shared/passwordInput";
import { SignInData, SignInSchema } from "@/validations/signInSchema";

export default function LoginForm() {
  const [error, setError] = useState<string>();

  const [isPending, startTransition] = useTransition();

  const form = useForm<SignInData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInData) => {
    setError(undefined);
    startTransition(async () => {
      const { error } = await login(values);
      if (error) setError(error);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={form.control}
          disabled={isPending}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isPending}
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between">
                <span>Password</span>
                <Link
                  href="/forget-password"
                  className="hover:underline cursor-pointer"
                >
                  Forget Password ?
                </Link>
              </FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? <Loader2Icon className="animate-spin" /> : <p>Login</p>}
        </Button>
      </form>
    </Form>
  );
}