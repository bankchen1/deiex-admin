// Download Utilities

/**
 * Download data as a file
 */
export const downloadFile = (data: Blob | string, filename: string, mimeType?: string): void => {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType || 'text/plain' })

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Download JSON data as a file
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const downloadJSON = (data: any, filename: string): void => {
  const jsonString = JSON.stringify(data, null, 2)
  downloadFile(jsonString, filename, 'application/json')
}

/**
 * Download CSV data as a file
 */
export const downloadCSV = (data: string[][], filename: string): void => {
  const csvContent = data.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
  downloadFile(csvContent, filename, 'text/csv')
}

/**
 * Convert array of objects to CSV format
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const arrayToCSV = (data: any[], columns?: string[]): string[][] => {
  if (data.length === 0) return []

  // Use provided columns or extract from first object
  const headers = columns || Object.keys(data[0])

  // Create CSV rows
  const rows = data.map((item) => headers.map((header) => String(item[header] ?? '')))

  // Add headers as first row
  return [headers, ...rows]
}

/**
 * Export table data to CSV
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const exportTableToCSV = (data: any[], columns: string[], filename: string): void => {
  const csvData = arrayToCSV(data, columns)
  downloadCSV(csvData, filename)
}

/**
 * Export table data to JSON
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const exportTableToJSON = (data: any[], filename: string): void => {
  downloadJSON(data, filename)
}

/**
 * Download text file
 */
export const downloadText = (text: string, filename: string): void => {
  downloadFile(text, filename, 'text/plain')
}

/**
 * Download from URL
 */
export const downloadFromUrl = async (url: string, filename: string): Promise<void> => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    downloadFile(blob, filename)
  } catch (error) {
    console.error('Download failed:', error)
    throw new Error('Failed to download file')
  }
}

/**
 * Generate filename with timestamp
 */
export const generateFilename = (prefix: string, extension: string): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  return `${prefix}_${timestamp}.${extension}`
}
