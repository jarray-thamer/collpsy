"use client";

import { PasswordInput } from "@/components/shared/passwordInput";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useState, useTransition } from "react";

import {
  CheckCircleIcon,
  Loader2Icon,
  SquareArrowOutUpRightIcon,
} from "lucide-react";
import { confirmPasswordReset } from "./actions";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ResetPasswordData, resetPasswordSchema } from "@/validations/forgetPassword";

export default function ConfirmResetPasswordForm() {
  const token = useParams().token;

  const [error, setError] = useState<string>();
  const [msg, setMsg] = useState<string>();

  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  async function onSubmit(values: ResetPasswordData) {
    setError(undefined);
    setMsg(undefined);
    startTransition(async () => {
      const { error, msg } = await confirmPasswordReset(values, token);
      if (error) setError(error);
      if (msg) setMsg(msg);
    });
  }

  return (
    <>
      {!msg && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {error && <p className="text-center text-destructive">{error}</p>}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <p>Confirm</p>
              )}
            </Button>
          </form>
        </Form>
      )}
      {msg && (
        <div className="text-center justify-center items-center flex flex-col space-y-4 w-full text-blue-600 text-lg">
          <p className="flex items-center space-x-2 text-center font-medium text-emerald-600">
            <span>{msg}</span>
            <CheckCircleIcon />
          </p>
          <Link
            className="flex items-center space-x-1 text-center text-base font-medium text-blue-600 hover:underline"
            href={"/login"}
          >
            <span>Login </span>
            <SquareArrowOutUpRightIcon className="size-4" />
          </Link>
        </div>
      )}
    </>
  );
}