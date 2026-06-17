import React, { useState } from 'react'

export type MidasProfile = {
  race?: string
  gender?: string
  color?: string
}

export function MidasWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<string[]>([
    'Olá! Eu sou Midas. Posso dar insights financeiros.'
  ])

  function toggle() {
    setOpen(!open)
  }

  function sendTip() {
    setMessages((m) => [...m, 'Dica: Separe contas pessoais e empresariais.'])
  }

  return (
    <div>
      <button
        aria-label="midas-toggle"
        onClick={toggle}
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'gold',
          border: 'none',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
        }}
      >
        M
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="midas-balloons"
          style={{ position: 'fixed', right: 100, bottom: 90, width: 280 }}
        >
          {messages.map((t, i) => (
            <div key={i} style={{ background: '#fff', padding: 8, marginBottom: 8, borderRadius: 8 }}>
              {t}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={sendTip}>Enviar dica</button>
            <button onClick={() => setOpen(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MidasWidget
