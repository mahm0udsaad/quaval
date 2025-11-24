"use client"

export default function TrainingPage() {
  return (
    <div className="bg-background">
      <div className="bg-secondary text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">Training</h1>
          <p className="text-xl text-gray-200 max-w-2xl">Hands-on sessions for installation, lubrication, and predictive maintenance.</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-2">Upcoming Workshops</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Bearing Fundamentals</li>
            <li>Precision Mounting Techniques</li>
            <li>Condition Monitoring Basics</li>
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-2">Request Custom Training</h3>
          <p className="text-gray-700">Contact us to tailor a program for your team and equipment.</p>
        </div>
      </div>
    </div>
  )
}



