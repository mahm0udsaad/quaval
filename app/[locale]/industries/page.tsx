"use client"

import Image from "next/image"

export default function IndustriesPage() {
  return (
    <div className="bg-background">
      <div className="relative h-[300px] overflow-hidden">
        <Image src="https://www.quaval.ca/images/industries/industries-hero.jpg" alt="Industries" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-4">Industries</h1>
            <p className="text-xl text-gray-200">Solutions tailored for key industrial sectors.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Automotive", img: "https://www.quaval.ca/images/industries/automotive.jpg" },
            { title: "Aerospace", img: "https://www.quaval.ca/images/industries/aerospace.jpg" },
            { title: "Textile", img: "https://www.quaval.ca/images/industries/textile.jpg" },
            { title: "Food Processing", img: "https://www.quaval.ca/images/industries/food.jpg" },
            { title: "Mining", img: "https://www.quaval.ca/images/industries/mining.jpg" },
            { title: "Railway", img: "https://www.quaval.ca/images/industries/railway.jpg" },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative h-40">
                <Image src={item.img} alt={item.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}



