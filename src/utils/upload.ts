// Upload Utilities

export interface UploadOptions {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  allowedExtensions?: string[]
}

export interface ParsedCSV {
  headers: string[]
  rows: string[][]
}

export interface ParsedJSON {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  isArray: boolean
}

/**
 * Validate file before upload
 */
export const validateFile = (
  file: File,
  options: UploadOptions = {}
): { valid: boolean; error?: string } => {
  const { maxSize, allowedTypes, allowedExtensions } = options

  // Check file size
  if (maxSize && file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${formatBytes(maxSize)}`,
    }
  }

  // Check MIME type
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    }
  }

  // Check file extension
  if (allowedExtensions) {
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `File extension .${extension} is not allowed`,
      }
    }
  }

  return { valid: true }
}

/**
 * Read file as text
 */
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = (e) => reject(e)
    reader.readAsText(file)
  })
}

/**
 * Read file as data URL
 */
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = (e) => reject(e)
    reader.readAsDataURL(file)
  })
}

/**
 * Read file as array buffer
 */
export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as ArrayBuffer)
    reader.onerror = (e) => reject(e)
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Parse CSV file
 */
export const parseCSV = async (file: File): Promise<ParsedCSV> => {
  const text = await readFileAsText(file)
  const lines = text.split('\n').filter((line) => line.trim())

  if (lines.length === 0) {
    throw new Error('CSV file is empty')
  }

  // Parse CSV (simple implementation, doesn't handle quoted commas)
  const rows = lines.map((line) => line.split(',').map((cell) => cell.trim().replace(/^"|"$/g, '')))

  const headers = rows[0] || []
  const dataRows = rows.slice(1)

  return {
    headers,
    rows: dataRows,
  }
}

/**
 * Parse JSON file
 */
export const parseJSON = async (file: File): Promise<ParsedJSON> => {
  const text = await readFileAsText(file)

  try {
    const data = JSON.parse(text)
    return {
      data,
      isArray: Array.isArray(data),
    }
  } catch (error) {
    throw new Error('Invalid JSON format')
  }
}

/**
 * Convert CSV to array of objects
 */
export const csvToObjects = (csv: ParsedCSV): Record<string, string>[] => {
  return csv.rows.map((row) => {
    const obj: Record<string, string> = {}
    csv.headers.forEach((header, index) => {
      obj[header] = row[index] || ''
    })
    return obj
  })
}

/**
 * Validate CSV structure
 */
export const validateCSVStructure = (
  csv: ParsedCSV,
  requiredHeaders: string[]
): { valid: boolean; error?: string; missingHeaders?: string[] } => {
  const missingHeaders = requiredHeaders.filter((header) => !csv.headers.includes(header))

  if (missingHeaders.length > 0) {
    return {
      valid: false,
      error: `Missing required headers: ${missingHeaders.join(', ')}`,
      missingHeaders,
    }
  }

  return { valid: true }
}

/**
 * Validate image file
 */
export const validateImage = async (
  file: File,
  options: {
    maxWidth?: number
    maxHeight?: number
    minWidth?: number
    minHeight?: number
  } = {}
): Promise<{ valid: boolean; error?: string; dimensions?: { width: number; height: number } }> => {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      const { width, height } = img
      const { maxWidth, maxHeight, minWidth, minHeight } = options

      if (maxWidth && width > maxWidth) {
        resolve({
          valid: false,
          error: `Image width exceeds ${maxWidth}px`,
          dimensions: { width, height },
        })
        return
      }

      if (maxHeight && height > maxHeight) {
        resolve({
          valid: false,
          error: `Image height exceeds ${maxHeight}px`,
          dimensions: { width, height },
        })
        return
      }

      if (minWidth && width < minWidth) {
        resolve({
          valid: false,
          error: `Image width is less than ${minWidth}px`,
          dimensions: { width, height },
        })
        return
      }

      if (minHeight && height < minHeight) {
        resolve({
          valid: false,
          error: `Image height is less than ${minHeight}px`,
          dimensions: { width, height },
        })
        return
      }

      resolve({ valid: true, dimensions: { width, height } })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({ valid: false, error: 'Failed to load image' })
    }

    img.src = url
  })
}

/**
 * Compress image file
 */
export const compressImage = async (
  file: File,
  options: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
  } = {}
): Promise<Blob> => {
  const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img

      // Calculate new dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = width * ratio
        height = height * ratio
      }

      // Create canvas and draw image
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to compress image'))
          }
        },
        file.type,
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

/**
 * Format bytes to human readable
 */
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Create file from data URL
 */
export const dataURLtoFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',')
  const mimeMatch = arr[0]?.match(/:(.*?);/)
  const mime = mimeMatch?.[1] || 'application/octet-stream'
  const bstr = atob(arr[1] || '')
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}
