"use client"

export default function BlogPage() {
  return (
    <div className="bg-background">
      <div className="bg-secondary text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-gray-200 max-w-2xl">News, guides, and updates from Quaval.</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="text-gray-700">No posts yet. Check back soon.</div>
      </div>
    </div>
  )
}



