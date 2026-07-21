'use client'

import { motion } from 'framer-motion'

export default function Manifesto() {
  return (
    <section id="manifesto" className="relative bg-background py-24 sm:py-32 overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[20vw] sm:text-[16vw] font-black tracking-tighter text-primary/[0.04] leading-none select-none">
          CHOSEN
        </span>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold tracking-[0.18em] uppercase mb-8 border border-primary/20">
            Manifesto
          </div>

          <p className="text-2xl sm:text-3xl lg:text-[2.5rem] font-black tracking-tight leading-[1.1] text-foreground">
            Não nascemos para ser
            <br />
            mais um na multidão.
            <br />
            <span className="text-primary">Nascemos escolhidos.</span>
          </p>

          <p className="mt-8 text-base sm:text-lg text-foreground/55 leading-relaxed max-w-2xl mx-auto">
            Cada peça carrega uma mensagem. Cada mensagem é uma escolha. Você não
            veste CHOSEN ONE para pertencer — você veste para lembrar que o
            escolhido não erra. Ele apenas decide. E decide bem.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
