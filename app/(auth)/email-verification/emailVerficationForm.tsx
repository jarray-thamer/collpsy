"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";
import { resendVerificationEmailCode, verifyEmail } from "./actions";
import { logout } from "../actions";
import Link from "next/link";
import { ValidationEmailCodeData, validationEmailCodeSchema } from "@/validations/emailValidation";

export default function EmailVerificationForm({
  userEmail,
}: {
  userEmail: string;
}) {
  const [error, setError] = useState<string>();
  const [resendMsg, setResendMsg] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ValidationEmailCodeData>({
    resolver: zodResolver(validationEmailCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(value: ValidationEmailCodeData) {
    setError(undefined);
    startTransition(async () => {
      const { error } = await verifyEmail(value.code, userEmail);
      if (error) setError(error);
    });
  }

  async function resendEmailVerificationCode() {
    setError(undefined);
    setResendMsg(undefined);
    startTransition(async () => {
      const { error, resendMsg } = await resendVerificationEmailCode(userEmail);
      if (error) setError(error);
      if (resendMsg) setResendMsg(resendMsg);
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          {error && <p className="text-center text-destructive">{error}</p>}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP disabled={isPending} maxLength={5} {...field}>
                    <InputOTPGroup className="mx-auto">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
                <FormDescription>
                  The code was sent to you is available for 1 hour.
                </FormDescription>
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
      {resendMsg && <p className="text-center text-gray-800">{resendMsg}</p>}
      <p
        onClick={resendEmailVerificationCode}
        className="block text-center mt-0 hover:underline cursor-pointer"
      >
        Resend code
      </p>
      <Link
        className="hover:underline text-center block"
        href={"/signup"}
        onClick={() => logout()}
      >
        Create another account
      </Link>
    </>
  );
}