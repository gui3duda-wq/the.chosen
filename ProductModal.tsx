'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, MessageCircle } from 'lucide-react'
import type { Product, SiteSettings } from '@/lib/types'
import { formatPrice, parseSizes, getAllProductImages } from '@/lib/types'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import { toast } from 'sonner'

export default function ProductModal({
  product,
  settings,
  onClose,
}: {
  product: Product | null
  settings: SiteSettings
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (product) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
      // Track "view" when modal opens (only once per product)
      fetch('/api/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, productName: product.name, type: 'view' }),
      }).catch(() => {})
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [product, onClose])

  return (
    <AnimatePresence>
      {product && (
        <ModalShell key={product.id} product={product} settings={settings} onClose={onClose} />
      )}
    </AnimatePresence>
  )
}

function ModalShell({
  product,
  settings,
  onClose,
}: {
  product: Product
  settings: SiteSettings
  onClose: () => void
}) {
  const [size, setSize] = useState('')
  const [activeImage, setActiveImage] = useState(0)
  const images = getAllProductImages(product)

  // Reset selection when switching products — intentional state sync on prop change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSize('')
    setActiveImage(0)
  }, [product.id])

  const handleWhatsApp = () => {
    if (!size) {
      toast.error('Selecione um tamanho primeiro')
      return
    }
    // Track "whatsapp" click
    fetch('/api/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, productName: product.name, type: 'whatsapp', size }),
    }).catch(() => {})
    const link = buildWhatsAppLink(
      settings.whatsappNumber || '5511999999999',
      settings.whatsappMessage || 'Olá! Tenho interesse na peça {product} (Tam: {size}) — valor R$ {price}.',
      { name: product.name, price: product.price },
      size,
      product.image
    )
    window.open(link, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-background/85 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-card rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl grid md:grid-cols-2 border border-border"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center text-foreground/70 hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image gallery */}
        <div className="relative bg-secondary">
          <div className="aspect-square md:h-full">
            <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.featured && (
            <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              Destaque
            </span>
          )}
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === i ? 'border-primary scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Imagem ${i + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[92vh] md:max-h-none flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            {product.category}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
            {product.name}
          </h2>
          <p className="text-2xl font-black text-foreground mt-3">{formatPrice(product.price)}</p>

          <p className="text-foreground/60 text-sm leading-relaxed mt-5">{product.description}</p>

          {/* Sizes */}
          <div className="mt-7">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-foreground">Tamanho</span>
              <span className="text-xs text-foreground/50">Guia de medidas</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {parseSizes(product.sizes).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-11 h-11 px-3 rounded-xl border-2 font-bold text-sm transition-all ${
                    size === s
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-foreground/70 hover:border-foreground/40'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div className="mt-5 flex items-center gap-2 text-sm">
            {product.inStock ? (
              <>
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-primary font-bold">Disponível</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-destructive" />
                <span className="text-destructive font-bold">Esgotado</span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="mt-auto pt-7 flex gap-3">
            <button
              onClick={handleWhatsApp}
              disabled={!product.inStock}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-full font-bold text-sm hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              {product.inStock ? 'Comprar no WhatsApp' : 'Indisponível'}
            </button>
            <button
              className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center text-foreground/60 hover:border-primary hover:text-primary transition-colors"
              aria-label="Favoritar"
              onClick={() => toast('Adicionado aos favoritos')}
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-4 text-xs text-foreground/45 leading-relaxed text-center">
            Você será direcionado ao WhatsApp para finalizar a compra com atendimento personalizado.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
