'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import type { Product, SiteSettings } from '@/lib/types'
import { formatPrice, parseSizes, getAllProductImages } from '@/lib/types'
import { buildWhatsAppLink } from '@/lib/whatsapp'

function trackClick(product: Product, type: 'view' | 'whatsapp', size?: string) {
  // Fire-and-forget click tracking
  fetch('/api/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: product.id,
      productName: product.name,
      type,
      size: size || null,
    }),
  }).catch(() => { /* ignore errors — tracking is best-effort */ })
}

export default function ProductCard({
  product,
  index,
  settings,
  onClick,
}: {
  product: Product
  index: number
  settings: SiteSettings
  onClick: () => void
}) {
  const sizes = parseSizes(product.sizes)
  const allImages = getAllProductImages(product)
  const hasMultiple = allImages.length > 1

  const handleCardClick = () => {
    trackClick(product, 'view')
    onClick()
  }

  const buyNow = (e: React.MouseEvent) => {
    e.stopPropagation()
    const selectedSize = sizes[0] || '-'
    trackClick(product, 'whatsapp', selectedSize)
    const link = buildWhatsAppLink(
      settings.whatsappNumber || '5511999999999',
      settings.whatsappMessage || 'Olá! Tenho interesse na peça {product} (Tam: {size}) — valor R$ {price}.',
      { name: product.name, price: product.price },
      selectedSize,
      product.image
    )
    window.open(link, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3) }}
      className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Image */}
      <button
        onClick={handleCardClick}
        className="relative aspect-[4/5] overflow-hidden bg-secondary block w-full"
        aria-label={`Ver ${product.name}`}
      >
        <img
          src={allImages[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {hasMultiple && (
          <img
            src={allImages[1]}
            alt={`${product.name} — costas`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.featured && (
            <span className="bg-primary text-primary-foreground text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              Destaque
            </span>
          )}
          {!product.inStock && (
            <span className="bg-destructive text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              Esgotado
            </span>
          )}
        </div>
      </button>

      {/* Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              {product.category}
            </span>
            <h3 className="text-foreground font-bold text-xs sm:text-sm mt-0.5 line-clamp-2 leading-tight">{product.name}</h3>
          </div>
        </div>

        <p className="text-foreground font-black text-sm sm:text-base mt-1.5">
          {formatPrice(product.price)}
        </p>

        {/* Sizes — compact on mobile */}
        <div className="flex flex-wrap gap-1 mt-2">
          {sizes.map((s) => (
            <span
              key={s}
              className="text-[10px] font-medium text-foreground/55 border border-border rounded px-1.5 py-0.5"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Direct WhatsApp buy button */}
        <button
          onClick={buyNow}
          disabled={!product.inStock}
          className="mt-3 w-full inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {product.inStock ? 'Comprar' : 'Indisponível'}
        </button>
      </div>
    </motion.div>
  )
}
