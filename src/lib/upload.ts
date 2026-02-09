import { writeFile } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

// Ensure upload directory exists
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true })
}

export interface UploadResult {
  success: boolean
  filePath?: string
  fileUrl?: string
  error?: string
}

export async function uploadFile(
  file: File,
  allowedTypes: string[] = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
  maxSizeMB: number = 10
): Promise<UploadResult> {
  try {
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      }
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return {
        success: false,
        error: `File too large. Maximum size: ${maxSizeMB}MB`,
      }
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || ''
    const fileName = `${uuidv4()}.${fileExtension}`
    const filePath = join(UPLOAD_DIR, fileName)

    // Write file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return relative path for database storage
    const relativePath = `/uploads/${fileName}`

    return {
      success: true,
      filePath: relativePath,
      fileUrl: relativePath,
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: 'Failed to upload file',
    }
  }
}

export function validateFileType(
  file: File,
  allowedTypes: string[]
): boolean {
  return allowedTypes.includes(file.type)
}

export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}
