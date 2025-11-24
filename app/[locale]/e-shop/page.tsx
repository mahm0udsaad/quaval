"use client"

import Image from "next/image"

export default function EShopPage() {
  return (
    <div className="bg-background">
      <div className="relative h-[300px] overflow-hidden">
        <Image src="https://quaval.ca/images/home/slider/01.jpg" alt="E-Shop" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-4">E-Shop</h1>
            <p className="text-xl text-gray-200">Shop our catalog of bearings and accessories.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <p className="text-gray-700">Coming soon.</p>
      </div>
    </div>
  )
}



