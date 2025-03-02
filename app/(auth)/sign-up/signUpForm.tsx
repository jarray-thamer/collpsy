"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpData } from "@/validations/signUpSchema";
import { signUp } from "@/app/(auth)/sign-up/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/shared/passwordInput";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2Icon } from "lucide-react";


type FormStep = "account" | "personal" | "general" ;

export default function SignUpForm() {
  const [step, setStep] = useState<FormStep>("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword:"",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      city: "",
      role: "STUDENT",
    },
  });

  // get the days with that month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  // Handle file input change for avatar preview
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string; 
        form.setValue("avatar", dataUrl); 
        setPreviewUrl(dataUrl); 
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue("avatar", ""); // Clear avatar if no file is selected
      setPreviewUrl(null); // Clear preview
    }
  };

  // Go to next step if current step is valid
  const handleNext = async () => {
    let fieldsToValidate: (keyof SignUpData)[] = [];
    
    switch (step) {
      case "general":
        fieldsToValidate = ["firstName", "lastName", "role"];
        break;
      case "account":
        fieldsToValidate = ["email", "password", "confirmPassword"];
        break;
      case "personal":
        fieldsToValidate = ["city","phoneNumber","birthDate", "avatar"];
        break;
    }

    const isStepValid = await form.trigger(fieldsToValidate);
    
    if (isStepValid) {
      switch (step) {
        case "account":
          setStep("general");
          break;
        case "personal":
          setStep("account");
          break;
        case "general":
          setStep("personal");
          break;
      }
    }
  };

  // Go back to previous step
  const handleBack = () => {
    switch (step) {
      case "personal":
        setStep("general");
        break;
      case "account":
        setStep("personal");
        break;
      case "general":
        setStep("general");
        break;
    }
  };

  // Submit the form
  const onSubmit = async (data: SignUpData) => {
    setIsSubmitting(true);
    setFormError(null);
  
    try {
      console.log("form:",data);
      
      const result = await signUp(data); // Pass data with base64 string directly
      if (result?.error) {
        setFormError(result.error);
        setIsSubmitting(false);
      }
      // Note: Success handling (e.g., redirect) is not shown in the original code
    } catch (error) {
      console.error('Sign up failed:', error);
      setFormError('An error occurred during sign up. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          {step === "account" && "Enter your email and password to get started."}
          {step === "general" && "Tell us a bit about yourself."}
          {step === "personal" && "Almost done! Let us know you better."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {step === "general" && (
              <>
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

              
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your account type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="STUDENT">Student</SelectItem>
                          <SelectItem value="PSY">Psychologist</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === "personal" && (
              <>
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your city" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="8 digits phone number" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

<FormField
  control={form.control}
  name="birthDate"
  render={({ field }) => {
    const currentDate = field.value ? new Date(field.value) : null;
    const currentYear = currentDate?.getFullYear();
    const currentMonth = currentDate ? currentDate.getMonth() + 1 : null;
    const currentDay = currentDate?.getDate();

    return (
      <FormItem className="flex flex-col">
        <FormLabel>Date of Birth</FormLabel>
        <div className="flex gap-2">
          {/* Year Select */}
          <Select
            value={currentYear?.toString() || ""}
            onValueChange={(value) => {
              const year = parseInt(value);
              const month = currentMonth || 1;
              const day = currentDay || 1;
              const daysInMonth = getDaysInMonth(month, year);
              const newDate = new Date(
                year,
                month - 1,
                Math.min(day, daysInMonth)
              );
              field.onChange(newDate);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => {
                const year = 1900 + i;
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              }).reverse()}
            </SelectContent>
          </Select>

          {/* Month Select */}
          <Select
            value={currentMonth?.toString() || ""}
            onValueChange={(value) => {
              const month = parseInt(value);
              const year = currentYear || 2002;
              const day = currentDay || 1;
              const daysInMonth = getDaysInMonth(month, year);
              const newDate = new Date(
                year,
                month - 1,
                Math.min(day, daysInMonth)
              );
              field.onChange(newDate);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const month = i + 1;
                return (
                  <SelectItem key={month} value={month.toString()}>
                    {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Day Select */}
          <Select
            value={currentDay?.toString() || ""}
            onValueChange={(value) => {
              const day = parseInt(value);
              const year = currentYear || 2002;
              const month = currentMonth || 1;
              const newDate = new Date(year, month - 1, day);
              field.onChange(newDate);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ 
                length: currentYear && currentMonth 
                  ? getDaysInMonth(currentMonth, currentYear) 
                  : 31
              }, (_, i) => {
                const day = i + 1;
                return (
                  <SelectItem key={day} value={day.toString()}>
                    {day}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <FormMessage />
      </FormItem>
    );
  }}
/>
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <div className="flex items-center gap-4">
                    {previewUrl && (
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img 
                          src={previewUrl} 
                          alt="Avatar preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </FormItem>
              </>
            )}

            {step === "account" && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="you@example.com" 
                          type="email" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
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
                        <PasswordInput 
                          placeholder="Create a secure password" 
                          {...field} 
                        />
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
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput 
                          placeholder="Confirm your password" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {formError && (
                  <div className="text-sm font-medium text-destructive">
                    {formError}
                  </div>
                )}
              </>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step !== "general" && (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
          >
            Back
          </Button>
        )}
        
        {step !== "account" ? (
          <Button
            type="button"
            onClick={handleNext}
            className={step === "general" ? "ml-auto" : ""}
          >
            Next
          </Button>
        ) : (
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}