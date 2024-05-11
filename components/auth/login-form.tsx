"use client";

import React, { ReactNode, useTransition } from "react";
import {Button, Input, Checkbox, Link} from "@nextui-org/react";
import {Icon} from "@iconify/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { signInSchema } from "../schemas";
import { z } from "zod";
import { login } from "@/actions/auth-actions";
import { AcmeIcon } from "../social";

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
    resolver: zodResolver(signInSchema),
  })
  const onSubmit = handleSubmit((data) => startTransition(() => {
    toast.promise(login(data as z.infer<typeof signInSchema>), {
      loading: 'Loading',
      success: (result) => `${result}`,
      error: (err) => err.message
    });
  }))
  return (
    <div className='flex h-screen w-screen items-center justify-end overflow-hidden bg-content1 bg-gradient-to-r from-cyan-500 to-blue-500 p-2 sm:p-4 lg:p-8'>
    {/* Brand Logo */}
    <div className='absolute left-10 top-10'>
      <div className='flex items-center'>
        <AcmeIcon className='text-background' />
        <p className='font-medium text-white'>STRUCTEC</p>
      </div>
    </div>

    {/* Login Form */}
    <div className='flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-lg'>
      <p className='pb-2 text-xl font-medium'>Log In</p>
      <form className='flex flex-col gap-3' onSubmit={onSubmit}>
        <Input
          label='Email Address'
          isDisabled={isPending}
          {...register("email")}
          isInvalid={!!errors.email}
          errorMessage={errors?.email?.message as ReactNode}
          placeholder='Enter your email'
          type='email'
          variant='bordered'
        />
        <Input
          endContent={
            <button type='button' onClick={toggleVisibility}>
              {isVisible ? (
                <Icon
                  className='pointer-events-none text-2xl text-default-400'
                  icon='solar:eye-closed-linear'
                />
              ) : (
                <Icon
                  className='pointer-events-none text-2xl text-default-400'
                  icon='solar:eye-bold'
                />
              )}
            </button>
          }
          label='Password'
          isDisabled={isPending}
          {...register("password")}
          isInvalid={!!errors.password}
          errorMessage={errors?.password?.message as ReactNode}
          placeholder='Enter your password'
          type={isVisible ? 'text' : 'password'}
          variant='bordered'
        />
        <div className='flex items-center justify-between px-1 py-2'>
          <Checkbox name='remember' size='sm'>
            Remember me
          </Checkbox>
          <Link className='text-default-500' href='#' size='sm'>
            Forgot password?
          </Link>
        </div>
        <Button isLoading={isPending} color='primary' type='submit'>
          Log In
        </Button>
      </form>
    </div>
  </div>
  );
}
