import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Upload } from 'lucide-react'
import { importOpenApiSpec } from '@/endpoints/api-projects'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'

interface ImportOpenApiButtonProps {
  projectSlug: string
}

interface ImportOpenApiParams {
  projectSlug: string
  file: File
}

export function ImportOpenApiButton({ projectSlug }: ImportOpenApiButtonProps) {
  const [isShown, setIsShown] = useState(false)

  const importMutation = useMutation({
    mutationFn: ({ projectSlug, file }: ImportOpenApiParams) => 
      importOpenApiSpec(projectSlug, file),
    onSuccess: () => {
      toast.success('OpenAPI specification imported successfully')
      setIsShown(false)
    },
    onError: () => {
      toast.error('Failed to import OpenAPI specification')
    }
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!['json', 'yml', 'yaml'].includes(extension || '')) {
      toast.error('Please upload a JSON or YAML file')
      return
    }

    importMutation.mutate({
      projectSlug,
      file
    })
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsShown(true)}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Import OpenAPI
      </Button>

      <Modal
        isShown={isShown}
        onClose={() => setIsShown(false)}
        title="Import OpenAPI Specification"
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Input
              id="file"
              type="file"
              accept=".json,.yml,.yaml"
              onChange={handleFileUpload}
              disabled={importMutation.isPending}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">
              Supported formats: JSON, YAML
            </p>
            <p className="text-sm text-muted-foreground">
              Note: Each endpoint in the specification must have tags to determine its section
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}