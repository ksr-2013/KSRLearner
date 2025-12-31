'use client'

import { supabaseClient } from './supabaseClient'

/**
 * Upload a Windows OS image to Supabase Storage
 * @param file - File object to upload
 * @param bucketName - Storage bucket name (default: 'os-images')
 * @returns Public URL of the uploaded file
 */
export async function uploadOSImage(
  file: File,
  bucketName: string = 'os-images'
): Promise<string> {
  try {
    // Create bucket if it doesn't exist (requires admin privileges)
    // For now, create it manually in Supabase Dashboard
    
    const fileName = `windows-${Date.now()}.img`
    const filePath = `${fileName}`

    // Upload file
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw new Error(`Upload failed: ${error.message}`)
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from(bucketName)
      .getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL')
    }

    return urlData.publicUrl
  } catch (error: any) {
    console.error('Error uploading OS image:', error)
    throw error
  }
}

/**
 * Get public URL for an OS image from Supabase Storage
 * @param fileName - Name of the file in storage
 * @param bucketName - Storage bucket name (default: 'os-images')
 * @returns Public URL or null if not found
 */
export async function getOSImageUrl(
  fileName: string = 'windows.img',
  bucketName: string = 'os-images'
): Promise<string | null> {
  try {
    const { data } = supabaseClient.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    return data?.publicUrl || null
  } catch (error) {
    console.error('Error getting OS image URL:', error)
    return null
  }
}

/**
 * List all OS images in storage
 * @param bucketName - Storage bucket name (default: 'os-images')
 * @returns Array of file names
 */
export async function listOSImages(
  bucketName: string = 'os-images'
): Promise<string[]> {
  try {
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .list()

    if (error) {
      throw new Error(`Failed to list files: ${error.message}`)
    }

    return data?.map(file => file.name) || []
  } catch (error) {
    console.error('Error listing OS images:', error)
    return []
  }
}

