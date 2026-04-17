import { useEffect, useRef, useState } from 'react'

export function RefsDemo() {
  return (
    <div className="card">
      <h3>useRef: Três Casos de Uso Essenciais</h3>

      <div className="info-box">
        <code>useRef</code> retorna um objeto mutável <code>{'{ current: valor }'}</code> que
        persiste entre renders. Diferente do estado, <strong>alterar um ref não causa re-render</strong>.
      </div>

      <div className="secao">
        <h4>1. Acesso direto ao DOM</h4>
        <DemoRefDOM />
      </div>

      <div className="secao">
        <h4>2. Valor persistente sem re-render</h4>
        <DemoRefSemRerender />
      </div>

      <div className="secao">
        <h4>3. Armazenar ID de timer/interval</h4>
        <DemoCronometro />
      </div>
    </div>
  )
}

function DemoRefDOM() {
  const inputRef = useRef<HTMLInputElement>(null)
  const divRef = useRef<HTMLDivElement>(null)

  const focarInput = () => inputRef.current?.focus()
  const animar = () => {
    const el = divRef.current
    if (!el) return
    el.style.transform = 'scale(1.05)'
    setTimeout(() => { el.style.transform = 'scale(1)' }, 200)
  }

  return (
    <div className="demo-area">
      <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: 10 }}>
        Ref permite controlar elementos DOM imperativamente — útil para foco,
        scroll, animações e integração com libs externas.
      </p>
      <input ref={inputRef} placeholder="Clique em 'Focar' para ativar este campo" />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button onClick={focarInput}>Focar input</button>
        <div
          ref={divRef}
          onClick={animar}
          style={{
            padding: '6px 14px', background: '#8b5cf6', borderRadius: 6,
            cursor: 'pointer', fontSize: '0.82rem', transition: 'transform 0.2s',
            border: 'none', color: 'white',
          }}
        >
          Clique para animar
        </div>
      </div>
    </div>
  )
}

function DemoRefSemRerender() {
  const [contador, setContador] = useState(0)
  const renderizacoes = useRef(0)
  const cliquesIgnorados = useRef(0)

  // Incrementa sem causar re-render — útil para métricas/diagnóstico
  renderizacoes.current += 1

  const registrarCliqueIgnorado = () => {
    cliquesIgnorados.current += 1
    // Não causa re-render — valor atualizado mas tela não muda
    console.log('Cliques ignorados:', cliquesIgnorados.current)
    alert(`Cliques ignorados (via ref): ${cliquesIgnorados.current}\nAbra o console para confirmar.`)
  }

  return (
    <div className="demo-area">
      <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: 10 }}>
        Refs são ideais para rastrear valores que influenciam lógica mas não precisam
        atualizar a UI — como contadores internos, valores anteriores, flags.
      </p>
      <div className="render-contador" style={{ marginBottom: 10 }}>
        Re-renderizações desta seção: <span>{renderizacoes.current}</span>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => setContador(c => c + 1)}>
          Forçar re-render ({contador})
        </button>
        <button onClick={registrarCliqueIgnorado}>
          Registrar via Ref (sem re-render)
        </button>
      </div>
    </div>
  )
}

function DemoCronometro() {
  const [tempo, setTempo] = useState(0)
  const [rodando, setRodando] = useState(false)
  // Guardamos o ID do interval no ref — se ficasse em estado,
  // causaria um re-render extra e complicaria a limpeza
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const iniciar = () => {
    if (rodando) return
    setRodando(true)
    intervalRef.current = setInterval(() => setTempo(t => t + 1), 100)
  }

  const parar = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setRodando(false)
  }

  const resetar = () => {
    parar()
    setTempo(0)
  }

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const segundos = (tempo / 10).toFixed(1)

  return (
    <div className="demo-area">
      <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: 10 }}>
        O ID do <code>setInterval</code> vive em um ref — não no estado — porque ele
        não precisa ser exibido e não deve causar re-renders.
      </p>
      <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6', marginBottom: 10, fontVariantNumeric: 'tabular-nums' }}>
        {segundos}s
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={iniciar} disabled={rodando} style={{ background: rodando ? undefined : '#22c55e', borderColor: '#22c55e' }}>
          ▶ Iniciar
        </button>
        <button onClick={parar} disabled={!rodando} style={{ background: !rodando ? undefined : '#ef4444', borderColor: '#ef4444' }}>
          ⏸ Pausar
        </button>
        <button onClick={resetar}>
          ↺ Resetar
        </button>
      </div>
    </div>
  )
}
