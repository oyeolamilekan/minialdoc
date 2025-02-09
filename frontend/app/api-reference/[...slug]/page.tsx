/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { EndpointEditor } from '@/components/api-editor/editor'
import { ApiDocSidebar } from '@/components/ui/api-doc-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { createAPIEndpoint, createAPISection, deleteAPIEndpoint, deleteAPISection, fetchAPIEndpoint, fetchAPISectionAndEndpoints, fetchProject, updateAPIEndpoint, updateAPISection } from '@/endpoints/api-projects'
import { useModals } from '@/hooks/useModal'
import { APIEndpoint, Endpoint } from '@/interfaces'
import { Form } from '@/components/ui/form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { renderErrorMessage } from '@/lib/utils'
import { AlertTriangle, Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, lightDefaultTheme } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { BlockNoteEditor } from '@blocknote/core'

type Props = {
  params: {
    slug: string[]
  }
}

export default function Page({ params: { slug } }: Props) {
  const [content, setContent] = useState<string | null>(null)

  const [markdown, setMarkdown] = useState<string | null>(null)

  const [initialContent, setInitialContent] = useState<string | null>(null)

  const router = useRouter()

  const sectionRef = useRef<string>()

  const apiEndpointTypeRef = useRef<string>()

  const apiEndpointRef = useRef<string>()

  const apiSectionRef = useRef<string>()

  const { modals, updateModals } = useModals();

  const [projectSlug, endpointSlug] = slug;

  const queryClient = useQueryClient()

  const [endpointState, setEndpoint] = useState<APIEndpoint | null>(null)

  const editor = useMemo(() => {
    return BlockNoteEditor.create({
      initialContent: initialContent ? JSON.parse(initialContent) : null,
    });
  }, [initialContent]);

  const { data } = useQuery({
    queryKey: ["api_sections_and_endpoints", projectSlug],
    queryFn: () => fetchAPISectionAndEndpoints(projectSlug),
    retry: false,
  });

  const { data: endpoint, refetch } = useQuery({
    queryKey: ["api_endpoint", endpointSlug],
    enabled: Boolean(endpointSlug),
    queryFn: () => fetchAPIEndpoint(endpointSlug),
  });

  const { data: projectData } = useQuery({
    queryKey: ["api_project", projectSlug],
    queryFn: () => fetchProject(projectSlug),
    retry: false,
  });

  const { mutate: updateAPIEndpointMutation, isPending: isUpdatingAPIEndpoint } = useMutation({
    mutationFn: updateAPIEndpoint,
    onSuccess({ data }) {
      const { slug } = data
      router.push(`/api-reference/${projectSlug}/${slug}`)
      queryClient.invalidateQueries({ queryKey: ["api_sections_and_endpoints", projectSlug] })
      toast.success("API endpoint has been updated.")
    },
    onError(err: any) {
      const { message } = err.response?.data || '';
      toast.error(message);
    },
  })

  const { isPending: isCreatingAPISection, mutate: createAPISectionMutation } = useMutation({
    mutationFn: createAPISection,
    onSuccess() {
      toggleAddSectionModal();
      reset()
      queryClient.invalidateQueries({ queryKey: ["api_sections_and_endpoints", projectSlug] })
      toast.success("Section has been added")
    },
    onError(err: any) {
      const { message } = err.response?.data || '';
      toast.error(message);
    },
  })

  const { isPending: isUpdatingAPISection, mutate: updateAPISectionMutation } = useMutation({
    mutationFn: updateAPISection,
    onSuccess() {
      toggleEditSectionModal();
      reset()
      queryClient.invalidateQueries({ queryKey: ["api_sections_and_endpoints", projectSlug] })
      toast.success("Section has been updated.")
    },
    onError(err: any) {
      const { message } = err.response?.data || '';
      toast.error(message);
    },
  })

  const { isPending: isCreatingAPIEndpoint, mutate: createAPIEndpointMutation } = useMutation({
    mutationFn: createAPIEndpoint,
    onSuccess() {
      if (apiEndpointTypeRef.current == 'doc') {
        toggleAddAPIDocModal();
      } else {
        toggleAddAPIEndpointModal();
      }
      reset()
      queryClient.invalidateQueries({ queryKey: ["api_sections_and_endpoints", projectSlug] })
      toast.success("API endoint created.")
    },
    onError(err: any) {
      const { message } = err.response?.data || '';
      toast.error(message);
    },
  })

  const { isPending: isDeletingAPIEndpoint, mutate: deleteAPIEndpointMutation } = useMutation({
    mutationFn: deleteAPIEndpoint,
    onSuccess() {
      toggleDeleteAPIEndpointModal();
      reset()
      queryClient.invalidateQueries({ queryKey: ["api_sections_and_endpoints", projectSlug] })
      toast.success("API endoint deleted.")
    },
    onError(err: any) {
      const { message } = err.response?.data || '';
      toast.error(message);
    },
  })

  const { isPending: isDeletingAPISection, mutate: deleteAPISectionMutation } = useMutation({
    mutationFn: deleteAPISection,
    onSuccess() {
      toggleDeleteAPISectionModal();
      reset()
      queryClient.invalidateQueries({ queryKey: ["api_sections_and_endpoints", projectSlug] })
      toast.success("API section deleted.")
    },
    onError(err: any) {
      const { message } = err.response?.data || '';
      toast.error(message);
    },
  })

  const updateEndpoint = (updatedEndpoint: Endpoint) => {
    setEndpoint((prevEndpoint) => {
      if (!prevEndpoint) return null;

      return {
        ...prevEndpoint,
        body: {
          ...prevEndpoint.body,
          ...updatedEndpoint
        }
      }
    })
  }

  useEffect(() => {
    setInitialContent(endpoint?.data?.content)
    setEndpoint(endpoint?.data)
    if (Boolean(endpointSlug)) refetch()
  }, [endpointSlug, endpoint?.data, refetch])

  useEffect(() => {
    reset()
  }, [apiEndpointRef.current, sectionRef.current])

  const savePayload = () => {
    updateAPIEndpointMutation({ body: endpointState?.body, endpointId: endpointSlug as string })
  }

  const saveDoc = () => {
    updateAPIEndpointMutation({ content: content, markdown: markdown, endpointId: endpointSlug as string })
  }

  const handleAddSection = () => {
    toggleAddSectionModal()
    reset({ title: '' })
  }

  const handleAddEndpoint = (sectionSlug?: string) => {
    toggleAddAPIEndpointModal()
    apiEndpointTypeRef.current = 'endpoint'
    sectionRef.current = sectionSlug;
    reset({ title: '' })
  }

  const handleAddDoc = (sectionSlug?: string) => {
    toggleAddAPIDocModal()
    apiEndpointTypeRef.current = 'doc'
    sectionRef.current = sectionSlug;
    reset({ title: '' })
  }

  const handleEditSection = (sectionSlug: string, sectionText: string) => {
    apiSectionRef.current = sectionSlug
    reset({ title: sectionText })
    toggleEditSectionModal();
  }

  const handleDeleteSection = (sectionSlug?: string) => {
    toggleDeleteAPISectionModal()
    apiSectionRef.current = sectionSlug
  }

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const toggleAddSectionModal = () => updateModals({ addSectionModal: !modals.addSectionModal })

  const toggleEditSectionModal = () => updateModals({ editSectionModal: !modals.editSectionModal })

  const toggleAddAPIEndpointModal = () => updateModals({ addAPIEndpointModal: !modals.addAPIEndpointModal })

  const toggleAddAPIDocModal = () => updateModals({ addAPIDocModal: !modals.addAPIDocModal })

  const toggleEditAPIEndpointModal = () => updateModals({ editAPIEndpointModal: !modals.editAPIEndpointModal })

  const toggleDeleteAPIEndpointModal = () => updateModals({ deleteAPIEndpointModal: !modals.deleteAPIEndpointModal })

  const toggleDeleteAPISectionModal = () => updateModals({ deleteAPISectionModal: !modals.deleteAPISectionModal })

  const createAPISectionAction = async (data: FieldValues) => {
    const { title } = data
    createAPISectionMutation({ title, sectionId: projectSlug })
  };

  const createAPIEndpointAction = async (data: FieldValues) => {
    const { title } = data
    createAPIEndpointMutation({ title, sectionId: sectionRef.current!, projectId: projectSlug, endpoint_type: apiEndpointTypeRef.current! })
  };

  const deleteAPIEndpointAction = async () => {
    deleteAPIEndpointMutation(apiEndpointRef.current!)
  }

  const deleteAPISectionAction = async () => {
    deleteAPISectionMutation(apiSectionRef.current!)
  }

  const updateAPISectionAction = async (data: FieldValues) => {
    const { title } = data
    updateAPISectionMutation({ title, sectionId: apiSectionRef.current! })
  }

  const updateAPIEndpointAction = async (data: FieldValues) => {
    const { title } = data
    updateAPIEndpointMutation({ title, endpointId: apiEndpointRef.current! })
  };

  return (
    <ApiDocSidebar
      title={projectData?.data?.title}
      items={data?.data ?? []}
      appSlug={projectSlug}
      endpointSlug={endpointSlug}
      handleDeleteSection={handleDeleteSection}
      handleEditSection={handleEditSection}
      handleAddEndpoint={handleAddEndpoint}
      handleAddSection={handleAddSection}
      handleAddDoc={handleAddDoc}
    >
      <div className="">
        {endpointState?.endpoint_type == "doc" && (
          <>
            <div className='flex justify-between mr-4'>
              <h2 className='mx-6 text-3xl font-bold flex align-middle'>
                {endpointState.title}
                <Pencil className="mx-4 cursor-pointer"
                  onClick={() => {
                    apiEndpointRef.current = endpointState.slug
                    toggleEditAPIEndpointModal()
                    reset({ title: endpointState.title })
                  }}
                />
              </h2>
              <div className="space-x-4">
                <Button onClick={saveDoc}>Save</Button>

                <Button variant={"destructive"} onClick={() => {
                  apiEndpointRef.current = endpointState.slug
                  toggleDeleteAPIEndpointModal()
                }}>Delete</Button>
              </div>
            </div>
            <BlockNoteView
              editor={editor}
              className="mt-6"
              onChange={async() => {
                const markDownContent = await editor.blocksToMarkdownLossy(editor.document)
                setContent(JSON.stringify(editor.document))
                setMarkdown(markDownContent)
              }}
              theme={lightDefaultTheme}
            />
          </>
        )}

        {endpointState?.endpoint_type == "endpoint" && (
          <>
            <div className='flex justify-between mr-4'>
              <h2 className='mx-6 text-3xl font-bold'>{endpointState.title}</h2>
              <div className="space-x-4">
                <Button onClick={() => {
                  apiEndpointRef.current = endpointState.slug
                  toggleEditAPIEndpointModal()
                  reset({ title: endpointState.title })
                }}>Edit</Button>
                <Button variant={"destructive"} onClick={() => {
                  apiEndpointRef.current = endpointState.slug
                  toggleDeleteAPIEndpointModal()
                }}>Delete</Button>
              </div>
            </div>
            <EndpointEditor
              updateEndpoint={updateEndpoint}
              endpoint={endpointState.body}
              save={savePayload}
              isUpdatingAPIEndpoint={isUpdatingAPIEndpoint}
            />
          </>
        )}
        <Modal isShown={modals.editSectionModal} onClose={toggleEditSectionModal} title='Edit API Section'>
          <Form onSubmit={handleSubmit(updateAPISectionAction)} className="space-y-4">
            <Input
              type="text"
              placeholder='Title'
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="text-red-500 text-sm">{renderErrorMessage(errors.title.message)}</p>}
            <div className="flex space-x-4">
              <Button className='w-full' disabled={isUpdatingAPISection}>
                Edit Section
              </Button>
              <Button className='w-full' onClick={toggleEditSectionModal} variant={'outline'}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal>
        <Modal isShown={modals.addSectionModal} onClose={toggleAddSectionModal} title='Add API Section'>
          <Form onSubmit={handleSubmit(createAPISectionAction)} className="space-y-4">
            <Input
              type="text"
              placeholder='Title'
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="text-red-500 text-sm">{renderErrorMessage(errors.title.message)}</p>}
            <div className="flex space-x-4">
              <Button className='w-full' disabled={isCreatingAPISection}>
                Add Section
              </Button>
              <Button className='w-full' onClick={toggleAddSectionModal} variant={'outline'}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal>
        <Modal isShown={modals.addAPIEndpointModal} onClose={toggleAddAPIEndpointModal} title='Add API Endpoint'>
          <Form onSubmit={handleSubmit(createAPIEndpointAction)} className="space-y-4">
            <Input
              type="text"
              placeholder='Title'
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="text-red-500 text-sm">{renderErrorMessage(errors.title.message)}</p>}
            <div className="flex space-x-4">
              <Button className='w-full' disabled={isCreatingAPIEndpoint}>
                Add API Endpoint
              </Button>
              <Button className='w-full' onClick={toggleAddAPIEndpointModal} variant={'outline'}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal>
        <Modal isShown={modals.addAPIDocModal} onClose={toggleAddAPIDocModal} title='Add API Doc'>
          <Form onSubmit={handleSubmit(createAPIEndpointAction)} className="space-y-4">
            <Input
              type="text"
              placeholder='Title'
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="text-red-500 text-sm">{renderErrorMessage(errors.title.message)}</p>}
            <div className="flex space-x-4">
              <Button className='w-full' disabled={isCreatingAPIEndpoint}>
                Add API Doc
              </Button>
              <Button className='w-full' onClick={toggleAddAPIDocModal} variant={'outline'}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal>
        <Modal isShown={modals.editAPIEndpointModal} onClose={toggleEditAPIEndpointModal} title='Edit API Endpoint'>
          <Form onSubmit={handleSubmit(updateAPIEndpointAction)} className="space-y-4">
            <Input
              type="text"
              placeholder='Title'
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="text-red-500 text-sm">{renderErrorMessage(errors.title.message)}</p>}
            <div className="flex space-x-4">
              <Button className='w-full' disabled={isUpdatingAPIEndpoint}>
                Edit API Endpoint
              </Button>
              <Button className='w-full' onClick={toggleEditAPIEndpointModal} variant={'outline'}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal>
        <Modal isShown={modals.deleteAPIEndpointModal} onClose={toggleDeleteAPIEndpointModal}>
          <div className="flex flex-col items-center w-full">
            <div className="mb-4 p-3 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h1 className="text-center text-2xl font-semibold">Delete Endpoint</h1>
            <p className="my-5 text-center">
              This action cannot be undone. This will permanently delete your API endpoint
              and remove all associated data from our servers.
            </p>
            <div className="flex space-x-3 w-full">
              <Button className="flex-1" variant={'destructive'} disabled={isDeletingAPIEndpoint} onClick={deleteAPIEndpointAction}>
                Delete API Endpoint
              </Button>
              <Button className="flex-1" variant={"outline"} onClick={toggleDeleteAPIEndpointModal}>
                No
              </Button>
            </div>
          </div>
        </Modal>
        <Modal isShown={modals.deleteAPISectionModal} onClose={toggleDeleteAPISectionModal}>
          <div className="flex flex-col items-center w-full">
            <div className="mb-4 p-3 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h1 className="text-center text-2xl font-semibold">Delete Section</h1>
            <p className="my-5 text-center">
              This action cannot be undone. This will permanently delete this section and
              all the API endpoint and remove all associated data from our servers.
            </p>
            <div className="flex space-x-3 w-full">
              <Button className="flex-1"
                variant={'destructive'}
                disabled={isDeletingAPISection}
                onClick={deleteAPISectionAction}
              >
                Delete API Section
              </Button>
              <Button className="flex-1" variant={"outline"} onClick={toggleDeleteAPISectionModal}>
                No
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </ApiDocSidebar>
  )
}
