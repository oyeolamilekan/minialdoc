/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomSupense } from '@/components/ui/custom-suspense';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { apiProjects, createProject, deleteProject, updateProject } from '@/endpoints/api-projects';
import { useModals } from '@/hooks/useModal';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { AlertTriangle, ArrowRight, BoxIcon, MoreVertical, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import React, { useRef, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'
import { renderErrorMessage } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ImportOpenApiButton } from '@/components/api-endpoints/Import-open-api-button';

interface Project {
  id: number
  title: string
  slug: string
  base_url: string
  public_id: string
  description: string
}

export default function Projects() {

  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (formData: FormData) => {
    const query = formData.get('query') as string
    console.log('Searching for:', query)
    // Here you would typically handle the search logic,
    // such as filtering results or making an API call
  }

  const queryClient = new QueryClient();

  const router = useRouter()

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const { isLoading, isError, data } = useQuery({
    queryKey: ["projects"],
    queryFn: () => apiProjects(),
    retry: false,
  });

  const { modals, updateModals } = useModals();

  const toggleAddProjectModal = () => updateModals({ addProjectModal: !modals.addProjectModal })

  const toggleEditProjectModal = () => updateModals({ editAPIProjectModal: !modals.editAPIProjectModal })

  const toggleDeleteAPIProjectModal = () => updateModals({ deleteAPIProjectModal: !modals.deleteAPIProjectModal })

  const apiProjectRef = useRef<Project>()

  const onSubmit = async (data: FieldValues) => {
    const { title, description, base_url } = data
    mutate({ title, description, base_url });
  };

  const { isPending, mutate } = useMutation({
    mutationFn: createProject,
    onSuccess() {
      toggleAddProjectModal();
      reset()
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
    onError(err: any) {
      const { message } = err.response?.data || '';
      toast.error(message);
    },
  })

  const validateBaseUrl = (value: string): true | string => {
    try {
      new URL(value);
      return true;
    } catch {
      return 'Invalid base URL';
    }
  };

  const { isPending: isDeletingAPIProject, mutate: deleteAPIProjectMutation } = useMutation({
    mutationFn: deleteProject,
    onSuccess() {
      toggleDeleteAPIProjectModal();
      toast.success("API Project deleted.")
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
    onError(err: any) {
      const { message } = err.response?.data || '';
      toast.error(message);
    },
  })

  const { isPending: isUpdatingAPIProject, mutate: updateAPIProjectMutation } = useMutation({
    mutationFn: updateProject,
    onSuccess() {
      toggleEditProjectModal();
      toast.success("API Project updated.")
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
    onError(err: any) {
      const { message } = err.response?.data || '';
      toast.error(message);
    },
  })

  const updateAPIProjectAction = async (data: FieldValues) => {
    const { title, description, base_url } = data
    updateAPIProjectMutation({ title, description, base_url, id: apiProjectRef.current!.public_id as string });
  };

  const deleteAPIProjectAction = async () => {
    deleteAPIProjectMutation(apiProjectRef.current!.slug.toString())
  }

  return (
    <div>
      <div className="flex items-center space-x-4 justify-center mb-5">
        <Form
          action={handleSearch}
          className="flex-1"
        >
          <div className="relative">
            <Input
              type="text"
              name="query"
              placeholder="Search platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4" // Added fixed height
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </Form>
        <Button
          onClick={toggleAddProjectModal}
          className="flex items-center h-10" // Added fixed height to match input
        >
          <Plus className="mr-2" size={20} />
          Add Project
        </Button>
      </div>
      <CustomSupense
        isLoading={isLoading}
        isError={isError}
        isEmpty={data?.data?.length <= 0}
        fallBackEmpty={
          <div className="flex items-center justify-center md:h-4/6 h-3/6 w-full">
            <div className="flex flex-col items-center justify-center">
              <div className="p-5 rounded-full dark:bg-neutral-600 bg-secondary">
                <BoxIcon />
              </div>
              <p className="my-4 font-medium dark:text-white text-xl">No projects available.</p>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.data
            ?.filter((project: Project) => {
              if (!searchQuery) return true;

              const query = searchQuery.toLowerCase();
              return (
                project.title.toLowerCase().includes(query) ||
                project.base_url.toLowerCase().includes(query) ||
                project.description.toLowerCase().includes(query)
              );
            })
            .map((project: Project) => (
              <Card
                key={project.id}
                className="overflow-hidden border border-gray-200 transition-colors duration-300 hover:border-gray-300 rounded"
              >
                <CardHeader className="p-6">
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-4">
                  <p className="text-sm text-gray-600 mb-2">{project.base_url}</p>
                  <p className="text-gray-600">{project.description}</p>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0 flex justify-between items-center">
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-4 py-2 -ml-4 rounded-md transition-colors duration-300"
                    onClick={() => router.push(`features/${project.slug}`)}
                  >
                    View Project <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <ImportOpenApiButton
                    projectSlug={project.slug || ''}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors duration-300"
                            >
                              <MoreVertical className="w-4 h-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              className="text-gray-700 hover:text-gray-900 cursor-pointer"
                              onClick={() => {
                                apiProjectRef.current = project
                                reset({
                                  title: apiProjectRef.current?.title,
                                  base_url: apiProjectRef.current?.base_url,
                                  description: apiProjectRef.current?.description,
                                })
                                toggleEditProjectModal()
                              }}
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                              onClick={() => {
                                toggleDeleteAPIProjectModal()
                                apiProjectRef.current = project
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Project options</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardFooter>
              </Card>
            ))}
        </div>
      </CustomSupense>
      <Modal isShown={modals.addProjectModal} onClose={toggleAddProjectModal} title='Add Project'>
        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Input
              type="text"
              placeholder="Title"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="text-red-500 text-sm">{renderErrorMessage(errors.title.message)}</p>}
          </div>
          <div className="space-y-1">
            <Input
              type="text"
              placeholder="Base Url"
              {...register('base_url', { required: 'Base Url is required', validate: validateBaseUrl })}
            />
            {errors.base_url && <p className="text-red-500 text-sm">{renderErrorMessage(errors.base_url.message)}</p>}
          </div>
          <div className="space-y-1">
            <Textarea
              placeholder="Description"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <p className="text-red-500 text-sm">{renderErrorMessage(errors.description.message)}</p>}
          </div>
          <Button className='w-full' disabled={isPending}>
            Add Project
          </Button>
        </Form>
      </Modal>
      <Modal isShown={modals.editAPIProjectModal} onClose={toggleEditProjectModal} title='Edit Project'>
        <Form onSubmit={handleSubmit(updateAPIProjectAction)} className="space-y-4">
          <div className="space-y-1">
            <Input
              type="text"
              placeholder="Title"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="text-red-500 text-sm">{renderErrorMessage(errors.title.message)}</p>}
          </div>
          <div className="space-y-1">
            <Input
              type="text"
              placeholder="Base Url"
              {...register('base_url', { required: 'Base Url is required', validate: validateBaseUrl })}
            />
            {errors.base_url && <p className="text-red-500 text-sm">{renderErrorMessage(errors.base_url.message)}</p>}
          </div>
          <div className="space-y-1">
            <Textarea
              placeholder="Description"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <p className="text-red-500 text-sm">{renderErrorMessage(errors.description.message)}</p>}
          </div>
          <div className="flex space-x-3 w-full">
            <Button className='w-full' disabled={isUpdatingAPIProject}>
              Proceed
            </Button>
            <Button className="flex-1" variant={"outline"} onClick={toggleEditProjectModal}>
              No
            </Button>
          </div>
        </Form>
      </Modal>
      <Modal isShown={modals.deleteAPIProjectModal} onClose={toggleDeleteAPIProjectModal}>
        <div className="flex flex-col items-center w-full">
          <div className="mb-4 p-3 rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-center text-2xl font-semibold">Delete Project</h1>
          <p className="my-5 text-center">
            This action cannot be undone. This will permanently delete this project and
            all the API endpoint and remove all associated data from our servers.
          </p>
          <div className="flex space-x-3 w-full">
            <Button className="flex-1"
              variant={'destructive'}
              disabled={isDeletingAPIProject}
              onClick={deleteAPIProjectAction}
            >
              Delete API Project
            </Button>
            <Button className="flex-1" variant={"outline"} onClick={toggleDeleteAPIProjectModal}>
              No
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
