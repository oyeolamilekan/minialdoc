/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { authenticateUser } from '@/endpoints'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'
import { FieldValues, useForm } from "react-hook-form";
import { setCookie } from 'cookies-next'
import { useModals, useSessionStorage } from '@/hooks'
import { redirectUrl } from '@/lib/utils'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/config/app'
import { ErrorMessage } from '@/components/ui/input-error'

export default function Login() {
  const { updateValue } = useSessionStorage(APP_NAME);

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const { modals, updateModals } = useModals();

  const toggleSuccessModal = () => updateModals({ signInModal: !modals.signInModal })

  const onSubmit = async (data: FieldValues) => {
    const { email, password } = data
    mutate({ email, password });
  };

  const { isPending, mutate } = useMutation({
    mutationFn: authenticateUser,
    async onSuccess({ data }) {
      updateValue({ ...data });
      setCookie("token", data.token)
      reset()
      redirectUrl("/dashboard/projects")
    },
    onError(err: any) {
      const { message } = err.response?.data;
      toast.error(message);
    },
  })

  return (
    <div className="h-screen fixed bg-slate-100 dark:bg-neutral-900 w-full">
      <div className="bg-white md:max-w-lg w-[90%]  mx-auto mt-10 shadow shadow-gray-300 rounded-xl px-10 py-8 flex justify-center flex-col dark:bg-black">
        <h3 className="text-xl font-semibold space-x-9 text-center mb-8">Sign in to your account.</h3>
        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="Email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Please enter a valid email address',
              }
            })}
          />
          <ErrorMessage message={errors.email?.message} />

          <Input
            placeholder="Password"
            type="password"
            {...register('password', {
              required: "Password is required",
              minLength: {
                value: 10,
                message: "Password must be at least 10 characters"
              },
            })}
          />
          <ErrorMessage message={errors.password?.message} />

          <Button className='w-full' disabled={isPending}>
            Sign in
          </Button>
          <p className="mt-5 text-center">
            Don&apos;t have an account? <Link href="/auth/sign-up" className="text-gray-500 underline font-semibold">Sign Up</Link>
          </p>
        </Form>
      </div>
      <Modal isShown={modals.signInModal} onClose={toggleSuccessModal}>
        <div className="flex flex-col items-center mb-5">
          <p className="text-center">
            You account has successfully been created, kindly check your mail for activation.
          </p>
        </div>
      </Modal>
    </div>
  )
}

