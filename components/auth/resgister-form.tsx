"use client";

import React, { ReactNode, startTransition, useTransition } from "react";
import { Button, Input, Checkbox, Link, Divider } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { AcmeIcon } from "../social";
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema } from "@/components/schemas";
import { registerUser } from "@/actions/auth-actions";
import toast from 'react-hot-toast'

import { z } from "zod";


export default function Component() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
  const [isPending, startTransition]= useTransition();
  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signUpSchema),
  })
  const onSubmit = handleSubmit((data) => startTransition(() => {
    toast.promise(registerUser(data as z.infer<typeof signUpSchema>), {
      loading: 'Loading',
      success: (result) => `${result}`,
      error: (err) => err.message
    });
  }))
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center pb-2">
        <AcmeIcon size={60} />
        <p className="text-xl font-medium">Welcome</p>
        <p className="text-small text-default-500">Create your account to get started</p>
      </div>
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
          <Input
            isRequired
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
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
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
            endContent={
              <button type="button" onClick={toggleConfirmVisibility}>
                {isConfirmVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Confirm Password"
            name="confirmPassword"
            isDisabled={isPending}
            placeholder="Confirm your password"
            type={isConfirmVisible ? "text" : "password"}
            variant="bordered"
          />
          <Checkbox isDisabled={isPending} isRequired className="py-4" size="sm">
            I agree with the&nbsp;
            <Link href="#" size="sm">
              Terms
            </Link>
            &nbsp; and&nbsp;
            <Link href="#" size="sm">
              Privacy Policy
            </Link>
          </Checkbox>
          <Button 
            isLoading={isPending}
            isDisabled={isPending} 
            color="primary" 
            type="submit">
            Sign Up
          </Button>
        </form>
        <div className="flex items-center gap-4">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1" />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            isDisabled={isPending}
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
          >
            Continue with Google
          </Button>
          <Button
            isDisabled={isPending}
            startContent={<Icon className="text-default-500" icon="fe:github" width={24} />}
            variant="bordered"
          >
            Continue with Github
          </Button>
        </div>
        <p className="text-center text-small">
          Already have an account?&nbsp;
          <Link isDisabled={isPending} href="/" size="sm">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
