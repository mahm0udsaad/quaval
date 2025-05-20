import { Loader2 } from "lucide-react"

export default function SearchLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>

      <div className="mb-8 h-10 bg-gray-200 animate-pulse rounded-full max-w-xl"></div>

      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading results...</span>
      </div>
    </div>
  )
}
