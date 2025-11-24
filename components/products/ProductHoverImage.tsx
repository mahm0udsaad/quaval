"use client"

import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"

export type ProductFamilyWithImage = {
  name: string
  image?: string
}

interface ProductHoverImageProps {
  brandName: string
  family?: ProductFamilyWithImage
}

export default function ProductHoverImage({ brandName, family }: ProductHoverImageProps) {
  const hasImage = !!family?.image
  const alt = family ? `${brandName} - ${family.name}` : brandName

  return (
    <div className="h-full w-full bg-gray-50 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={family?.name ?? brandName}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="relative w-full aspect-video overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          {hasImage ? (
            <Image
              src={family!.image!}
              alt={alt}
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 320px, 60vw"
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <p className="text-sm font-semibold text-gray-800">{brandName}</p>
              {family && (
                <p className="mt-1 text-xs text-gray-500 leading-snug">{family.name}</p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}


