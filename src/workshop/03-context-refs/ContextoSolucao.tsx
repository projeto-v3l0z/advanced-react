import { createContext, useContext, useRef, useState } from 'react'

// Contextos separados por domínio — cada componente assina apenas o que precisa
const UsuarioContext = createContext<{ nome: string; avatar: string }>({
  nome: '',
  avatar: '',
})

const TemaContext = createContext<{
  tema: 'claro' | 'escuro'
  setTema: (t: 'claro' | 'escuro') => void
}>({ tema: 'escuro', setTema: () => {} })

const NotificacoesContext = createContext<{
  notificacoes: number
  incrementarNotificacoes: () => void
}>({ notificacoes: 0, incrementarNotificacoes: () => {} })

// Agora cada componente re-renderiza APENAS quando seu contexto específico muda
function BarraNavegacao() {
  const usuario = useContext(UsuarioContext)
  const renderizacoes = useRef(0)
  renderizacoes.current += 1
  return (
    <div style={{ padding: '10px 14px', background: '#1e293b', borderRadius: 8, marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.875rem' }}>
          {usuario.avatar} {usuario.nome}
        </span>
        <div className="render-contador">
          Renders: <span style={{ color: '#22c55e' }}>{renderizacoes.current}</span>
        </div>
      </div>
    </div>
  )
}

function BotaoTema() {
  const { tema, setTema } = useContext(TemaContext)
  const renderizacoes = useRef(0)
  renderizacoes.current += 1
  return (
    <div style={{ padding: '10px 14px', background: '#1e293b', borderRadius: 8, marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setTema(tema === 'claro' ? 'escuro' : 'claro')}
          style={{ background: tema === 'claro' ? '#f59e0b' : '#334155' }}
        >
          {tema === 'claro' ? '☀️ Claro' : '🌙 Escuro'}
        </button>
        <div className="render-contador">
          Renders: <span style={{ color: '#22c55e' }}>{renderizacoes.current}</span>
        </div>
      </div>
    </div>
  )
}

function SinoNotificacoes() {
  const { notificacoes, incrementarNotificacoes } = useContext(NotificacoesContext)
  const renderizacoes = useRef(0)
  renderizacoes.current += 1
  return (
    <div style={{ padding: '10px 14px', background: '#1e293b', borderRadius: 8, marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={incrementarNotificacoes}>
          🔔 {notificacoes} notificação{notificacoes !== 1 ? 'ões' : ''}
        </button>
        <div className="render-contador">
          Renders: <span style={{ color: '#22c55e' }}>{renderizacoes.current}</span>
        </div>
      </div>
    </div>
  )
}

// Providers separados — cada um só re-renderiza consumidores do seu contexto
export function ContextoSolucao() {
  const [usuario] = useState({ nome: 'Ana Silva', avatar: '👩‍💻' })
  const [tema, setTema] = useState<'claro' | 'escuro'>('escuro')
  const [notificacoes, setNotificacoes] = useState(3)

  const incrementarNotificacoes = () => setNotificacoes(n => n + 1)

  return (
    <UsuarioContext.Provider value={usuario}>
      <TemaContext.Provider value={{ tema, setTema }}>
        <NotificacoesContext.Provider value={{ notificacoes, incrementarNotificacoes }}>
          <div className="card">
            <h3>Solução: Contextos Separados por Domínio</h3>

            <div className="info-box solucao">
              <strong>A correção:</strong> Dividimos o contexto em três partes independentes.
              Agora, quando você muda o tema, apenas o <code>BotaoTema</code> re-renderiza.
              O sino e a barra de navegação ficam intactos. Teste clicando em cada botão
              e observe os contadores verdes.
            </div>

            <BarraNavegacao />
            <BotaoTema />
            <SinoNotificacoes />

            <div className="info-box dica" style={{ marginTop: 8 }}>
              <strong>Dica extra:</strong> Para contextos complexos, combine contexts separados
              com <code>useReducer</code> para gerenciar transições de estado relacionadas.
              Isso evita inconsistências entre múltiplos <code>useState</code>.
            </div>
          </div>
        </NotificacoesContext.Provider>
      </TemaContext.Provider>
    </UsuarioContext.Provider>
  )
}
