import Link from "next/link";

export default function CatalogsPage() {
  const brands = [
    { name: "NTN", path: "/catalogs/ntn" },
    { name: "SNR", path: "/catalogs/snr" },
    { name: "KSM", path: "/catalogs/ksm" },
    { name: "QUAVAL", path: "/catalogs/quaval" },
    { name: "DKF", path: "/catalogs/dkf" },
    { name: "KINEX", path: "/catalogs/kinex" },
    { name: "TIMKEN", path: "/catalogs/timken" },
    { name: "STC-STEYR", path: "/catalogs/stc-steyr" },
    { name: "JIB", path: "/catalogs/jib" },
  ];

  const certificates = [
    { name: "KSM", path: "/certificates/ksm" },
    { name: "NTN", path: "/certificates/ntn" },
    { name: "QUAVAL", path: "/certificates/quaval" },
    { name: "DKF", path: "/certificates/dkf" },
    { name: "STC-STEYR", path: "/certificates/stc-steyr" },
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-gold">Catalogs & Certificates</h1>
        <p className="text-gray-300 mb-8">
          Note: To protect our intellectual property, these documents are viewable online only. Downloads and screenshots are disabled.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gold">Catalogs</h2>
            <div className="space-y-4">
              {brands.map((brand) => (
                <Link key={brand.name} href={brand.path} className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                    {brand.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gold">Certificates</h2>
            <div className="space-y-4">
              {certificates.map((cert) => (
                <Link key={cert.name} href={cert.path} className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                    {cert.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
