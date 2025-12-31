'use client'

import { useState } from 'react'
import { uploadOSImage } from '@/lib/supabaseStorage'

export default function OSImageUploader() {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (Supabase free tier has 50MB limit per file)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      setError(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds Supabase free tier limit of 50MB per file. You may need to upgrade your Supabase plan or contact support to increase the limit.`)
      return
    }

    setUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Simulate progress (actual upload progress would need Supabase SDK update)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 5, 90))
      }, 200)

      const publicUrl = await uploadOSImage(file, 'os-images')
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadedUrl(publicUrl)
      setUploading(false)

      // Copy URL to clipboard
      navigator.clipboard.writeText(publicUrl)
      alert('Upload complete! URL copied to clipboard. Add it to your .env.local file as NEXT_PUBLIC_WINDOWS_IMAGE_URL')
    } catch (err: any) {
      setError(err.message || 'Upload failed')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>Upload Windows OS Image to Supabase Storage</h2>
      
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '8px' }}>
        <strong>⚠️ Important:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Supabase free tier has a <strong>50MB per-file limit</strong></li>
          <li>Your 500MB file exceeds this limit</li>
          <li>You'll need to either:
            <ul>
              <li>Upgrade your Supabase plan, OR</li>
              <li>Contact Supabase support to increase the limit</li>
            </ul>
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
          Select Windows Image File (.img or .iso):
        </label>
        <input
          type="file"
          accept=".img,.iso"
          onChange={handleFileSelect}
          disabled={uploading}
          style={{
            padding: '10px',
            border: '2px dashed #ccc',
            borderRadius: '8px',
            width: '100%',
            cursor: uploading ? 'not-allowed' : 'pointer'
          }}
        />
      </div>

      {uploading && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ flex: 1, height: '20px', background: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${uploadProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #0078d4, #005a9e)',
                  transition: 'width 0.3s'
                }}
              />
            </div>
            <span>{uploadProgress}%</span>
          </div>
          <p style={{ color: '#666', fontSize: '14px' }}>Uploading to Supabase Storage...</p>
        </div>
      )}

      {error && (
        <div style={{
          padding: '15px',
          background: '#ffebee',
          border: '1px solid #f44336',
          borderRadius: '8px',
          color: '#c62828',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {uploadedUrl && (
        <div style={{
          padding: '15px',
          background: '#e8f5e9',
          border: '1px solid #4caf50',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <strong style={{ color: '#2e7d32' }}>✅ Upload Successful!</strong>
          <p style={{ marginTop: '10px', wordBreak: 'break-all' }}>
            <strong>Public URL:</strong><br />
            <code style={{ background: '#fff', padding: '5px', borderRadius: '4px', display: 'block', marginTop: '5px' }}>
              {uploadedUrl}
            </code>
          </p>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            This URL has been copied to your clipboard. Add it to your <code>.env.local</code> file:
          </p>
          <code style={{ background: '#fff', padding: '5px', borderRadius: '4px', display: 'block', marginTop: '5px' }}>
            NEXT_PUBLIC_WINDOWS_IMAGE_URL={uploadedUrl}
          </code>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', background: '#fff3cd', borderRadius: '8px', fontSize: '14px' }}>
        <strong>📝 Next Steps:</strong>
        <ol style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Create an <code>os-images</code> bucket in Supabase Dashboard (Storage section)</li>
          <li>Make sure the bucket is set to <strong>Public</strong></li>
          <li>Upload your file (or use this component)</li>
          <li>Copy the public URL</li>
          <li>Add it to <code>.env.local</code> as <code>NEXT_PUBLIC_WINDOWS_IMAGE_URL</code></li>
          <li>The component will automatically use this URL</li>
        </ol>
      </div>
    </div>
  )
}

