import { useCallback, useEffect, useRef, useState } from 'react'

export function ClosureSolucao() {
  const [contador, setContador] = useState(0)
  const [log, setLog] = useState<string[]>([])
  const [tick, setTick] = useState(0)

  // A solução: guardar o valor mais recente em um ref
  // O ref é mutável e não causa re-render — é o "buraco na closure"
  const contadorRef = useRef(contador)
  contadorRef.current = contador // atualizado em todo render, sem custo extra

  // Agora lemos contadorRef.current (sempre atual) dentro da closure estável
  const adicionarAoLog = useCallback(() => {
    setLog(prev => [...prev, `[clique] contador visto: ${contadorRef.current}`])
  }, []) // sem dependências — funciona porque ref sempre tem o valor atual

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1)
      // Agora lê o valor real, não o congelado da criação do effect
      setLog(prev => [...prev, `[interval] contador visto: ${contadorRef.current}`])
    }, 2000)
    return () => clearInterval(id)
  }, []) // sem dependências — ref garante acesso ao valor atual

  return (
    <div className="card">
      <h3>Solução: useRef como Escape da Stale Closure</h3>

      <div className="info-box solucao">
        <strong>O padrão:</strong> Crie um ref e sincronize-o com o estado em todo render.
        Funções com deps vazias leem <code>ref.current</code> em vez do estado diretamente.
        O ref age como uma "janela" para o valor mais atual.
      </div>

      <div className="demo-area">
        <p style={{ marginBottom: 10, fontSize: '0.85rem', color: '#94a3b8' }}>
          Clique em "+1" várias vezes, depois em "Adicionar ao log".
          Agora o log mostra o valor correto!
        </p>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6', marginBottom: 10 }}>
          Contador real: {contador}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <button onClick={() => setContador(c => c + 1)}>+1</button>
          <button onClick={adicionarAoLog} style={{ borderColor: '#22c55e' }}>
            Adicionar ao log (correto)
          </button>
        </div>
        <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
          Próximo tick do interval em ~2s... (tick #{tick})
        </p>
      </div>

      <div className="log-rerenders">
        {log.length === 0 && <span style={{ color: '#475569' }}>Log vazio — clique nos botões acima</span>}
        {log.map((entrada, i) => (
          <div key={i} style={{ color: '#22c55e' }}>
            {entrada}
          </div>
        ))}
      </div>

      <div className="info-box dica" style={{ marginTop: 12 }}>
        <strong>Este padrão em uma linha:</strong>
        <pre style={{ marginTop: 6, fontSize: '0.8rem' }}>
{`const valorRef = useRef(valor)
valorRef.current = valor  // em todo render
// use valorRef.current dentro de callbacks com deps=[]`}
        </pre>
        Este é o mecanismo por trás de hooks como <code>useEvent</code> (proposta RFC)
        e de bibliotecas como Zustand para evitar re-renders em subscribers.
      </div>
    </div>
  )
}
