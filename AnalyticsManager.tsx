'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, BarChart3, TrendingUp, MessageCircle, Eye, Package, RotateCcw } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell,
} from 'recharts'
import { toast } from 'sonner'
import { authFetchOptions } from '@/lib/session'

interface AnalyticsData {
  totals: { views: number; whatsappClicks: number; conversionRate: number }
  byProduct: Array<{ productName: string; views: number; whatsappClicks: number; conversionRate: number; active: boolean }>
  byDay: Array<{ date: string; views: number; whatsappClicks: number }>
  bySize: Array<{ size: string; count: number }>
  generatedAt: string
}

const COLORS = ['#dc2626', '#2563eb', '#16a34a', '#ca8a04', '#9333ea', '#0891b2', '#c2410c', '#475569']

function formatDateShort(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export default function AnalyticsManager() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/analytics', authFetchOptions())
      if (!res.ok) throw new Error('Erro ao carregar')
      const d = await res.json()
      setData(d)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao carregar analytics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-foreground/40">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BarChart3 className="w-12 h-12 text-foreground/30 mb-3" />
        <p className="text-foreground/60 font-medium">Nenhum dado disponível</p>
        <p className="text-foreground/40 text-sm mt-1">Os dados aparecem quando clientes interagem com a vitrine.</p>
      </div>
    )
  }

  const { totals, byProduct, byDay, bySize } = data

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Analytics
          </h1>
          <p className="text-sm text-foreground/50 mt-0.5">
            Acompanhe em tempo real: cliques no WhatsApp, peças mais acessadas e tamanhos mais pedidos.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground/70 hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          icon={Eye}
          label="Visualizações"
          value={totals.views}
          color="text-blue-600 bg-blue-50 border-blue-200"
        />
        <SummaryCard
          icon={MessageCircle}
          label="Cliques WhatsApp"
          value={totals.whatsappClicks}
          color="text-emerald-600 bg-emerald-50 border-emerald-200"
        />
        <SummaryCard
          icon={TrendingUp}
          label="Taxa de conversão"
          value={`${totals.conversionRate}%`}
          color="text-primary bg-primary/10 border-primary/20"
        />
        <SummaryCard
          icon={Package}
          label="Peças na vitrine"
          value={byProduct.filter(p => p.active).length}
          color="text-amber-600 bg-amber-50 border-amber-200"
        />
      </div>

      {/* Charts grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Daily clicks line chart */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-1">Cliques por dia (últimos 14 dias)</h3>
          <p className="text-xs text-foreground/50 mb-4">Visualizações vs. cliques no WhatsApp</p>
          {byDay.every(d => d.views === 0 && d.whatsappClicks === 0) ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={byDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" />
                <XAxis dataKey="date" tickFormatter={formatDateShort} tick={{ fontSize: 11, fill: 'oklch(0.5 0 0)' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'oklch(0.5 0 0)' }} />
                <Tooltip
                  labelFormatter={(l) => formatDateShort(l as string)}
                  contentStyle={{ background: 'white', border: '1px solid oklch(0.9 0 0)', borderRadius: 8, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="views" name="Visualizações" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="whatsappClicks" name="WhatsApp" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top products bar chart */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-1">Peças mais acessadas</h3>
          <p className="text-xs text-foreground/50 mb-4">Top produtos por visualizações + cliques WhatsApp</p>
          {byProduct.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={byProduct.slice(0, 8)} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: 'oklch(0.5 0 0)' }} />
                <YAxis
                  type="category"
                  dataKey="productName"
                  width={100}
                  tick={{ fontSize: 10, fill: 'oklch(0.4 0 0)' }}
                  tickFormatter={(v: string) => v.length > 14 ? v.substring(0, 14) + '…' : v}
                />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid oklch(0.9 0 0)', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="views" name="Views" fill="#2563eb" radius={[0, 4, 4, 0]} />
                <Bar dataKey="whatsappClicks" name="WhatsApp" fill="#dc2626" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Sizes pie chart */}
      {bySize.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-5 mb-6">
          <h3 className="font-bold text-foreground mb-1">Tamanhos mais pedidos no WhatsApp</h3>
          <p className="text-xs text-foreground/50 mb-4">Distribuição dos tamanhos selecionados pelos clientes</p>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <ResponsiveContainer width="100%" height={220} minWidth={220}>
              <PieChart>
                <Pie
                  data={bySize}
                  dataKey="count"
                  nameKey="size"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.size}: ${entry.count}`}
                  labelLine={false}
                >
                  {bySize.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'white', border: '1px solid oklch(0.9 0 0)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 grid grid-cols-2 gap-2 w-full">
              {bySize.map((s, i) => (
                <div key={s.size} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-foreground/70">Tamanho {s.size}</span>
                  <span className="font-bold text-foreground ml-auto">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detailed product table */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-bold text-foreground mb-1">Detalhamento por peça</h3>
        <p className="text-xs text-foreground/50 mb-4">
          Lista completa — peças ativas e excluídas (histórico preservado). Atualiza automaticamente com a vitrine.
        </p>
        {byProduct.length === 0 ? (
          <EmptyChart />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-foreground/50 uppercase tracking-wide border-b border-border">
                  <th className="pb-2 pr-3 font-semibold">Peça</th>
                  <th className="pb-2 px-3 font-semibold text-center">Views</th>
                  <th className="pb-2 px-3 font-semibold text-center">WhatsApp</th>
                  <th className="pb-2 px-3 font-semibold text-center">Conversão</th>
                  <th className="pb-2 pl-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {byProduct.map((p) => (
                  <tr key={p.productName} className="border-b border-border/50 last:border-0">
                    <td className="py-2.5 pr-3 font-medium text-foreground">
                      {p.productName}
                    </td>
                    <td className="py-2.5 px-3 text-center text-foreground/70">{p.views}</td>
                    <td className="py-2.5 px-3 text-center text-foreground/70">{p.whatsappClicks}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-primary">{p.conversionRate}%</td>
                    <td className="py-2.5 pl-3 text-center">
                      {p.active ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Ativa
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                          Excluída
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-foreground/40 mt-4 text-center">
        Dados gerados em {new Date(data.generatedAt).toLocaleString('pt-BR')} · Atualiza em tempo real conforme clientes interagem com a vitrine.
      </p>
    </div>
  )
}

function SummaryCard({ icon: Icon, label, value, color }: { icon: typeof Eye; label: string; value: number | string; color: string }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-2xl font-black text-foreground">{value}</div>
      <div className="text-xs text-foreground/50 mt-0.5">{label}</div>
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="h-[240px] flex flex-col items-center justify-center text-center">
      <BarChart3 className="w-10 h-10 text-foreground/20 mb-2" />
      <p className="text-sm text-foreground/40">Sem dados ainda</p>
      <p className="text-xs text-foreground/30 mt-0.5">Os dados aparecem quando clientes interagem</p>
    </div>
  )
}
