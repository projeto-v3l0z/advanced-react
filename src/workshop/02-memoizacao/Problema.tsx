import { useRef, useState } from 'react'

const TODOS_OS_PAISES = [
  'Brasil', 'Argentina', 'Chile', 'Colômbia', 'Peru', 'Uruguai', 'Paraguai',
  'Bolívia', 'Venezuela', 'Equador', 'México', 'Cuba', 'Haiti', 'Jamaica',
  'Portugal', 'Espanha', 'França', 'Alemanha', 'Itália', 'Reino Unido',
  'Estados Unidos', 'Canadá', 'Austrália', 'Japão', 'China', 'Índia',
]

// Componente filho — re-renderiza junto com o pai sem necessidade
function ItemPais({ pais, aoFavoritar }: { pais: string; aoFavoritar: (p: string) => void }) {
  const renderizacoes = useRef(0)
  renderizacoes.current += 1
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #334155' }}>
      <span style={{ fontSize: '0.875rem' }}>{pais}</span>
      <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: '0.7rem', color: '#f59e0b' }}>#{renderizacoes.current}</span>
        <button style={{ padding: '2px 8px', fontSize: '0.75rem' }} onClick={() => aoFavoritar(pais)}>
          ★
        </button>
      </span>
    </div>
  )
}

export function Problema() {
  const [busca, setBusca] = useState('')
  const [contador, setContador] = useState(0)
  const [favoritos, setFavoritos] = useState<string[]>([])

  // Executa em CADA re-render, mesmo quando só o contador muda
  console.log('Filtrando países...')
  const paisesFiltrados = TODOS_OS_PAISES.filter(p =>
    p.toLowerCase().includes(busca.toLowerCase())
  )

  // Nova função criada em CADA render — impossibilita otimizações no filho
  const aoFavoritar = (pais: string) => {
    setFavoritos(prev =>
      prev.includes(pais) ? prev.filter(f => f !== pais) : [...prev, pais]
    )
  }

  return (
    <div className="card">
      <h3>Sem Memoização — Tudo Re-renderiza</h3>

      <div className="info-box problema">
        <strong>Observe o console e os contadores (#):</strong>
        <br />• Clicar em "Contador" re-renderiza todos os itens (desnecessário).
        <br />• A filtragem roda em todo re-render, mesmo sem mudar a busca.
        <br />• Cada render cria uma nova função <code>aoFavoritar</code>.
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
        O número <span style={{ color: '#f59e0b' }}>#</span> ao lado de cada país mostra
        quantas vezes aquele item re-renderizou. Clique em "Contador" várias vezes e veja
        os números subirem sem motivo.
      </div>
    </div>
  )
}
