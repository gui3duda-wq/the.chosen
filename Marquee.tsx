'use client'

export default function Marquee({ text }: { text?: string }) {
  const content = text || 'CHOSEN ONE • O ESCOLHIDO NÃO ERRA • VOCÊ DECIDE QUANDO TERMINA • UM PASSO DE CADA VEZ •'
  const items = (content + ' ' + content).split('•').map(s => s.trim()).filter(Boolean)

  return (
    <div className="relative bg-primary text-primary-foreground py-3.5 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center text-xs sm:text-sm font-bold tracking-wide uppercase px-3">
            {item}
            <svg className="w-3 h-3 mx-5 inline-block shrink-0 opacity-70" viewBox="0 0 24 24" fill="currentColor">
              <path d="M 12 2 L 14 9 L 22 10 L 16 15 L 18 22 L 12 18 L 6 22 L 8 15 L 2 10 L 10 9 Z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}
