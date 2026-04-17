import { memo, useCallback, useMemo, useRef, useState } from 'react'

// -------------------------------------------------------------------
// DESAFIO: Otimize este dashboard usando useMemo, useCallback e memo
// -------------------------------------------------------------------
//
// PROBLEMAS ATUAIS:
//   1. calcularEstatisticas() roda em todo re-render (inclusive ao trocar tema)
//   2. GraficoBarras re-renderiza mesmo quando dados e callback não mudaram
//   3. aoSelecionarBarra é recriada em todo render, quebrando memo
//
// TAREFAS:
//   [ ] Envolva GraficoBarras com React.memo
//   [ ] Envolva calcularEstatisticas com useMemo (deps: [dados])
//   [ ] Envolva aoSelecionarBarra com useCallback (deps: [])
//
// COMO VERIFICAR: clique em "Trocar Tema" — GraficoBarras não deve re-renderizar
// -------------------------------------------------------------------

// TODO: Adicione React.memo aqui
function GraficoBarras({
  dados,
  aoSelecionarBarra,
}: {
  dados: number[]
  aoSelecionarBarra: (i: number) => void
}) {
  const renderizacoes = useRef(0)
  renderizacoes.current += 1

  return (
    <div>
      <div className="render-contador" style={{ marginBottom: 6 }}>
        Re-renderizações do gráfico: <span>{renderizacoes.current}</span>
      </div>
      <div className="barra-container">
        {dados.map((valor, i) => (
          <div
            key={i}
            onClick={() => aoSelecionarBarra(i)}
            title={`Índice ${i}: ${valor}`}
            style={{
              flex: 1,
              height: `${valor}%`,
              background: '#3b82f6',
              borderRadius: '3px 3px 0 0',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => ((e.target as HTMLElement).style.background = '#60a5fa')}
            onMouseLeave={e => ((e.target as HTMLElement).style.background = '#3b82f6')}
          />
        ))}
      </div>
    </div>
  )
}

function calcularEstatisticas(numeros: number[]) {
  console.log('Calculando estatísticas...')
  const soma = numeros.reduce((a, b) => a + b, 0)
  const media = (soma / numeros.length).toFixed(1)
  const max = Math.max(...numeros)
  const min = Math.min(...numeros)
  return { soma, media, max, min }
}

export function Desafio() {
  const [tema, setTema] = useState<'escuro' | 'claro'>('escuro')
  const [barraSelecionada, setBarraSelecionada] = useState<number | null>(null)

  // Dados fixos — não mudam entre renders
  const dados = [40, 70, 30, 90, 60, 80, 50, 45, 75]

  // TODO: Envolva com useMemo
  const estatisticas = calcularEstatisticas(dados)

  // TODO: Envolva com useCallback
  const aoSelecionarBarra = (index: number) => {
    setBarraSelecionada(index)
  }

  const estiloTema = {
    background: tema === 'escuro' ? '#0f172a' : '#f1f5f9',
    color: tema === 'escuro' ? '#e2e8f0' : '#1e293b',
    borderRadius: 8,
    padding: 16,
    border: '1px solid #334155',
  }

  return (
    <div className="card">
      <h3>Desafio: Otimizar um Dashboard</h3>

      <div className="info-box desafio">
        <strong>Missão:</strong> Adicione <code>memo</code>, <code>useMemo</code> e{' '}
        <code>useCallback</code> nos lugares indicados pelos comentários{' '}
        <code>// TODO</code>. Clique em "Trocar Tema" e verifique que o gráfico
        para de re-renderizar.
      </div>

      <div className="demo-area">
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <button onClick={() => setTema(t => t === 'escuro' ? 'claro' : 'escuro')}>
            Trocar Tema: {tema}
          </button>
          {barraSelecionada !== null && (
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', alignSelf: 'center' }}>
              Barra {barraSelecionada} selecionada (valor: {dados[barraSelecionada]})
            </span>
          )}
        </div>

        <div style={estiloTema}>
          <GraficoBarras dados={dados} aoSelecionarBarra={aoSelecionarBarra} />
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          {Object.entries(estatisticas).map(([chave, valor]) => (
            <div key={chave} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>{chave}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3b82f6' }}>{valor}</div>
            </div>
          ))}
        </div>
      </div>

      <details style={{ marginTop: 16 }}>
        <summary style={{ cursor: 'pointer', color: '#64748b', fontSize: '0.82rem' }}>
          Ver solução
        </summary>
        <pre style={{
          background: '#0f172a', borderRadius: 8, padding: 16, marginTop: 8,
          fontSize: '0.78rem', color: '#94a3b8', overflow: 'auto',
        }}>
{`// 1. React.memo no componente filho:
const GraficoBarras = memo(({ dados, aoSelecionarBarra }) => { ... })

// 2. useMemo para cálculo custoso:
const estatisticas = useMemo(
  () => calcularEstatisticas(dados),
  [dados]   // só recalcula quando dados mudar
)

// 3. useCallback para referência estável:
const aoSelecionarBarra = useCallback((index: number) => {
  setBarraSelecionada(index)
}, [])  // sem deps: função nunca muda`}
        </pre>
      </details>
    </div>
  )
}

export { memo, useMemo, useCallback }
