import { useRef, useState } from 'react'

// Simula um componente lento (bloqueia a thread por 80ms)
function ComponenteLento() {
  const renderizacoes = useRef(0)
  renderizacoes.current += 1

  const inicio = performance.now()
  while (performance.now() - inicio < 80) { /* simula trabalho pesado */ }

  return (
    <div className="demo-area" style={{ borderColor: '#ef4444' }}>
      <strong>Componente Lento</strong>
      <div className="render-contador">
        Re-renderizações: <span>{renderizacoes.current}</span>
      </div>
      <p style={{ marginTop: 8, fontSize: '0.8rem', color: '#94a3b8' }}>
        Este componente não usa o estado do input, mas re-renderiza mesmo assim!
      </p>
    </div>
  )
}

export function Problema() {
  // O estado fica no pai — qualquer digitação re-renderiza TUDO abaixo
  const [valor, setValor] = useState('')

  return (
    <div className="card">
      <h3>Por que minha interface está travando?</h3>

      <div className="info-box problema">
        <strong>O problema:</strong> O estado <code>valor</code> está no componente pai.
        Cada tecla pressionada re-renderiza o pai e todos os filhos, incluindo o{' '}
        <code>ComponenteLento</code> — que não precisa desse estado para nada.
      </div>

      <div className="demo-area">
        <p style={{ marginBottom: 8, color: '#94a3b8', fontSize: '0.85rem' }}>
          Digite no campo abaixo e perceba o atraso:
        </p>
        <input
          value={valor}
          onChange={e => setValor(e.target.value)}
          placeholder="Digite algo..."
        />
        <p style={{ marginTop: 8, fontSize: '0.82rem', color: '#64748b' }}>
          Valor atual: "{valor}"
        </p>
      </div>

      <ComponenteLento />

      <div className="info-box dica" style={{ marginTop: 12 }}>
        <strong>Conceito-chave:</strong> Um re-render acontece quando o estado de um componente
        muda. Todos os componentes <em>filhos</em> também re-renderizam automaticamente — mesmo
        que seus props não tenham mudado.
      </div>
    </div>
  )
}
