"use client";

import type { InputProps } from "@nextui-org/react";

import React, { ReactNode, useEffect, useState, useTransition } from "react";
import { Button, Input, Checkbox, Link, Divider } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { registerUser, verificationToken } from "@/actions/auth-actions";
import { signUpSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { FormErrors } from "../form-errors";

export default function RegisterForm() {

  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
  const [isPending, startTransition] = useTransition();
  const [allow, setAllow] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });
  const onSubmit = handleSubmit((data) =>
    startTransition(() => {
      toast.promise(registerUser(data as z.infer<typeof signUpSchema>), {
        loading: "Loading...",
        success: (result) => `${result}`,
        error: (err) => err.message,
      });
    }),
  );
  useEffect(() => {
    if (token) {
      const verified = verificationToken(token).then((data) => {
        if (data.success) setAllow(true)
        if (data.error)
          toast.error(data.error)
      });
    }

  }, [setAllow])

  const inputClasses: InputProps["classNames"] = {
    inputWrapper:
      "border-transparent bg-default-50/40 dark:bg-default-50/20 group-data-[focus=true]:border-primary data-[hover=true]:border-foreground/20",
  };

  const buttonClasses = "bg-foreground/10 dark:bg-foreground/20";

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 p-2 sm:p-4 lg:p-8">
      {allow ? (
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-background/60 px-8 pb-10 pt-6 shadow-small backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50">
          <p className="pb-2 text-xl font-medium">Sign Up</p>
          <form className="flex flex-col gap-3" onSubmit={onSubmit}>
            <Input
              isRequired
              classNames={inputClasses}
              label="Name"
              isDisabled={isPending}
              {...register("name")}
              isInvalid={!!errors.name}
              errorMessage={errors?.name?.message as ReactNode}
              placeholder="Enter your Name"
              type="text"
              variant="bordered"
            />
            <Input
              isRequired
              classNames={inputClasses}
              label="Email Address"
              isDisabled={isPending}
              {...register("email")}
              isInvalid={!!errors.email}
              errorMessage={errors?.email?.message as ReactNode}
              placeholder="Enter your email"
              type="email"
              variant="bordered"
            />
            <Input
              isRequired
              classNames={inputClasses}
              endContent={
                <button type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <Icon
                      className="pointer-events-none text-2xl text-foreground/50"
                      icon="solar:eye-closed-linear"
                    />
                  ) : (
                    <Icon
                      className="pointer-events-none text-2xl text-foreground/50"
                      icon="solar:eye-bold"
                    />
                  )}
                </button>
              }
              label="Password"
              isDisabled={isPending}
              {...register("password")}
              isInvalid={!!errors.password}
              errorMessage={errors?.password?.message as ReactNode}
              placeholder="Enter your password"
              type={isVisible ? "text" : "password"}
              variant="bordered"
            />
            <Input
              isRequired
              isDisabled={isPending}
              classNames={inputClasses}
              endContent={
                <button type="button" onClick={toggleConfirmVisibility}>
                  {isConfirmVisible ? (
                    <Icon
                      className="pointer-events-none text-2xl text-foreground/50"
                      icon="solar:eye-closed-linear"
                    />
                  ) : (
                    <Icon
                      className="pointer-events-none text-2xl text-foreground/50"
                      icon="solar:eye-bold"
                    />
                  )}
                </button>
              }
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm your password"
              type={isConfirmVisible ? "text" : "password"}
              variant="bordered"
            />
            <Checkbox
              isRequired
              isDisabled={isPending}
              classNames={{
                base: "py-4",
                label: "text-foreground/50",
                wrapper: "before:border-foreground/50",
              }}
              size="sm"
            >
              I agree with the&nbsp;
              <Link color="foreground" href="#" size="sm">
                Terms
              </Link>
              &nbsp; and&nbsp;
              <Link color="foreground" href="#" size="sm">
                Privacy Policy
              </Link>
            </Checkbox>
            <Button isLoading={isPending} isDisabled={isPending} className={buttonClasses} type="submit">
              Sign Up
            </Button>
          </form>
          <div className="flex items-center gap-4 py-2">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">OR</p>
            <Divider className="flex-1" />
          </div>
          <div className="flex flex-col gap-2">
            <Button isDisabled={isPending} className={buttonClasses} startContent={<Icon icon="fe:google" width={24} />}>
              Continue with Google
            </Button>
            <Button isDisabled={isPending} className={buttonClasses} startContent={<Icon icon="fe:github" width={24} />}>
              Continue with Github
            </Button>
          </div>
          <p className="text-center text-small text-foreground/50">
            Already have an account?&nbsp;
            <Link color="foreground" href="/auth/login" size="sm">
              Log In
            </Link>
          </p>
        </div>
      ) : (
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-background/60 px-8 pb-20 pt-20 shadow-small backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50">
          <FormErrors message="You don't have permissions to view this form" />
        </div>
      )}
    </div>

  );
}
