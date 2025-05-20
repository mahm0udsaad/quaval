"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, RefreshCcw, Upload, X } from "lucide-react"
import Image from "next/image"
import { type Banner, getBanners, createBanner, updateBanner, deleteBanner, uploadImage } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    setIsLoading(true)
    try {
      const data = await getBanners()
      setBanners(data)
    } catch (error) {
      console.error("Error fetching banners:", error)
      toast({
        title: "Error",
        description: "Failed to load banners. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      try {
        const success = await deleteBanner(id)
        if (success) {
          setBanners(banners.filter((banner) => banner.id !== id))
          toast({
            title: "Success",
            description: "Banner deleted successfully",
          })
        }
      } catch (error) {
        console.error("Error deleting banner:", error)
        toast({
          title: "Error",
          description: "Failed to delete banner. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleSaveBanner = async (banner: Partial<Banner>) => {
    try {
      if (editingBanner) {
        // Update existing banner
        const updatedBanner = await updateBanner(editingBanner.id, banner)
        if (updatedBanner) {
          setBanners(banners.map((b) => (b.id === updatedBanner.id ? updatedBanner : b)))
          setIsModalOpen(false)
          toast({
            title: "Success",
            description: "Banner updated successfully",
          })
        }
      } else {
        // Create new banner
        const newBanner = await createBanner(banner as Omit<Banner, "id">)
        if (newBanner) {
          setBanners([...banners, newBanner])
          setIsModalOpen(false)
          toast({
            title: "Success",
            description: "Banner created successfully",
          })
        }
      }
    } catch (error) {
      console.error("Error saving banner:", error)
      toast({
        title: "Error",
        description: "Failed to save banner. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Banners Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchBanners} disabled={isLoading}>
            <RefreshCcw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={() => {
              setEditingBanner(null)
              setIsModalOpen(true)
            }}
            disabled={isLoading}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Banner
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <Skeleton className="h-32 w-48" />
                <div className="ml-4 space-y-2 flex-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start space-x-4">
                <div className="relative h-32 w-48">
                  <Image
                    src={banner.image || "/placeholder.svg"}
                    alt={banner.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{banner.title}</h3>
                  <p className="text-gray-600 mt-1">{banner.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    Button: {banner.button_text} → {banner.button_link}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingBanner(banner)
                      setIsModalOpen(true)
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(banner.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <BannerModal banner={editingBanner} onClose={() => setIsModalOpen(false)} onSave={handleSaveBanner} />
      )}
    </div>
  )
}

function BannerModal({
  banner,
  onClose,
  onSave,
}: {
  banner: Banner | null
  onClose: () => void
  onSave: (banner: Partial<Banner>) => void
}) {
  const [formData, setFormData] = useState<Partial<Banner>>(
    banner || {
      title: "",
      description: "",
      button_text: "",
      button_link: "",
      image: "",
    },
  )
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleImageUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const url = await uploadImage(file, "banners")
      if (url) {
        setFormData({ ...formData, image: url })
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">{banner ? "Edit Banner" : "Add New Banner"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Button Text</label>
            <input
              type="text"
              value={formData.button_text || ""}
              onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Button Link</label>
            <input
              type="text"
              value={formData.button_link || ""}
              onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <div className="mt-1 flex items-center space-x-2">
              {formData.image && (
                <div className="relative w-16 h-16 border rounded">
                  <Image src={formData.image || "/placeholder.svg"} alt="Banner image" fill className="object-cover" />
                </div>
              )}
              <input
                type="url"
                value={formData.image || ""}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
              <label className="cursor-pointer bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300">
                <Upload className="h-5 w-5" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageUpload(e.target.files[0])
                    }
                  }}
                  disabled={isUploading}
                />
              </label>
              {formData.image && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => setFormData({ ...formData, image: "" })}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {isUploading && <p className="text-sm text-blue-500 mt-1">Uploading image...</p>}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
