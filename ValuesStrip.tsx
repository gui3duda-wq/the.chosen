'use client'

import { motion } from 'framer-motion'
import { Shirt, Recycle, Truck, ShieldCheck } from 'lucide-react'

const values = [
  {
    icon: Shirt,
    title: 'Tecidos Premium',
    desc: 'Algodão pima e egípcio selecionados para toque macio e durabilidade.',
  },
  {
    icon: ShieldCheck,
    title: 'Caimento Perfeito',
    desc: 'Modelagem estudada para vestir bem em todos os biótipos.',
  },
  {
    icon: Recycle,
    title: 'Produção Ética',
    desc: 'Manufatura responsável com materiais de baixo impacto ambiental.',
  },
  {
    icon: Truck,
    title: 'Entrega Expressa',
    desc: 'Envio para todo o Brasil com rastreio em tempo real.',
  },
]

export default function ValuesStrip() {
  return (
    <section id="valores" className="bg-stone-950 py-20 sm:py-28 border-t border-stone-900">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-14"
        >
          <div className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-3">
            Por que APEX
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Detalhes que fazem a diferença.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-6 rounded-2xl bg-stone-900/50 border border-stone-800 hover:border-amber-500/40 hover:bg-stone-900 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <v.icon className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-white font-bold text-base mb-1.5">{v.title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
