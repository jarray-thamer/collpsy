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

import { useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";



import { forgotPassword } from "./actions";
import { CheckCircleIcon, Loader2Icon } from "lucide-react";
import { forgetPasswordData, forgetPasswordSchema } from "@/validations/forgetPassword";

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string>();
  const [msg, setMsg] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<forgetPasswordData>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: forgetPasswordData) => {
    setError(undefined);
    setMsg(undefined);
    startTransition(async () => {
      const { error, msg } = await forgotPassword(values);
      if (error) setError(error);
      if (msg) setMsg(msg);
    });
  };

  return (
    <>
      {!msg ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {error && <p className="text-center text-destructive">{error}</p>}
            <FormField
              disabled={isPending}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <p>Submit</p>
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <p className="text-center justify-center items-center flex w-full text-blue-600 text-lg">
          <span>{msg}</span>
          <CheckCircleIcon />
        </p>
      )}
    </>
  );
}