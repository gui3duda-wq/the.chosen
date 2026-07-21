'use client'

import { useState } from 'react'
import { ArrowLeft, LogOut, Shirt, Settings, User, History, BarChart3 } from 'lucide-react'
import ProductManager from './ProductManager'
import SettingsManager from './SettingsManager'
import AccountManager from './AccountManager'
import AuditLogManager from './AuditLogManager'
import AnalyticsManager from './AnalyticsManager'

export default function AdminPanel({
  onBackToStore,
  onLogout,
}: {
  onBackToStore: () => void
  onLogout: () => void
}) {
  const [tab, setTab] = useState<'products' | 'settings' | 'account' | 'history' | 'analytics'>('products')

  return (
    <div className="admin-zone flex flex-col flex-1 min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shirt className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight leading-none text-foreground">Painel CHOSEN ONE</div>
              <div className="text-[10px] text-foreground/50 leading-none mt-0.5">Gestão da loja</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Ver loja</span>
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 text-sm bg-secondary hover:bg-destructive hover:text-white text-foreground px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-16 z-30 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex gap-1 overflow-x-auto">
          {[
            { id: 'products', label: 'Produtos', icon: Shirt },
            { id: 'settings', label: 'Aparência & Conteúdo', icon: Settings },
            { id: 'account', label: 'Conta & Senha', icon: User },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'history', label: 'Histórico', icon: History },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as 'products' | 'settings' | 'account' | 'history' | 'analytics')}
              className={`inline-flex items-center gap-2 px-4 py-3.5 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-foreground/50 hover:text-foreground'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-5 sm:px-8 py-8">
        {tab === 'products' && <ProductManager />}
        {tab === 'settings' && <SettingsManager />}
        {tab === 'account' && <AccountManager />}
        {tab === 'analytics' && <AnalyticsManager />}
        {tab === 'history' && <AuditLogManager />}
      </main>
    </div>
  )
}
