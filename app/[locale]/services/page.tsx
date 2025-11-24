"use client"

import Image from "next/image"

export default function ServicesPage() {
  return (
    <div className="bg-background">
      <div className="relative h-[300px] overflow-hidden">
        <Image src="https://www.quaval.ca/images/services/services-hero.jpg" alt="Services" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-4">Services</h1>
            <p className="text-xl text-gray-200">Engineering support, sourcing, logistics and after-sales.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        {[
          { title: "Technical Consulting", description: "Application analysis and bearing selection." },
          { title: "Sourcing & Procurement", description: "OEM-certified bearings and parts." },
          { title: "Logistics & Delivery", description: "Fast, reliable shipping worldwide." },
        ].map((s) => (
          <div key={s.title} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
            <p className="text-gray-600">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}



