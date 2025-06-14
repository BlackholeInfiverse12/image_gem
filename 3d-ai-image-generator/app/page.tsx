"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Suspense, useState, useRef } from "react"
import ImageGenerator from "@/components/image-generator"
import ImageDisplay3D from "@/components/image-display-3d"
import LoadingSpinner from "@/components/loading-spinner"

export default function Home() {
  const [generatedImages, setGeneratedImages] = useState<
    Array<{
      id: string
      url: string
      prompt: string
      position: [number, number, number]
    }>
  >([])

  const [isGenerating, setIsGenerating] = useState(false)
  const [userInteracting, setUserInteracting] = useState(false)
  const controlsRef = useRef<any>(null)

  const handleImageGenerated = (imageUrl: string, prompt: string) => {
    const newImage = {
      id: Date.now().toString(),
      url: imageUrl,
      prompt,
      // Position images far to the right and spread them out more
      position: [
        8 + (generatedImages.length % 2) * 4, // X: Much further right, wider spacing
        2 - Math.floor(generatedImages.length / 2) * 4, // Y: Larger vertical spacing
        -2 + (generatedImages.length % 3) * 2, // Z: Some depth variation
      ] as [number, number, number],
    }
    setGeneratedImages((prev) => [...prev, newImage])
  }

  const handleControlStart = () => {
    setUserInteracting(true)
  }

  const handleControlEnd = () => {
    // Keep interacting state for a bit longer to prevent immediate auto-rotation
    setTimeout(() => setUserInteracting(false), 2000)
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Canvas camera={{ position: [0, 0, 12], fov: 70 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />

          {/* Environment for realistic lighting */}
          <Environment preset="city" />

          {/* 3D Image Displays - Much larger and further away */}
          {generatedImages.map((image) => (
            <ImageDisplay3D key={image.id} imageUrl={image.url} position={image.position} prompt={image.prompt} />
          ))}

          {/* Floating Title */}
          <Html position={[0, 4, 0]} center distanceFactor={10} transform occlude>
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h1 className="text-4xl font-bold text-white mb-2 text-center">3D AI Image Studio</h1>
              <p className="text-white/80 text-center mb-2">Generate stunning images with AI in 3D space</p>
              <p className="text-green-400 text-sm text-center">🌸 Powered by Free AI Services</p>
            </div>
          </Html>

          {/* Image Generator Interface - Fixed position on the left */}
          <Html position={[-6, 0, 0]} center distanceFactor={8} transform occlude>
            <ImageGenerator
              onImageGenerated={handleImageGenerated}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          </Html>

          {/* Loading Indicator */}
          {isGenerating && (
            <Html position={[0, 0, 2]} center distanceFactor={6} transform>
              <LoadingSpinner />
            </Html>
          )}

          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={25}
            autoRotate={!isGenerating && !userInteracting}
            autoRotateSpeed={0.3}
            onStart={handleControlStart}
            onEnd={handleControlEnd}
            target={[2, 0, 0]} // Focus point between prompt and images
          />
        </Suspense>
      </Canvas>

      {/* Instructions Overlay */}
    

      {/* Image Counter */}
      <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md rounded-lg p-4 text-white">
        <div className="text-center">
          <div className="text-3xl font-bold">{generatedImages.length}</div>
          <div className="text-sm text-white/80">Images Generated</div>
          <div className="text-xs text-green-400 mt-1">Free Service</div>
          {userInteracting && <div className="text-xs text-blue-400 mt-1">User Control Active</div>}
        </div>
      </div>

     
      {isGenerating && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-md rounded-lg p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            <span className="text-lg font-medium">Generating your AI masterpiece...</span>
          </div>
        </div>
      )}
      
    </div>
    
  )
}
