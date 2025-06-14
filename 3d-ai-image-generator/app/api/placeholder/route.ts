import { NextRequest, NextResponse } from "next/server"

export const runtime = 'edge' // Use edge runtime for faster response

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const width = searchParams.get('width') || '512'
  const height = searchParams.get('height') || '512'
  const text = searchParams.get('text') || 'AI Generated'
  const bgColor = searchParams.get('bg') || '6366f1'
  const textColor = searchParams.get('color') || 'ffffff'

  // Sanitize inputs
  const safeWidth = Math.min(Math.max(parseInt(width), 100), 2048)
  const safeHeight = Math.min(Math.max(parseInt(height), 100), 2048)
  const safeText = text.slice(0, 50).replace(/[<>&"']/g, '')
  const safeBgColor = bgColor.replace(/[^a-fA-F0-9]/g, '').slice(0, 6)
  const safeTextColor = textColor.replace(/[^a-fA-F0-9]/g, '').slice(0, 6)

  // Calculate font size based on image size
  const fontSize = Math.min(safeWidth, safeHeight) / 10

  const svg = `
    <svg width="${safeWidth}" height="${safeHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#${safeBgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#${safeBgColor}88;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}" 
            fill="#${safeTextColor}" text-anchor="middle" dominant-baseline="middle">
        ${safeText}
      </text>
      <text x="50%" y="${safeHeight - 30}" font-family="Arial, sans-serif" font-size="14" 
            fill="#${safeTextColor}88" text-anchor="middle" dominant-baseline="middle">
        AI Generated Image
      </text>
    </svg>
  `.trim()

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
