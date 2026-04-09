import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="bg-background">
      <section className="bg-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">About Quaval</h1>
          <p className="text-xl text-gray-200 max-w-3xl">
            Quaval for Industrial Development Inc. is a Canadian corporation based in Quebec, specializing in the
            import, export, and distribution of all types of rolling bearings.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-secondary">Our Company</h2>
              <p className="text-text-light mb-4">
                The company is currently working on manufacturing its own Canadian brand and serves as the exclusive
                distributor of Kinex bearings across Canada.
              </p>
              <div className="grid gap-4">
                <h3 className="text-xl font-semibold text-secondary">Shipping Methods</h3>
                <ul className="list-disc list-inside text-text-light">
                  <li>Express Shipping</li>
                  <li>Cargo Shipping</li>
                  <li>Ocean Shipping</li>
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Image
                src="https://www.quaval.ca/images/about-us/about-us-01.jpg"
                alt="Quaval Operations"
                width={300}
                height={200}
                className="rounded-lg"
              />
              <Image
                src="https://www.quaval.ca/images/about-us/about-us-02.jpg"
                alt="Quaval Facility"
                width={300}
                height={200}
                className="rounded-lg"
              />
              <Image
                src="https://www.quaval.ca/images/about-us/about-us-03.jpg"
                alt="Quaval Products"
                width={300}
                height={200}
                className="rounded-lg"
              />
              <div className="bg-primary rounded-lg p-6 flex items-center justify-center text-white text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">30+</div>
                  <div className="text-sm">Years of Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image
                  src="https://www.quaval.ca/images/about-us/history-kinex.jpg"
                  alt="Kinex History"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6 text-secondary">About Kinex</h2>
                <p className="text-text-light">
                  Kinex is a Slovakian brand that has been manufacturing a wide range of rolling bearings for over a
                  century. The company's history dates back to 1906 with the registration of Považský kovopriemysel.
                  Over time, Kinex has expanded its production to include bearings for various industries, including
                  textile, automotive, and aviation.
                </p>
              </div>
            </div>

            <div className="grid gap-8">
              <h2 className="text-3xl font-bold text-secondary text-center">Our History</h2>
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gray-200"></div>
                <div className="space-y-12">
                  {[
                    {
                      year: "1898",
                      title: "The Beginning",
                      description:
                        "First wood caliper produced in Bytča, marking the beginning of mechanical engineering.",
                    },
                    {
                      year: "1950",
                      title: "First Bearing Production",
                      description: "First bearing produced in Slovakia at the Kysucké Nové Mesto plant.",
                    },
                    {
                      year: "1965",
                      title: "Bytča Plant Launch",
                      description: "Bytča plant begins bearing production with special double-row bearings.",
                    },
                    {
                      year: "2000",
                      title: "KINEX Expansion",
                      description: "KINEX incorporates ZVL Skalica as a production plant.",
                    },
                  ].map((item, index) => (
                    <div key={index} className={`flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                      <div className="w-1/2 px-8">
                        <div
                          className={`bg-white p-6 rounded-lg shadow-lg ${index % 2 === 0 ? "ml-auto" : "mr-auto"} max-w-md`}
                        >
                          <div className="text-primary font-bold text-xl mb-2">{item.year}</div>
                          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                          <p className="text-text-light">{item.description}</p>
                        </div>
                      </div>
                      <div className="w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
