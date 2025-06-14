"use client"
import Image from "next/image"
import Link from "next/link"
import { 
  ArrowLeft, 
  Trash2, 
  ShoppingCart, 
  AlertCircle, 
  Heart, 
  ChevronRight,
  Truck,
  CheckCircle,
  X
} from "lucide-react"
import { CurrencySelector } from "@/app/[locale]/components/currency-selector"
import { useCurrency } from "@/app/[locale]/contexts/CurrencyContext"
import { useCart } from "@/app/[locale]/contexts/CartContext"
import { Button } from "@/components/ui/button"
import { useTranslate } from "@/lib/i18n-client"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// Extend the CartItem interface with additional properties
interface SavedItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  partNumber?: string;
  outOfStock?: boolean;
  estimatedDelivery?: string;
}

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart()
  const { selectedCurrency, convertPrice } = useCurrency()
  const { t } = useTranslate()
  const [removingItemId, setRemovingItemId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null)
  const [recentlyUpdated, setRecentlyUpdated] = useState<string | null>(null)
  const router = useRouter()

  // Calculate total in CAD first, then convert to selected currency
  const totalInCAD = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const convertedTotal = convertPrice(totalInCAD)
  
  // Estimated tax (for demonstration purposes)
  const estimatedTax = convertPrice(totalInCAD * 0.05)
  
  // Free shipping threshold
  const freeShippingThreshold = convertPrice(75)
  const qualifiesForFreeShipping = convertedTotal >= freeShippingThreshold

  // Simulate checkout loading
  const handleCheckout = () => {
    console.log('🛒 [CART] Starting checkout process')
    console.log('🛒 [CART] Current cart items:', cartItems.length, 'items')
    console.log('🛒 [CART] Cart items:', cartItems)
    
    setLoading(true)
    setTimeout(() => {
      console.log('🛒 [CART] Navigating to checkout page')
      router.push("/checkout")
    }, 800)
  }

  // Handle item removal with animation and confirmation
  const handleRemoveItem = (id: string) => {
    if (showRemoveConfirm === id) {
      setRemovingItemId(id)
      setTimeout(() => {
        removeFromCart(id)
        setRemovingItemId(null)
        setShowRemoveConfirm(null)
        toast({
          title: t('cart.itemRemoved'),
          description: t('cart.itemRemovedDescription'),
          action: (
            <Button variant="link" className="text-primary" onClick={() => handleUndoRemove(id)}>
              {t('cart.undo')}
            </Button>
          )
        })
      }, 300)
    } else {
      setShowRemoveConfirm(id)
      // Auto-hide the confirmation after 3 seconds
      setTimeout(() => {
        if (showRemoveConfirm === id) {
          setShowRemoveConfirm(null)
        }
      }, 3000)
    }
  }

  // Save for later functionality
  const handleSaveForLater = (item: SavedItem) => {
    setSavedItems([...savedItems, item])
    removeFromCart(item.id)
    toast({
      title: t('cart.itemSaved'),
      description: t('cart.itemSavedDescription'),
    })
  }

  // Move back to cart from saved items
  const handleMoveToCart = (item: SavedItem) => {
    const itemIndex = savedItems.findIndex(savedItem => savedItem.id === item.id)
    if (itemIndex !== -1) {
      const newSavedItems = [...savedItems]
      newSavedItems.splice(itemIndex, 1)
      setSavedItems(newSavedItems)
      // Add to cart logic would go here
      toast({
        title: t('cart.itemMovedToCart'),
        description: t('cart.itemMovedToCartDescription'),
      })
    }
  }

  // Quantity update with visual feedback
  const handleQuantityUpdate = (id: string, newQuantity: number) => {
    updateQuantity(id, Math.max(1, newQuantity))
    setRecentlyUpdated(id)
    setTimeout(() => setRecentlyUpdated(null), 1000)
  }

  // Hypothetical undo remove functionality
  const handleUndoRemove = (id: string) => {
    // Logic to add item back would go here
    toast({
      title: t('cart.itemRestored'),
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in">
      <div className="flex items-center mb-6">
        <Button variant="ghost" asChild className="mr-2 p-2 h-auto">
          <Link href="/products" aria-label={t('cart.backToProducts')}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-secondary">{t('cart.yourCart')}</h1>
        <Badge variant="outline" className="ml-3 bg-gray-50">
          {cartItems.length} {cartItems.length === 1 ? t('cart.item') : t('cart.items')}
        </Badge>
      </div>

      {cartItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 md:py-20 bg-gray-50 shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping"></div>
              <ShoppingCart size={72} className="text-gray-300 relative" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-3 text-secondary">{t('cart.emptyCartTitle')}</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">{t('cart.emptyCartMessage')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/products" className="inline-flex items-center">
                {t('cart.startShopping')}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/account/orders" className="inline-flex items-center">
                {t('cart.viewPreviousOrders')}
          </Link>
            </Button>
        </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Column */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">{t('cart.cartItems')}</h2>
              </div>
            <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600">{t('cart.currency')}:</span>
              <CurrencySelector />
            </div>
          </div>

            <div className="bg-white shadow-sm overflow-hidden">
              <AnimatePresence>
                {cartItems.map((item, index) => {
                  const convertedPrice = convertPrice(item.price)
                  const isRemoving = removingItemId === item.id
                  const isUpdated = recentlyUpdated === item.id
                  const isInStock = !(item as SavedItem).outOfStock // Assume all items are in stock unless specified
                  
              return (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: isRemoving ? 0 : 1, 
                        height: isRemoving ? 0 : "auto" 
                      }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 md:p-6 ${index < cartItems.length - 1 ? 'border-b' : ''}`}
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Product Image */}
                        <div className="relative h-24 w-24 md:h-28 md:w-28 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        
                        {/* Product Information */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:justify-between w-full">
                            <div className="flex-1 pr-2">
                              <h3 className="text-lg font-medium text-secondary truncate">
                                {item.name}
                              </h3>
                              {item.partNumber && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {t('products.partNumber')}: {item.partNumber}
                                </p>
                              )}
                              
                              {/* Stock Status */}
                              <div className="mt-2 flex items-center">
                                {isInStock ? (
                                  <p className="text-sm flex items-center text-green-600">
                                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                    {t('cart.inStock')}
                                  </p>
                                ) : (
                                  <p className="text-sm flex items-center text-amber-600">
                                    <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                                    {t('cart.lowStock')}
                                  </p>
                                )}
                                
                                {(item as SavedItem).estimatedDelivery && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="ml-4 flex items-center text-sm text-gray-500">
                                          <Truck className="h-3.5 w-3.5 mr-1.5" />
                                          {t('cart.fastDelivery')}
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{(item as SavedItem).estimatedDelivery}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                              
                              {/* Mobile Price */}
                              <div className="md:hidden mt-3 flex flex-wrap justify-between items-center gap-2">
                                <p className="font-medium text-lg">
                                  {selectedCurrency.symbol} {convertedPrice.toFixed(2)}
                                </p>
                                <div className="flex items-center gap-3">
                                  <motion.div 
                                    animate={isUpdated ? { scale: [1, 1.1, 1] } : {}}
                                    className="font-medium text-primary"
                                  >
                                    {selectedCurrency.symbol} {(convertedPrice * item.quantity).toFixed(2)}
                                  </motion.div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Desktop Price & Quantity */}
                            <div className="hidden md:flex items-start justify-end gap-12 mt-1">
                              <div className="text-center">
                                <p className="text-sm text-gray-500 mb-1">{t('cart.price')}</p>
                                <p className="font-medium">
                      {selectedCurrency.symbol} {convertedPrice.toFixed(2)}
                    </p>
                  </div>
                              
                              <div className="text-center">
                                <p className="text-sm text-gray-500 mb-1">{t('cart.total')}</p>
                                <motion.div 
                                  animate={isUpdated ? { scale: [1, 1.1, 1] } : {}}
                                  className="font-medium text-primary"
                                >
                                  {selectedCurrency.symbol} {(convertedPrice * item.quantity).toFixed(2)}
                                </motion.div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Actions Row */}
                          <div className="flex flex-wrap items-center justify-between mt-4 gap-3">
                            {/* Quantity Selector */}
                  <div className="flex items-center">
                              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className={`flex items-center justify-center w-9 h-9 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition ${
                                    item.quantity <= 1 ? "text-gray-300" : "text-gray-600 hover:bg-gray-50"
                                  }`}
                                  aria-label={t('cart.decreaseQuantity')}
                                >
                                  <span className="text-lg font-medium">−</span>
                                </motion.button>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityUpdate(item.id, parseInt(e.target.value) || 1)}
                                  className="w-10 h-9 text-center border-x border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary"
                                  min="1"
                                />
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                                  className="flex items-center justify-center w-9 h-9 text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition"
                                  aria-label={t('cart.increaseQuantity')}
                                >
                                  <span className="text-lg font-medium">+</span>
                                </motion.button>
                              </div>
                            </div>
                            
                            {/* Item Actions */}
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-9 px-3 text-gray-500 hover:text-primary hover:bg-primary/5"
                                onClick={() => handleSaveForLater(item as SavedItem)}
                              >
                                <Heart className="h-4 w-4 mr-1.5" />
                                <span className="text-sm">{t('cart.saveForLater')}</span>
                              </Button>
                              
                              {showRemoveConfirm === item.id ? (
                                <div className="flex items-center border border-red-200 rounded-lg animate-pulse">
                                  <Button 
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 text-red-600 hover:bg-red-50 gap-1.5"
                                    onClick={() => handleRemoveItem(item.id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    {t('cart.confirmRemove')}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 text-gray-500"
                                    onClick={() => setShowRemoveConfirm(null)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-9 px-3 text-gray-500 hover:text-red-500 hover:bg-red-50"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1.5" />
                                  <span className="text-sm">{t('cart.remove')}</span>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
            
            {/* Saved Items Section */}
            {savedItems.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">{t('cart.savedForLater')}</h2>
                <div className="bg-white shadow-sm overflow-hidden">
                  {savedItems.map((item, index) => (
                    <div key={item.id} className={`p-4 md:p-6 ${index < savedItems.length - 1 ? 'border-b' : ''}`}>
                      <div className="flex gap-4">
                        <div className="relative h-16 w-16 bg-gray-50 rounded-lg flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                          />
                  </div>
                        <div className="flex flex-1 justify-between">
                          <div>
                            <h3 className="font-medium text-secondary">{item.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {selectedCurrency.symbol} {convertPrice(item.price).toFixed(2)}
                    </p>
                  </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-9 self-center"
                            onClick={() => handleMoveToCart(item)}
                          >
                            {t('cart.moveToCart')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Order Summary Column */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6 text-secondary">{t('cart.orderSummary')}</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('cart.subtotal')}</span>
                  <span className="font-medium">
                    {selectedCurrency.symbol} {convertedTotal.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('cart.estimatedTax')}</span>
                  <span className="font-medium">
                    {selectedCurrency.symbol} {estimatedTax.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between pb-4 border-b">
                  <span className="text-gray-600">{t('cart.shipping')}</span>
                  {qualifiesForFreeShipping ? (
                    <span className="font-medium text-green-600">{t('cart.free')}</span>
                  ) : (
                    <span className="font-medium">{t('cart.calculatedAtCheckout')}</span>
                  )}
                </div>
                
                <div className="flex justify-between pt-2">
                  <span className="font-bold text-lg">{t('cart.total')}</span>
                  <span className="font-bold text-xl text-primary">
                    {selectedCurrency.symbol} {(convertedTotal + estimatedTax).toFixed(2)}
                  </span>
                </div>
              </div>
       
              <Button 
                onClick={handleCheckout}
                className="w-full py-6 text-base rounded-lg" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
                    {t('cart.processing')}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {t('cart.proceedToCheckout')}
                  </div>
                )}
              </Button>
              
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t('cart.securePayment')}
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none">
                    <path d="M16 8V5L19 2L20 4L22 5L19 8H16ZM16 8L12 11.9999M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t('cart.fastShipping')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}