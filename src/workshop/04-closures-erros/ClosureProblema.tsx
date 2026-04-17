import { useCallback, useEffect, useState } from 'react'

export function ClosureProblema() {
  const [contador, setContador] = useState(0)
  const [log, setLog] = useState<string[]>([])
  const [tick, setTick] = useState(0)

  // BUG 1: useCallback com deps vazias captura contador=0 para sempre
  // A função "vê" um contador que nunca envelhece — uma "stale closure"
  const adicionarAoLog = useCallback(() => {
    setLog(prev => [...prev, `[clique] contador visto: ${contador}`])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // BUG 2: useEffect com deps vazias — o interval sempre lê contador=0
  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1)
      // Esta linha sempre imprime 0, independente de quantas vezes
      // o botão "+1" for clicado
      setLog(prev => [...prev, `[interval] contador visto: ${contador}`])
    }, 2000)
    return () => clearInterval(id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="card">
      <h3>Stale Closure — O Fantasma do Valor Passado</h3>

      <div className="info-box problema">
        <strong>O que é stale closure?</strong> Em JavaScript, funções "capturam" as
        variáveis do escopo onde foram criadas. Em React, se uma função é criada apenas
        na primeira renderização (deps <code>[]</code>), ela captura os valores daquele
        momento — e os carrega para sempre, mesmo que o estado mude depois.
      </div>

      <div className="demo-area">
        <p style={{ marginBottom: 10, fontSize: '0.85rem', color: '#94a3b8' }}>
          Clique em "+1" várias vezes, depois em "Adicionar ao log".
          Veja que o log sempre reporta 0!
        </p>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6', marginBottom: 10 }}>
          Contador real: {contador}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <button onClick={() => setContador(c => c + 1)}>+1</button>
          <button onClick={adicionarAoLog}>Adicionar ao log (bugado)</button>
        </div>
        <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
          Próximo tick do interval em ~2s... (tick #{tick})
        </p>
      </div>

      <div className="log-rerenders">
        {log.length === 0 && <span style={{ color: '#475569' }}>Log vazio — clique nos botões acima</span>}
        {log.map((entrada, i) => (
          <div key={i} style={{ color: entrada.includes('0') ? '#ef4444' : '#22c55e' }}>
            {entrada}
          </div>
        ))}
      </div>

      <div className="info-box dica" style={{ marginTop: 12 }}>
        <strong>Por que acontece:</strong> <code>useCallback(fn, [])</code> cria a função
        uma vez e a reutiliza. Mas <code>contador</code> dentro de <code>fn</code> é uma
        cópia do valor no momento da criação — não uma referência viva.
      </div>
    </div>
  )
}
