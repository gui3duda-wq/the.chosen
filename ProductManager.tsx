'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Loader2, PackageOpen } from 'lucide-react'
import type { Product } from '@/lib/types'
import { formatPrice, parseSizes, getAllProductImages } from '@/lib/types'
import ProductForm from './ProductForm'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { authFetchOptions } from '@/lib/session'

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(data.products || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleNew = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const handleEdit = (p: Product) => {
    setEditing(p)
    setFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/products/${deleteId}`, authFetchOptions({ method: 'DELETE' }))
      if (!res.ok) throw new Error('Erro ao excluir')
      toast.success('Produto excluído da vitrine')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Erro ao excluir produto')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Produtos</h1>
          <p className="text-sm text-foreground/50 mt-0.5">
            {products.length} {products.length === 1 ? 'peça cadastrada' : 'peças cadastradas'} — clique em Editar ou Excluir para gerenciar
          </p>
        </div>
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo produto
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-foreground/40">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <PackageOpen className="w-12 h-12 text-foreground/30 mb-3" />
          <p className="text-foreground/60 font-medium">Nenhum produto cadastrado</p>
          <p className="text-foreground/40 text-sm mt-1">Clique em "Novo produto" para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => {
            const imgCount = getAllProductImages(p).length
            return (
              <div
                key={p.id}
                className="flex flex-col bg-card rounded-2xl overflow-hidden border border-border"
              >
                <div className="relative aspect-square bg-secondary">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                    {p.featured && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                        Destaque
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        p.inStock ? 'bg-emerald-600 text-white' : 'bg-destructive text-white'
                      }`}
                    >
                      {p.inStock ? 'Ativo' : 'Esgotado'}
                    </span>
                    {imgCount > 1 && (
                      <span className="bg-foreground/70 text-background text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                        {imgCount} fotos
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-primary">
                        {p.category}
                      </span>
                      <h3 className="font-bold text-foreground text-sm truncate">{p.name}</h3>
                    </div>
                    <span className="font-black text-foreground text-sm whitespace-nowrap">
                      {formatPrice(p.price)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {parseSizes(p.sizes).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-medium text-foreground/60 border border-border rounded px-1.5 py-0.5"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  {/* Action buttons — ALWAYS visible (no hover needed) */}
                  <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="inline-flex items-center justify-center gap-1.5 bg-secondary text-foreground py-2.5 rounded-lg text-xs font-bold hover:bg-secondary/70 border border-border transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </button>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="inline-flex items-center justify-center gap-1.5 bg-destructive/10 text-destructive py-2.5 rounded-lg text-xs font-bold hover:bg-destructive hover:text-white border border-destructive/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Form dialog */}
      {formOpen && (
        <ProductForm
          product={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false)
            load()
          }}
        />
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto da vitrine?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O produto será removido permanentemente da loja e os clientes não verão mais ele.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90 focus:ring-destructive text-white"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sim, excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
