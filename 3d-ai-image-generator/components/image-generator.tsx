import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ImageGeneratorProps {
  onImageGenerated: (imageUrl: string, prompt: string) => void
  onGeneratingChange?: (isGenerating: boolean) => void
}

export default function ImageGenerator({ onImageGenerated, onGeneratingChange }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const [lastGeneratedImage, setLastGeneratedImage] = useState<string | null>(null)
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  // Sample prompts for inspiration
  const samplePrompts = [
    "A futuristic city with flying cars and neon lights",
    "A serene mountain landscape at sunset",
    "A magical forest with glowing mushrooms and fairies",
    "An underwater scene with colorful coral reefs and fish",
    "A cyberpunk character with robotic augmentations",
    "A cozy cabin in the woods during winter",
    "A steampunk airship flying through clouds",
    "A fantasy castle on a floating island",
  ]

  const useSamplePrompt = () => {
    const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)]
    setPrompt(randomPrompt)
  }

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    setIsGenerating(true)
    onGeneratingChange?.(true)
    setError("")

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image")
      }

      // Show service information
      const serviceMessages = {
        "pollinations-v2": "✨ Generated with Pollinations AI",
        "replicate-demo": "🎨 Generated with Demo Service",
        "lorem-picsum": "📸 Generated with Picsum Photos",
        "placeholder-ai": "🎭 Generated with AI Placeholder",
        fallback: "⚠️ Using fallback service",
      }

      setLastGeneratedImage(data.imageUrl)
      setLastGeneratedPrompt(prompt.trim())

      if (data.service && serviceMessages[data.service as keyof typeof serviceMessages]) {
        const message = serviceMessages[data.service as keyof typeof serviceMessages]
        setError(message)
        // Clear the message after 5 seconds
        setTimeout(() => setError(""), 5000)
      }

      onImageGenerated(data.imageUrl, prompt.trim())
      setPrompt("")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(`Failed to generate image: ${errorMessage}`)
      console.error("Image generation error:", err)
    } finally {
      setIsGenerating(false)
      onGeneratingChange?.(false)
    }
  }

  const downloadLastImage = async () => {
    if (!lastGeneratedImage || isDownloading) return
    
    setIsDownloading(true)
    
    try {
      // Create a safe filename from the prompt
      const safeFilename = `ai-image-${(lastGeneratedPrompt || "image").substring(0, 20).replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.png`
      
      // Handle different URL types
      if (lastGeneratedImage.startsWith('data:')) {
        // Direct download for data URLs
        const link = document.createElement('a')
        link.href = lastGeneratedImage
        link.download = safeFilename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else if (lastGeneratedImage.startsWith('/placeholder.svg')) {
        // For placeholder SVGs, create a canvas and download that
        const canvas = document.createElement('canvas')
        canvas.width = 512
        canvas.height = 512
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.fillStyle = '#f0f0f0'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.fillStyle = '#333'
          ctx.font = '20px Arial'
          ctx.textAlign = 'center'
          ctx.fillText(lastGeneratedPrompt || "AI Image", canvas.width/2, canvas.height/2)
          
          const dataUrl = canvas.toDataURL('image/png')
          const link = document.createElement('a')
          link.href = dataUrl
          link.download = safeFilename
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      } else {
        // For external URLs, use a proxy API to avoid CORS issues
        const response = await fetch('/api/download-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl: lastGeneratedImage }),
        })
        
        if (!response.ok) {
          throw new Error('Failed to download image through proxy')
        }
        
        const blob = await response.blob()
        const objectUrl = URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = objectUrl
        link.download = safeFilename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(objectUrl)
      }
    } catch (error) {
      console.error("Error downloading image:", error)
      setError("Failed to download image. Please try again.")
      
      // Fallback method - open in new tab
      try {
        window.open(lastGeneratedImage, '_blank')
      } catch (e) {
        console.error("Fallback download failed:", e)
      }
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-black/50 backdrop-blur-lg rounded-xl border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4">Generate AI Image</h2>
      
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Enter a prompt for your image..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-10 px-3 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={useSamplePrompt}
            className="mt-1 text-sm text-blue-400 hover:text-blue-300"
          >
            Use a random prompt
          </button>
        </div>
        
        <Button
          onClick={generateImage}
          disabled={isGenerating || !prompt.trim()}
          className="w-full h-10 bg-purple-600 hover:bg-purple-700 text-white border-0"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            "Generate Image"
          )}
        </Button>
        
        {lastGeneratedImage && (
          <Button
            onClick={downloadLastImage}
            disabled={isDownloading}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white border-0"
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Downloading...
              </>
            ) : (
              "Download Last Image"
            )}
          </Button>
        )}
        
        {error && (
          <div className="text-sm text-center mt-2">
            {error.includes("Generated with") ? (
              <span className="text-green-400">{error}</span>
            ) : (
              <span className="text-red-400">{error}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

