import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-black text-white">
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6 text-gold">About Quaval</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Placeholder for the new About Us content (from pages 9-14 of the profile).
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gold">Our History (1995-2025)</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gold-dark"></div>
            <div className="space-y-12">
              {
                [
                  { year: "1995", title: "Company Founded", description: "Placeholder for 1995 events." },
                  { year: "2005", title: "Major Milestone", description: "Placeholder for 2005 events." },
                  { year: "2015", title: "Expansion", description: "Placeholder for 2015 events." },
                  { year: "2025", title: "Future Goals", description: "Placeholder for 2025 events." },
                ].map((item, index) => (
                  <div key={index} className={`flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                    <div className="w-1/2 px-8">
                      <div className={`bg-gray-800 p-6 rounded-lg shadow-lg ${index % 2 === 0 ? "ml-auto" : "mr-auto"} max-w-md`}>
                        <div className="text-gold font-bold text-xl mb-2">{item.year}</div>
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-300">{item.description}</p>
                      </div>
                    </div>
                    <div className="w-1/2"></div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gold">Our Brands</h2>
          <div className="flex justify-center items-center space-x-8">
            <Image src="/images/NTN-SNR.jpg" alt="NTN-SNR" width={150} height={50} />
            <Image src="/images/STC-STEYR..png" alt="STC-STEYR" width={150} height={50} />
            <Image src="/images/marka_md_14155432362670.jpg" alt="Brand Logo" width={150} height={50} />
            <Image src="/images/Logo-transparent.png" alt="Quaval Logo" width={150} height={50} />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image
                  src="/images/about-us-02.jpg"
                  alt="About Us Image"
                  fill
                  className="object-cover"
                />
            </div>
            <div>
                <h2 className="text-3xl font-bold mb-6 text-gold">More About Us</h2>
                <p className="text-gray-300">
                    Placeholder for additional content about the company.
                </p>
            </div>
        </div>
      </section>
    </div>
  );
}