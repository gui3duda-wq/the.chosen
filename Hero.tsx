'use client'

import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import type { Product, SiteSettings } from '@/lib/types'

export default function Hero({
  settings,
  products,
  loading,
}: {
  settings: SiteSettings
  products: Product[]
  loading: boolean
}) {
  const rawTitle = settings.heroTitle || 'SEJA O\nESCOLHIDO.'
  const title = rawTitle.replace(/\\n/g, '\n')
  const subtitle = settings.heroSubtitle || 'Streetwear motivacional para quem decide o próprio destino.'
  const badge = settings.heroBadge || 'COLEÇÃO 01'
  const logo = settings.logoImage || '/uploads/co-logo-red.png'
  const featured = products.find(p => p.featured) || products[0]

  const scrollToCollection = () =>
    document.getElementById('colecao')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="top"
      className="relative min-h-[92vh] flex items-center overflow-hidden bg-background"
    >
      {/* Subtle red ambient glow */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[55%] h-[80%] bg-[radial-gradient(ellipse_at_top_right,oklch(0.55_0.22_27/0.10),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-[radial-gradient(circle_at_bottom_left,oklch(0.55_0.22_27/0.06),transparent_70%)] blur-3xl" />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, oklch(0.14 0.005 20) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.14 0.005 20) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            {badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold tracking-[0.18em] uppercase mb-6 border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {badge}
              </div>
            )}

            <h1 className="text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-black tracking-[-0.03em] leading-[0.92] text-foreground whitespace-pre-line">
              {title}
            </h1>

            <p className="mt-7 text-base sm:text-lg text-foreground/60 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {subtitle}
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={scrollToCollection}
                className="group inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:brightness-110 transition-all"
              >
                Explorar coleção
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Featured product */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative aspect-[4/5] max-w-md mx-auto">
              <div className="absolute inset-0 bg-[radial-gradient(circle,oklch(0.55_0.22_27/0.12),transparent_65%)] blur-2xl" />

              {loading ? (
                <div className="relative w-full h-full rounded-2xl bg-secondary animate-pulse" />
              ) : featured ? (
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative w-full h-full"
                >
                  <img
                    src={featured.image}
                    alt={featured.name}
                    className="relative w-full h-full object-cover rounded-2xl shadow-2xl border border-border"
                  />
                  <div className="absolute -top-5 -right-5 w-20 h-20 sm:w-24 sm:h-24">
                    <img
                      src={logo}
                      alt="CHOSEN ONE"
                      className="w-full h-full object-contain drop-shadow-[0_4px_20px_oklch(0.55_0.22_27/0.35)]"
                    />
                  </div>
                  <button
                    onClick={scrollToCollection}
                    className="absolute -bottom-4 left-4 right-4 sm:left-6 sm:right-auto bg-card/95 backdrop-blur border border-border rounded-xl px-5 py-3.5 shadow-xl text-left hover:border-primary/50 transition-colors"
                  >
                    <div className="text-[10px] uppercase tracking-widest text-primary font-bold">Destaque</div>
                    <div className="text-foreground font-bold text-sm mt-0.5 truncate">{featured.name}</div>
                    <div className="text-foreground/60 text-xs mt-0.5">
                      R$ {featured.price.toFixed(2).replace('.', ',')}
                    </div>
                  </button>
                </motion.div>
              ) : null}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
