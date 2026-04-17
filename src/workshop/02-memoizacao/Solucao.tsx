import { memo, useCallback, useMemo, useRef, useState } from 'react'

const TODOS_OS_PAISES = [
  'Brasil', 'Argentina', 'Chile', 'Colômbia', 'Peru', 'Uruguai', 'Paraguai',
  'Bolívia', 'Venezuela', 'Equador', 'México', 'Cuba', 'Haiti', 'Jamaica',
  'Portugal', 'Espanha', 'França', 'Alemanha', 'Itália', 'Reino Unido',
  'Estados Unidos', 'Canadá', 'Austrália', 'Japão', 'China', 'Índia',
]

// React.memo: só re-renderiza se os props mudarem (comparação rasa)
// Funciona porque aoFavoritar é estável graças ao useCallback abaixo
const ItemPais = memo(({ pais, aoFavoritar }: { pais: string; aoFavoritar: (p: string) => void }) => {
  const renderizacoes = useRef(0)
  renderizacoes.current += 1
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #334155' }}>
      <span style={{ fontSize: '0.875rem' }}>{pais}</span>
      <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: '0.7rem', color: '#22c55e' }}>#{renderizacoes.current}</span>
        <button style={{ padding: '2px 8px', fontSize: '0.75rem' }} onClick={() => aoFavoritar(pais)}>
          ★
        </button>
      </span>
    </div>
  )
})

export function Solucao() {
  const [busca, setBusca] = useState('')
  const [contador, setContador] = useState(0)
  const [favoritos, setFavoritos] = useState<string[]>([])

  // useMemo: só recalcula a lista quando `busca` muda
  const paisesFiltrados = useMemo(() => {
    console.log('Filtrando países... (só quando busca muda)')
    return TODOS_OS_PAISES.filter(p =>
      p.toLowerCase().includes(busca.toLowerCase())
    )
  }, [busca])

  // useCallback: mantém a mesma referência de função entre renders
  // sem isso, React.memo no filho não funcionaria (prop mudaria sempre)
  const aoFavoritar = useCallback((pais: string) => {
    setFavoritos(prev =>
      prev.includes(pais) ? prev.filter(f => f !== pais) : [...prev, pais]
    )
  }, [])

  return (
    <div className="card">
      <h3>Com Memoização — Renders Controlados</h3>

      <div className="info-box solucao">
        <strong>O que mudou:</strong>
        <br />• <code>useMemo</code>: filtragem só roda quando <code>busca</code> muda.
        <br />• <code>useCallback</code>: <code>aoFavoritar</code> mantém a mesma referência.
        <br />• <code>React.memo</code>: itens só re-renderizam quando seus props mudam.
        <br />Clique em "Contador" — os itens não re-renderizam mais!
      </div>

      <div className="demo-area">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar país..."
            style={{ flex: 1 }}
          />
          <button onClick={() => setContador(c => c + 1)}>
            Contador: {contador}
          </button>
        </div>

        {favoritos.length > 0 && (
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 8 }}>
            Favoritos: {favoritos.join(', ')}
          </p>
        )}

        <div style={{ maxHeight: 240, overflowY: 'auto' }}>
          {paisesFiltrados.map(pais => (
            <ItemPais key={pais} pais={pais} aoFavoritar={aoFavoritar} />
          ))}
        </div>
      </div>

      <div className="info-box dica">
        <strong>Atenção — quando NÃO memoizar:</strong> Memoização tem custo de memória e
        complexidade. Use-a apenas quando o problema de performance for confirmado. Para
        componentes simples ou props primitivos, o overhead pode superar o ganho.
      </div>
    </div>
  )
}
