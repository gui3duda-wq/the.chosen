'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Upload, ImageIcon, Loader2, Star, Check, Trash2 } from 'lucide-react'
import type { Product } from '@/lib/types'
import { parseImages } from '@/lib/types'
import { toast } from 'sonner'
import { authFetchOptions } from '@/lib/session'

const ALL_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG']

export default function ProductForm({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null
  onClose: () => void
  onSaved: () => void
}) {
  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [price, setPrice] = useState(product ? String(product.price) : '')
  const [category, setCategory] = useState(product?.category || 'Coleção')
  // images: first is primary (front), rest are additional (back, details)
  const [images, setImages] = useState<string[]>(
    product ? [product.image, ...parseImages(product.images)].filter(Boolean) : []
  )
  const [sizes, setSizes] = useState<string[]>(
    product ? product.sizes.split(',').map(s => s.trim()).filter(Boolean) : ['P', 'M', 'G', 'GG']
  )
  const [featured, setFeatured] = useState(product?.featured || false)
  const [inStock, setInStock] = useState(product?.inStock ?? true)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const toggleSize = (s: string) => {
    setSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const handleFiles = async (files: FileList) => {
    const arr = Array.from(files)
    for (const file of arr) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} não é uma imagem válida`)
        continue
      }
      try {
        const dataUrl = await resizeImage(file, 1000, 0.85)
        setImages(prev => [...prev, dataUrl])
      } catch {
        toast.error(`Erro ao processar ${file.name}`)
      }
    }
    toast.success('Imagem(ns) carregada(s)')
  }

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  const moveImageToFirst = (idx: number) => {
    setImages(prev => {
      const copy = [...prev]
      const [img] = copy.splice(idx, 1)
      copy.unshift(img)
      return copy
    })
  }

  const handleSave = async () => {
    if (!name.trim() || !description.trim() || !price || images.length === 0 || sizes.length === 0) {
      toast.error('Preencha todos os campos e adicione ao menos 1 imagem')
      return
    }
    const priceNum = Number(price.replace(',', '.'))
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Preço inválido')
      return
    }

    setSaving(true)
    const [primary, ...rest] = images
    const body = {
      name: name.trim(),
      description: description.trim(),
      price: priceNum,
      image: primary,
      images: rest, // array; API joins with |
      sizes: sizes.join(','),
      category: category.trim() || 'Coleção',
      featured,
      inStock,
    }
    try {
      const url = product ? `/api/products/${product.id}` : '/api/products'
      const method = product ? 'PUT' : 'POST'
      const res = await fetch(url, authFetchOptions({
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }))
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Erro ao salvar')
      }
      toast.success(product ? 'Produto atualizado' : 'Produto criado')
      onSaved()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/85 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-card rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-border"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-black tracking-tight text-foreground">
            {product ? 'Editar produto' : 'Novo produto'}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center text-foreground/60"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Image gallery — multiple images (front, back, etc.) */}
          <div>
            <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wide mb-2 block">
              Imagens do produto * <span className="text-foreground/40 normal-case font-normal">(frente, costas, detalhes — a 1ª é a principal)</span>
            </label>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />

            {/* Thumbnails grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-secondary border border-border">
                    <img src={img} alt={`Imagem ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                        Capa
                      </span>
                    )}
                    {/* actions */}
                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/60 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => moveImageToFirst(idx)}
                          className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:brightness-110"
                          title="Definir como capa"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="w-7 h-7 rounded-full bg-destructive text-white flex items-center justify-center hover:brightness-110"
                        title="Remover imagem"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {/* Add button */}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-foreground/50 hover:border-primary hover:text-primary transition-colors"
                >
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-[11px] font-medium">Adicionar</span>
                </button>
              </div>
            )}

            {images.length === 0 && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full py-8 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-foreground/50 hover:border-primary hover:text-primary transition-colors"
              >
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Enviar imagens</span>
                <span className="text-xs text-foreground/40 mt-0.5">JPG, PNG ou WebP — selecione várias de uma vez</span>
              </button>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wide mb-1.5 block">
              Nome *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: You Chose What You Want — Preto"
              className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wide mb-1.5 block">
              Descrição *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o material, caimento e mensagem da peça..."
              rows={3}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Price + Category */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wide mb-1.5 block">
                Preço (R$) *
              </label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="189.90"
                inputMode="decimal"
                className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wide mb-1.5 block">
                Categoria
              </label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Destino"
                className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wide mb-2 block">
              Tamanhos disponíveis *
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  className={`min-w-12 h-10 px-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center gap-1 ${
                    sizes.includes(s)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-foreground/70 hover:border-foreground/40'
                  }`}
                >
                  {sizes.includes(s) && <Check className="w-3 h-3" />}
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="grid sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFeatured(!featured)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                featured ? 'border-primary bg-primary/10' : 'border-border hover:border-foreground/30'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${featured ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground/40'}`}>
                <Star className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">Destaque</div>
                <div className="text-xs text-foreground/50">Exibir no topo da página</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setInStock(!inStock)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                inStock ? 'border-emerald-500 bg-emerald-500/10' : 'border-border hover:border-foreground/30'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${inStock ? 'bg-emerald-600 text-white' : 'bg-secondary text-foreground/40'}`}>
                <Check className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">Em estoque</div>
                <div className="text-xs text-foreground/50">Disponível para compra</div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-foreground/60 hover:bg-secondary transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold hover:brightness-110 disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {product ? 'Salvar alterações' : 'Criar produto'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// Resize image via canvas to limit stored size
function resizeImage(file: File, maxSize: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width)
          width = maxSize
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height)
          height = maxSize
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('no ctx'))
        ctx.drawImage(img, 0, 0, width, height)
        const isPng = file.type === 'image/png'
        const dataUrl = isPng
          ? canvas.toDataURL('image/png')
          : canvas.toDataURL('image/jpeg', quality)
        resolve(dataUrl)
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
