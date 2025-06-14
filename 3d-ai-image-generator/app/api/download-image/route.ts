import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 10 // Set max duration to 10 seconds

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      )
    }

    // Validate URL
    try {
      new URL(imageUrl)
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid image URL" },
        { status: 400 }
      )
    }

    // Fetch the image
    const imageResponse = await fetch(imageUrl, {
      headers: {
        // Use a common user agent to avoid being blocked
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${imageResponse.status}` },
        { status: 502 }
      )
    }

    // Get the image data
    const imageData = await imageResponse.arrayBuffer()
    
    // Determine content type
    let contentType = imageResponse.headers.get("content-type") || "image/jpeg"
    
    // Ensure it's an image
    if (!contentType.startsWith("image/")) {
      contentType = "image/jpeg" // Default to JPEG if not specified
    }

    // Return the image data
    return new NextResponse(imageData, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch (error) {
    console.error("Error downloading image:", error)
    return NextResponse.json(
      { error: "Failed to download image" },
      { status: 500 }
    )
  }
}