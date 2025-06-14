"use client"

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>

        {/* Inner ring */}
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin animate-reverse"></div>

        {/* Center dot */}
        <div className="absolute top-6 left-6 w-4 h-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-pulse"></div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-white font-semibold">Generating Image...</p>
        <p className="text-white/60 text-sm">Creating your masterpiece</p>
      </div>
    </div>
  )
}
