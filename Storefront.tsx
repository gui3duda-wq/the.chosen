'use client'

import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import Marquee from './Marquee'
import ProductGrid from './ProductGrid'
import Manifesto from './Manifesto'
import Footer from './Footer'
import WhatsAppFloat from './WhatsAppFloat'
import type { Product, SiteSettings } from '@/lib/types'

export default function Storefront({ onOpenAdmin, verifyingAdmin }: { onOpenAdmin: () => void; verifyingAdmin?: boolean }) {
  const [products, setProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<SiteSettings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([fetch('/api/products'), fetch('/api/settings')])
      .then(async ([pRes, sRes]) => {
        const [pData, sData] = await Promise.all([pRes.json(), sRes.json()])
        if (!active) return
        setProducts(pData.products || [])
        setSettings(sData.settings || {})
        setLoading(false)
      })
      .catch(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="flex flex-col flex-1">
      <Navbar settings={settings} onOpenAdmin={onOpenAdmin} verifyingAdmin={verifyingAdmin} />
      <main className="flex-1">
        <Hero settings={settings} products={products} loading={loading} />
        <Marquee text={settings.marqueeText} />
        <ProductGrid products={products} settings={settings} loading={loading} />
        <Manifesto />
      </main>
      <Footer settings={settings} onOpenAdmin={onOpenAdmin} verifyingAdmin={verifyingAdmin} />
      <WhatsAppFloat settings={settings} />
    </div>
  )
}
