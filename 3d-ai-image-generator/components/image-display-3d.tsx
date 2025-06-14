import { useState, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import Image from "next/image"
import { easing } from "maath"

interface ImageDisplay3DProps {
  url: string
  prompt: string
  position: [number, number, number]
  index: number
}

export default function ImageDisplay3D({ url, prompt, position, index }: ImageDisplay3DProps) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)

  // Handle hover animations
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Scale up slightly when hovered
      easing.damp3(
        meshRef.current.scale,
        hovered ? [1.15, 1.15, 1.15] : [1, 1, 1],
        hovered ? 0.3 : 0.2,
        delta
      )

      // Add a subtle rotation animation
      if (!clicked) {
        meshRef.current.rotation.y += delta * 0.15
      }
    }
  })

  // Handle image download with proxy if needed
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (downloading) return
    setDownloading(true)
    
    try {
      // Create a safe filename from the prompt
      const safeFilename = `ai-image-${prompt.substring(0, 20).replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.png`
      
      // Handle different URL types
      if (url.startsWith('data:')) {
        // Direct download for data URLs
        const link = document.createElement('a')
        link.href = url
        link.download = safeFilename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else if (url.startsWith('/placeholder.svg')) {
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
          ctx.fillText(prompt.substring(0, 30), canvas.width/2, canvas.height/2)
          
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
          body: JSON.stringify({ imageUrl: url }),
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
      
      // Fallback method - open in new tab
      try {
        window.open(url, '_blank')
      } catch (e) {
        console.error("Fallback download failed:", e)
        alert("Could not download image. Please try right-clicking and using 'Save Image As'.")
      }
    } finally {
      setDownloading(false)
    }
  }

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked(!clicked)}
        scale={[1, 1, 1]}
        position={[0, 0, 0]}
      >
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial color="#fff" transparent opacity={0.6} />
        <Html
          transform
          distanceFactor={1.17}
          position={[0, 0, 0.1]}
          style={{
            width: "280px",
            height: "280px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "transparent",
          }}
        >
          <div className="relative w-full h-full overflow-hidden rounded-xl border-2 border-white/30 shadow-lg">
            <Image
              src={url}
              alt={prompt}
              fill
              style={{ objectFit: "cover" }}
              sizes="280px"
              priority={index < 3}
              className="transition-transform duration-200 ease-out"
            />
          </div>
        </Html>
      </mesh>

      {clicked && (
        <Html
          position={[0, 0, 1]}
          style={{
            width: "500px",
            height: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none",
          }}
          transform
          distanceFactor={1.17}
        >
          <div
            className="bg-black/90 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-2xl w-full"
            style={{ pointerEvents: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[300px] mb-6 overflow-hidden rounded-xl border border-white/30">
              <Image
                src={url}
                alt={prompt}
                fill
                style={{ objectFit: "contain" }}
                sizes="500px"
                priority
                className="transition-transform duration-200 ease-out"
              />
            </div>
            <h3 className="text-white font-bold text-xl mb-3">Generated Image</h3>
            <p className="text-white/90 text-base mb-6 leading-relaxed">{prompt}</p>
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setClicked(false)
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl text-base font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className={`${
                  downloading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
                } text-white px-6 py-3 rounded-xl text-base font-medium transition-colors`}
              >
                {downloading ? "Downloading..." : "Download"}
              </button>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}


