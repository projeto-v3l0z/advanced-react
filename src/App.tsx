import { useState } from 'react'
import './index.css'

import { Problema as RerendersProblema } from './workshop/01-rerenders/Problema'
import { Solucao as RerendersSolucao } from './workshop/01-rerenders/Solucao'
import { Desafio as RerendersDesafio } from './workshop/01-rerenders/Desafio'

import { Problema as MemoProblema } from './workshop/02-memoizacao/Problema'
import { Solucao as MemoSolucao } from './workshop/02-memoizacao/Solucao'
import { Desafio as MemoDesafio } from './workshop/02-memoizacao/Desafio'

import { ContextoProblema } from './workshop/03-context-refs/ContextoProblema'
import { ContextoSolucao } from './workshop/03-context-refs/ContextoSolucao'
import { RefsDemo } from './workshop/03-context-refs/RefsDemo'
import { Desafio as ContextDesafio } from './workshop/03-context-refs/Desafio'

import { ClosureProblema } from './workshop/04-closures-erros/ClosureProblema'
import { ClosureSolucao } from './workshop/04-closures-erros/ClosureSolucao'
import { ErrorBoundaryDemo } from './workshop/04-closures-erros/ErrorBoundaryDemo'
import { Desafio as ClosureDesafio } from './workshop/04-closures-erros/Desafio'

type SecaoType = { titulo: string; componente: React.ReactNode }
type ModuloType = { titulo: string; duracao: string; cor: string; secoes: SecaoType[] }

const modulos: ModuloType[] = [
  {
    titulo: 'Re-renders e Composição',
    duracao: '30 min',
    cor: '#3b82f6',
    secoes: [
      { titulo: '🔴 Problema', componente: <RerendersProblema /> },
      { titulo: '✅ Solução', componente: <RerendersSolucao /> },
      { titulo: '🏋️ Desafio', componente: <RerendersDesafio /> },
    ],
  },
  {
    titulo: 'Memoização',
    duracao: '30 min',
    cor: '#8b5cf6',
    secoes: [
      { titulo: '🔴 Problema', componente: <MemoProblema /> },
      { titulo: '✅ Solução', componente: <MemoSolucao /> },
      { titulo: '🏋️ Desafio', componente: <MemoDesafio /> },
    ],
  },
  {
    titulo: 'Context e Refs',
    duracao: '25 min',
    cor: '#10b981',
    secoes: [
      { titulo: '🔴 Contexto - Problema', componente: <ContextoProblema /> },
      { titulo: '✅ Contexto - Solução', componente: <ContextoSolucao /> },
      { titulo: '📖 Demo: useRef', componente: <RefsDemo /> },
      { titulo: '🏋️ Desafio', componente: <ContextDesafio /> },
    ],
  },
  {
    titulo: 'Closures e Erros',
    duracao: '25 min',
    cor: '#f59e0b',
    secoes: [
      { titulo: '🔴 Stale Closure - Problema', componente: <ClosureProblema /> },
      { titulo: '✅ Stale Closure - Solução', componente: <ClosureSolucao /> },
      { titulo: '📖 Demo: Error Boundary', componente: <ErrorBoundaryDemo /> },
      { titulo: '🏋️ Desafio Final', componente: <ClosureDesafio /> },
    ],
  },
]

export default function App() {
  const [moduloAtivo, setModuloAtivo] = useState(0)
  const [secaoAtiva, setSecaoAtiva] = useState(0)

  const modulo = modulos[moduloAtivo]
  const secao = modulo.secoes[secaoAtiva]

  const irParaAnterior = () => {
    if (secaoAtiva > 0) {
      setSecaoAtiva(s => s - 1)
    } else if (moduloAtivo > 0) {
      const novoModulo = moduloAtivo - 1
      setModuloAtivo(novoModulo)
      setSecaoAtiva(modulos[novoModulo].secoes.length - 1)
    }
  }

  const irParaProximo = () => {
    if (secaoAtiva < modulo.secoes.length - 1) {
      setSecaoAtiva(s => s + 1)
    } else if (moduloAtivo < modulos.length - 1) {
      setModuloAtivo(m => m + 1)
      setSecaoAtiva(0)
    }
  }

  const ehPrimeiro = moduloAtivo === 0 && secaoAtiva === 0
  const ehUltimo = moduloAtivo === modulos.length - 1 && secaoAtiva === modulo.secoes.length - 1

  return (
    <div className="workshop">
      <header className="workshop-header">
        <div>
          <h1>Workshop: React Avançado</h1>
          <p>Baseado em <em>Advanced React</em> — Nadia Makarevich &nbsp;·&nbsp; ~2 horas</p>
        </div>
        <div className="header-progresso">
          {modulos.map((m, i) => (
            <div
              key={i}
              className={`progresso-dot ${i === moduloAtivo ? 'ativo' : i < moduloAtivo ? 'concluido' : ''}`}
              style={{ '--cor': m.cor } as React.CSSProperties}
              title={m.titulo}
            />
          ))}
        </div>
      </header>

      <div className="workshop-layout">
        <nav className="workshop-nav">
          {modulos.map((m, mi) => (
            <div key={mi} className="nav-modulo-wrapper">
              <button
                className={`nav-modulo ${mi === moduloAtivo ? 'ativo' : ''}`}
                style={{ '--cor': m.cor } as React.CSSProperties}
                onClick={() => { setModuloAtivo(mi); setSecaoAtiva(0) }}
              >
                <span className="nav-num">{mi + 1}</span>
                <span className="nav-info">
                  <strong>{m.titulo}</strong>
                  <small>{m.duracao}</small>
                </span>
              </button>
              {mi === moduloAtivo && (
                <div className="nav-secoes">
                  {m.secoes.map((s, si) => (
                    <button
                      key={si}
                      className={`nav-secao ${si === secaoAtiva ? 'ativa' : ''}`}
                      style={{ '--cor': m.cor } as React.CSSProperties}
                      onClick={() => setSecaoAtiva(si)}
                    >
                      {s.titulo}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <main className="workshop-conteudo">
          <div className="conteudo-header" style={{ '--cor': modulo.cor } as React.CSSProperties}>
            <span className="badge">Módulo {moduloAtivo + 1} — {modulo.titulo}</span>
            <h2>{secao.titulo}</h2>
          </div>

          <div className="conteudo-corpo">
            {secao.componente}
          </div>

          <div className="conteudo-nav">
            <button className="btn-nav" disabled={ehPrimeiro} onClick={irParaAnterior}>
              ← Anterior
            </button>
            <span className="nav-posicao">
              {secaoAtiva + 1} / {modulo.secoes.length}
            </span>
            <button className="btn-nav btn-nav-proximo" disabled={ehUltimo} onClick={irParaProximo}>
              Próximo →
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
