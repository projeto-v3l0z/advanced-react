import { createContext, useContext, useRef, useState } from 'react'

// Um único contexto carregando tudo — o antipadrão mais comum
type AppContextType = {
  usuario: { nome: string; avatar: string }
  tema: 'claro' | 'escuro'
  notificacoes: number
  setTema: (t: 'claro' | 'escuro') => void
  incrementarNotificacoes: () => void
}

const AppContext = createContext<AppContextType>({} as AppContextType)

// Este componente só usa `usuario` — mas re-renderiza quando tema ou
// notificações mudam, pois todos são parte do mesmo contexto
function BarraNavegacao() {
  const { usuario } = useContext(AppContext)
  const renderizacoes = useRef(0)
  renderizacoes.current += 1
  return (
    <div style={{ padding: '10px 14px', background: '#1e293b', borderRadius: 8, marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.875rem' }}>
          {usuario.avatar} {usuario.nome}
        </span>
        <div className="render-contador">
          Renders: <span>{renderizacoes.current}</span>
        </div>
      </div>
    </div>
  )
}

// Este componente só usa `tema` — mas re-renderiza com qualquer mudança no contexto
function BotaoTema() {
  const { tema, setTema } = useContext(AppContext)
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
          Renders: <span>{renderizacoes.current}</span>
        </div>
      </div>
    </div>
  )
}

// Este componente só usa `notificacoes` — mas re-renderiza com qualquer mudança
function SinoNotificacoes() {
  const { notificacoes, incrementarNotificacoes } = useContext(AppContext)
  const renderizacoes = useRef(0)
  renderizacoes.current += 1
  return (
    <div style={{ padding: '10px 14px', background: '#1e293b', borderRadius: 8, marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={incrementarNotificacoes}>
          🔔 {notificacoes} notificação{notificacoes !== 1 ? 'ões' : ''}
        </button>
        <div className="render-contador">
          Renders: <span>{renderizacoes.current}</span>
        </div>
      </div>
    </div>
  )
}

export function ContextoProblema() {
  const [usuario] = useState({ nome: 'Ana Silva', avatar: '👩‍💻' })
  const [tema, setTema] = useState<'claro' | 'escuro'>('escuro')
  const [notificacoes, setNotificacoes] = useState(3)

  const incrementarNotificacoes = () => setNotificacoes(n => n + 1)

  return (
    <AppContext.Provider value={{ usuario, tema, setTema, notificacoes, incrementarNotificacoes }}>
      <div className="card">
        <h3>Problema: Contexto Monolítico</h3>

        <div className="info-box problema">
          <strong>O problema:</strong> Todos os valores vivem no mesmo contexto.
          Quando <em>qualquer</em> valor muda, <em>todos</em> os consumidores
          re-renderizam — mesmo os que não usam o valor que mudou.
          <br /><br />
          Clique no botão de tema e observe que o sino re-renderiza (e vice-versa).
        </div>

        <BarraNavegacao />
        <BotaoTema />
        <SinoNotificacoes />
      </div>
    </AppContext.Provider>
  )
}
