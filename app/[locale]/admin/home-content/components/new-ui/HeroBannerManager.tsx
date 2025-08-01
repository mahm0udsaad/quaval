"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, Settings, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Banner, getBanners } from '@/lib/api';
import Image from 'next/image';

export function HeroBannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const data = await getBanners();
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Hero Section Management</h4>
            <p className="text-blue-700 text-sm mb-3">
              The hero section uses banner slides. Manage your hero content through the dedicated banners interface.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/admin/banners">
                <Button size="sm" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Manage Banners
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </Link>
              <Link href="/" target="_blank">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview Homepage
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Current Banners Preview */}
      <div>
        <h4 className="font-semibold mb-4">Current Hero Banners ({banners.length})</h4>
        {banners.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">No banners found</p>
            <Link href="/admin/banners">
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Add Your First Banner
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {banners.slice(0, 3).map((banner, index) => (
              <div key={banner.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden">
                    <Image 
                      src={banner.image || '/placeholder.svg'} 
                      alt={banner.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 truncate">{banner.title}</h5>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{banner.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Button: {banner.button_text}</span>
                      <span>→ {banner.button_link}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Slide {index + 1}
                  </div>
                </div>
              </div>
            ))}
            {banners.length > 3 && (
              <div className="text-center py-4">
                <Link href="/admin/banners">
                  <Button variant="outline" size="sm">
                    View All {banners.length} Banners
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}