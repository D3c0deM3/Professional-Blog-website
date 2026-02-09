'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FileUploadFieldProps {
  label: string
  value?: string
  onChange: (value: string) => void
  accept?: string
}

export default function FileUploadField({
  label,
  value,
  onChange,
  accept = '.pdf,.png,.jpg,.jpeg,.webp',
}: FileUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (file?: File) => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    setIsUploading(true)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onChange(data.fileUrl)
      toast.success('File uploaded successfully.')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-col gap-3">
        <Input
          type="file"
          accept={accept}
          onChange={(event) => handleUpload(event.target.files?.[0])}
          disabled={isUploading}
        />
      </div>
      <Input
        type="text"
        placeholder="/uploads/file.pdf"
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
