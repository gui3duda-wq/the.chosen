'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import type { Product, SiteSettings } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductGrid({
  products,
  settings,
  loading,
}: {
  products: Product[]
  settings: SiteSettings
  loading: boolean
}) {
  const [category, setCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Product | null>(null)

  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category))
    return ['all', ...Array.from(set)]
  }, [products])

  const filtered = useMemo(() => {
    let result = products
    if (category !== 'all') {
      result = result.filter(p => p.category === category)
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }
    return result
  }, [products, category, search])

  return (
    <section id="colecao" className="bg-background py-20 sm:py-28 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-3">
              A Coleção
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-[-0.03em] text-foreground">
              Peças que falam por você
            </h2>
          </motion.div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar peça por nome..."
              className="w-full bg-card border border-border rounded-full pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === c
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground/70 border border-border hover:border-foreground/30 hover:text-foreground'
              }`}
            >
              {c === 'all' ? 'Todos' : c}
            </button>
          ))}
        </div>

        {/* Results count */}
        {search && (
          <p className="text-sm text-foreground/50 mb-4">
            {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'} para "{search}"
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-foreground/20 mx-auto mb-3" />
            <p className="text-foreground/60 font-medium">
              {search ? `Nenhuma peça encontrada para "${search}"` : 'Nenhuma peça nesta categoria.'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-3 text-sm text-primary font-bold hover:underline"
              >
                Limpar busca
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} settings={settings} onClick={() => setSelected(p)} />
            ))}
          </div>
        )}
      </div>

      <ProductModal product={selected} settings={settings} onClose={() => setSelected(null)} />
    </section>
  )
}
