import { useRef, useState } from 'react'

// -------------------------------------------------------------------
// DESAFIO: Use o padrão "children como props" para corrigir o problema
// -------------------------------------------------------------------
//
// SITUAÇÃO:
//   O componente <PainelFiltros> controla um estado de filtro.
//   O <TabelaDados> é pesado e re-renderiza junto com o painel,
//   mesmo sem precisar do estado de filtro.
//
// TAREFA:
//   1. Faça o <PainelFiltros> aceitar `children` como prop.
//   2. Mova o <TabelaDados> para fora do <PainelFiltros> no JSX.
//   3. Confirme que as re-renderizações de <TabelaDados> caem para 1.
//
// DICA: A solução não exige useMemo nem React.memo — só composição!
// -------------------------------------------------------------------

function TabelaDados() {
  const renderizacoes = useRef(0)
  renderizacoes.current += 1

  const inicio = performance.now()
  while (performance.now() - inicio < 80) { /* simula tabela pesada */ }

  return (
    <div className="demo-area" style={{ borderColor: renderizacoes.current > 1 ? '#ef4444' : '#22c55e' }}>
      <strong>Tabela de Dados</strong>
      <div className="render-contador">
        Re-renderizações: <span>{renderizacoes.current}</span>
        {renderizacoes.current > 1 && (
          <span style={{ color: '#ef4444', marginLeft: 8 }}>❌ Ainda está re-renderizando!</span>
        )}
        {renderizacoes.current === 1 && (
          <span style={{ color: '#22c55e', marginLeft: 8 }}>✅ Perfeito!</span>
        )}
      </div>
    </div>
  )
}

// TODO: Adicione `children: React.ReactNode` nos props e renderize-o no lugar da TabelaDados
function PainelFiltros() {
  const [filtro, setFiltro] = useState('')
  const [categoria, setCategoria] = useState('todos')

  return (
    <div className="demo-area">
      <p style={{ marginBottom: 8, fontSize: '0.85rem', color: '#94a3b8' }}>
        Filtros (altere e observe as re-renderizações):
      </p>
      <input
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
        placeholder="Buscar..."
        style={{ marginBottom: 8 }}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        {['todos', 'ativos', 'inativos'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoria(cat)}
            style={{
              background: categoria === cat ? '#3b82f6' : '#334155',
              borderColor: categoria === cat ? '#3b82f6' : '#475569',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* TODO: substitua a linha abaixo por {children} */}
      <TabelaDados />
    </div>
  )
}

export function Desafio() {
  return (
    <div className="card">
      <h3>Desafio: Children como Props</h3>

      <div className="info-box desafio">
        <strong>Sua missão:</strong> Corrija o <code>PainelFiltros</code> usando o padrão
        "children como props" para que a <code>TabelaDados</code> não re-renderize quando
        os filtros mudam.
      </div>

      {/* TODO: quando terminar, deverá ficar assim:
           <PainelFiltros>
             <TabelaDados />
           </PainelFiltros>
      */}
      <PainelFiltros />

      <details style={{ marginTop: 16 }}>
        <summary style={{ cursor: 'pointer', color: '#64748b', fontSize: '0.82rem' }}>
          Ver solução
        </summary>
        <pre style={{
          background: '#0f172a', borderRadius: 8, padding: 16, marginTop: 8,
          fontSize: '0.78rem', color: '#94a3b8', overflow: 'auto',
        }}>
{`// 1. Adicione children nos props:
function PainelFiltros({ children }: { children: React.ReactNode }) {
  const [filtro, setFiltro] = useState('')
  // ... resto do código ...
  return (
    <div className="demo-area">
      {/* ... inputs e botões ... */}
      {children}   {/* ← aqui em vez de <TabelaDados /> */}
    </div>
  )
}

// 2. No componente pai, passe TabelaDados como filho:
<PainelFiltros>
  <TabelaDados />
</PainelFiltros>

// Por que funciona?
// O React cria o elemento <TabelaDados /> no contexto do pai (Desafio),
// não do PainelFiltros. Quando PainelFiltros re-renderiza, ele recebe
// o mesmo objeto children — React não toca no TabelaDados.`}
        </pre>
      </details>
    </div>
  )
}
