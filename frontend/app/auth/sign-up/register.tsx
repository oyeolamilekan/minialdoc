/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { createUser } from '@/endpoints'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { FieldValues, useForm } from "react-hook-form";
import { useModals } from '@/hooks'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import ErrorMessage from '@/components/ui/input-error'

export default function Register() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const { modals, updateModals } = useModals();

  const [isAcceptTerms,] = useState<boolean>(false)

  const toggleSuccessModal = () => updateModals({ successModal: !modals.successModal })

  const onSubmit = async (data: FieldValues) => {
    const { email, password, first_name, last_name, buisness_name } = data
    mutate({ email, password, first_name, last_name, buisness_name });
  };

  const { isPending, mutate } = useMutation({
    mutationFn: createUser,
    onSuccess() {
      toggleSuccessModal();
      reset()
    },
    onError(err: any) {
      const { message } = err.response?.data;
      toast.error(message);
    },
  })

  return (
    <div className="h-screen fixed bg-slate-100 dark:bg-neutral-900 w-full">
      <div className="bg-white md:max-w-lg w-[90%]  mx-auto mt-10 shadow shadow-gray-300 rounded-xl px-10 py-8 flex justify-center flex-col dark:bg-black">
        <h3 className="text-xl font-semibold space-x-9 text-center mb-8">Create account.</h3>
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

          <Input
            placeholder="Buisness Name"
            type="text"
            {...register('buisness_name', {
              required: "Buisness Name is required",
              minLength: {
                value: 5,
                message: "Buisness Name must be at least 5 characters"
              },
            })}
          />
          <ErrorMessage message={errors.buisness_name?.message} />

          <Input
            placeholder="First Name"
            type="text"
            {...register('first_name', {
              required: "First name is required"
            })}
          />
          <ErrorMessage message={errors.first_name?.message} />

          <Input
            placeholder="Last Name"
            type="text"
            {...register('last_name', {
              required: "Last name is required"
            })}
          />
          <ErrorMessage message={errors.last_name?.message} />

          <Button className='w-full' disabled={isPending || isAcceptTerms}>
            Create Account
          </Button>
          <p className="mt-5 text-center">
            Have an account? <Link href="/auth/sign-in" className="text-gray-500 underline font-semibold">Sign In</Link>
          </p>
        </Form>
      </div>
      <Modal isShown={modals.successModal} onClose={toggleSuccessModal}>
        <div className="flex flex-col items-center mb-5">
          <p className="text-center">
            You account has successfully been created, kindly check your mail for activation.
          </p>
        </div>
      </Modal>
    </div>
  )
}

