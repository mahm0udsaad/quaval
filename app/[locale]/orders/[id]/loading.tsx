import { Loader2 } from "lucide-react"

export default function OrderDetailsLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </div>
  )
}
