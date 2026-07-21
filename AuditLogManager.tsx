'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, History, Filter, Package, Settings as SettingsIcon, KeyRound, Plus, Pencil, Trash2, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { authFetchOptions } from '@/lib/session'

interface AuditEntry {
  id: string
  action: string
  entity: string
  entityId: string | null
  summary: string
  details: Record<string, unknown>
  adminUser: string
  createdAt: string
}

const ACTION_META: Record<string, { label: string; icon: typeof Plus; color: string }> = {
  product_create: { label: 'Produto criado', icon: Plus, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  product_update: { label: 'Produto editado', icon: Pencil, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  product_delete: { label: 'Produto excluído', icon: Trash2, color: 'text-red-600 bg-red-50 border-red-200' },
  settings_update: { label: 'Configurações salvas', icon: SettingsIcon, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  password_change: { label: 'Senha alterada', icon: KeyRound, color: 'text-purple-600 bg-purple-50 border-purple-200' },
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMin / 60)
  const diffD = Math.floor(diffH / 24)

  if (diffMin < 1) return 'agora mesmo'
  if (diffMin < 60) return `há ${diffMin} min`
  if (diffH < 24) return `há ${diffH}h`
  if (diffD < 7) return `há ${diffD}d`

  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AuditLogManager() {
  const [logs, setLogs] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const url = filter === 'all' ? '/api/audit?limit=200' : `/api/audit?limit=200&entity=${filter}`
      const res = await fetch(url, authFetchOptions())
      const data = await res.json()
      setLogs(data.logs || [])
    } catch {
      toast.error('Erro ao carregar histórico')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    load()
  }, [load])

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filters = [
    { id: 'all', label: 'Tudo' },
    { id: 'product', label: 'Produtos' },
    { id: 'settings', label: 'Configurações' },
    { id: 'auth', label: 'Senha' },
  ]

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <History className="w-6 h-6 text-primary" />
            Histórico de alterações
          </h1>
          <p className="text-sm text-foreground/50 mt-0.5">
            Registro de todas as edições feitas no painel admin — produtos, configurações e senha.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground/70 hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Filter className="w-4 h-4 text-foreground/40" />
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === f.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground/70 border border-border hover:border-foreground/30'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-foreground/40">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <History className="w-12 h-12 text-foreground/30 mb-3" />
          <p className="text-foreground/60 font-medium">Nenhuma alteração registrada ainda</p>
          <p className="text-foreground/40 text-sm mt-1">As edições que você fizer aparecerão aqui automaticamente.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {logs.map((log) => {
            const meta = ACTION_META[log.action] || { label: log.action, icon: History, color: 'text-foreground/60 bg-secondary border-border' }
            const Icon = meta.icon
            const isExpanded = expanded.has(log.id)
            const hasDetails = log.details && Object.keys(log.details).length > 0

            return (
              <div
                key={log.id}
                className="bg-card rounded-xl border border-border overflow-hidden"
              >
                <button
                  onClick={() => hasDetails && toggleExpand(log.id)}
                  className={`w-full flex items-start gap-3 p-4 text-left ${hasDetails ? 'hover:bg-secondary/50 cursor-pointer' : 'cursor-default'}`}
                >
                  <div className={`shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center ${meta.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${meta.color}`}>
                        {meta.label}
                      </span>
                      <span className="text-[11px] text-foreground/40 font-medium">
                        {formatDate(log.createdAt)}
                      </span>
                      <span className="text-[11px] text-foreground/40">·</span>
                      <span className="text-[11px] text-foreground/50 font-medium">por {log.adminUser}</span>
                    </div>
                    <p className="text-sm text-foreground mt-1.5 leading-snug break-words">
                      {log.summary}
                    </p>
                    {hasDetails && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-primary mt-1.5 font-medium">
                        {isExpanded ? '− ocultar detalhes' : '+ ver detalhes'}
                      </span>
                    )}
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && hasDetails && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="ml-12 mt-2 p-3.5 rounded-lg bg-secondary border border-border overflow-x-auto">
                      <pre className="text-[11px] text-foreground/70 font-mono whitespace-pre-wrap break-words">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Summary footer */}
      {!loading && logs.length > 0 && (
        <p className="text-xs text-foreground/40 mt-5 text-center">
          Mostrando {logs.length} {logs.length === 1 ? 'registro' : 'registros'} (mais recentes primeiro)
        </p>
      )}
    </div>
  )
}
