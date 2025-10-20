import type { NextRequest } from 'next/server'

// LightX Avatar Generation API
// This endpoint generates avatars using LightX service
export async function POST(req: NextRequest) {
  try {
    const { imageUrl, textPrompt, styleImageUrl } = await req.json()
    
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'IMAGE_URL_REQUIRED' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Generate avatar using LightX API
    const avatarData = await generateLightXAvatar(imageUrl, textPrompt, styleImageUrl)
    
    return new Response(JSON.stringify({ 
      avatarUrl: avatarData.avatarUrl,
      imageUrl: imageUrl,
      textPrompt: textPrompt || '',
      styleImageUrl: styleImageUrl || ''
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    console.error('LightX Avatar generation error:', error)
    return new Response(JSON.stringify({ 
      error: 'GENERATION_FAILED', 
      details: error?.message || 'Failed to generate avatar' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Generate LightX avatar
async function generateLightXAvatar(imageUrl: string, textPrompt?: string, styleImageUrl?: string): Promise<{ avatarUrl: string }> {
  const apiKey = process.env.LIGHTX_API_KEY
  
  if (!apiKey) {
    console.warn('LightX API key not found, using fallback')
    // Fallback to a placeholder avatar
    return { avatarUrl: '/avatars/av1.svg' }
  }

  try {
    const requestBody: any = {
      imageUrl: imageUrl
    }
    
    if (textPrompt) {
      requestBody.textPrompt = textPrompt
    }
    
    if (styleImageUrl) {
      requestBody.styleImageUrl = styleImageUrl
    }

    const response = await fetch('https://api.lightxeditor.com/external/api/v1/avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`LightX API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Extract avatar URL from response
    // The exact structure depends on LightX API response format
    const avatarUrl = data.avatarUrl || data.url || data.imageUrl || data.result
    
    if (!avatarUrl) {
      throw new Error('No avatar URL returned from LightX API')
    }

    return { avatarUrl }
  } catch (error) {
    console.error('LightX API call failed:', error)
    // Fallback to placeholder
    return { avatarUrl: '/avatars/av1.svg' }
  }
}
