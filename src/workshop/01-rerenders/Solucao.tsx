import { useRef, useState } from 'react'

function ComponenteLento() {
  const renderizacoes = useRef(0)
  renderizacoes.current += 1

  const inicio = performance.now()
  while (performance.now() - inicio < 80) { /* simula trabalho pesado */ }

  return (
    <div className="demo-area" style={{ borderColor: '#22c55e' }}>
      <strong>Componente Lento</strong>
      <div className="render-contador">
        Re-renderizações: <span>{renderizacoes.current}</span>
      </div>
      <p style={{ marginTop: 8, fontSize: '0.8rem', color: '#94a3b8' }}>
        Agora renderiza apenas uma vez ao montar. O input não o afeta mais!
      </p>
    </div>
  )
}

// Técnica 1: "Mover estado para baixo"
// O input vira seu próprio componente com seu próprio estado local
function InputIsolado() {
  const [valor, setValor] = useState('')
  return (
    <div>
      <input
        value={valor}
        onChange={e => setValor(e.target.value)}
        placeholder="Digite algo..."
      />
      <p style={{ marginTop: 8, fontSize: '0.82rem', color: '#64748b' }}>
        Valor atual: "{valor}"
      </p>
    </div>
  )
}

export function Solucao() {
  return (
    <div className="card">
      <h3>Solução: Mover o Estado para Baixo</h3>

      <div className="info-box solucao">
        <strong>A correção:</strong> Extraímos o input para seu próprio componente{' '}
        <code>InputIsolado</code>. Agora o estado fica encapsulado — quando o usuário digita,
        apenas <code>InputIsolado</code> re-renderiza. O <code>ComponenteLento</code> é irmão,
        não filho, então não é afetado.
      </div>

      <div className="demo-area">
        <p style={{ marginBottom: 8, color: '#94a3b8', fontSize: '0.85rem' }}>
          Digite no campo — perceba que não há mais atraso:
        </p>
        <InputIsolado />
      </div>

      <ComponenteLento />

      <div className="info-box dica" style={{ marginTop: 12 }}>
        <strong>Regra prática:</strong> Coloque o estado o mais próximo possível de onde ele
        é usado. Subir estado desnecessariamente causa re-renders em cascata.
      </div>

      <div className="secao">
        <h4>Técnica 2: Children como Props</h4>
        <div className="info-box">
          Quando não dá para extrair o estado (ex: o pai precisa controlar scroll), passe o
          componente pesado como <code>children</code>. O React não re-renderiza elementos
          criados fora do componente que mudou de estado.
        </div>
        <ComponenteComScrollETudo />
      </div>
    </div>
  )
}

// Técnica 2: "Children como props"
// O ScrollWrapper controla o scroll sem afetar quem é passado como children
function ScrollWrapper({ children }: { children: React.ReactNode }) {
  const [scrollY, setScrollY] = useState(0)
  return (
    <div
      style={{ height: 140, overflow: 'auto', background: '#0f172a', borderRadius: 8, padding: 12 }}
      onScroll={e => setScrollY((e.currentTarget).scrollTop)}
    >
      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 8 }}>
        Scroll: {scrollY}px
      </p>
      <div style={{ height: 400 }}>{children}</div>
    </div>
  )
}

function ComponenteLentoComRef() {
  const renderizacoes = useRef(0)
  renderizacoes.current += 1
  return (
    <div style={{ padding: 12, background: '#1e293b', borderRadius: 6 }}>
      <strong style={{ fontSize: '0.85rem' }}>Componente Lento (dentro do scroll)</strong>
      <div className="render-contador">
        Re-renderizações: <span>{renderizacoes.current}</span>
      </div>
    </div>
  )
}

function ComponenteComScrollETudo() {
  return (
    <div className="demo-area">
      <p style={{ marginBottom: 8, fontSize: '0.82rem', color: '#94a3b8' }}>
        Faça scroll — o componente lento não re-renderiza:
      </p>
      <ScrollWrapper>
        <ComponenteLentoComRef />
      </ScrollWrapper>
    </div>
  )
}
