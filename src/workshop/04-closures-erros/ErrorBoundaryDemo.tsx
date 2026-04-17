import { Component, useState } from 'react'

// Error Boundaries precisam ser classes — hooks não conseguem capturar
// erros de renderização de componentes filhos (limitação do React)
class ErrorBoundary extends Component<
  {
    children: React.ReactNode
    fallback: React.ReactNode | ((erro: Error, resetar: () => void) => React.ReactNode)
  },
  { temErro: boolean; erro: Error | null }
> {
  constructor(props: any) {
    super(props)
    this.state = { temErro: false, erro: null }
  }

  // Chamado quando um filho lança um erro — atualiza estado para exibir fallback
  static getDerivedStateFromError(erro: Error) {
    return { temErro: true, erro }
  }

  // Chamado após o render do fallback — ideal para logging (Sentry, etc.)
  componentDidCatch(erro: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary capturou um erro:', erro.message)
    console.error('Árvore de componentes:', info.componentStack)
  }

  resetar = () => this.setState({ temErro: false, erro: null })

  render() {
    if (this.state.temErro) {
      const { fallback } = this.props
      return typeof fallback === 'function'
        ? fallback(this.state.erro!, this.resetar)
        : fallback
    }
    return this.props.children
  }
}

// Componente que pode falhar durante a renderização
function ComponenteArriscado({ modoFalha }: { modoFalha: 'ok' | 'sincrono' | 'dados' }) {
  if (modoFalha === 'sincrono') {
    throw new Error('Erro síncrono na renderização!')
  }

  if (modoFalha === 'dados') {
    // Simula acesso a dados nulos — erro comum em produção
    const dados = null as any
    return <div>{dados.nome}</div>
  }

  return (
    <div style={{ padding: 12, background: '#052e16', borderRadius: 8, border: '1px solid #22c55e' }}>
      <span style={{ color: '#22c55e' }}>✓ Componente renderizando normalmente</span>
    </div>
  )
}

export function ErrorBoundaryDemo() {
  const [modoFalha, setModoFalha] = useState<'ok' | 'sincrono' | 'dados'>('ok')

  return (
    <div className="card">
      <h3>Error Boundary — Contenha Falhas com Elegância</h3>

      <div className="info-box">
        <strong>O problema:</strong> Sem Error Boundary, um erro em qualquer componente
        desmonta <em>toda a árvore</em> do React — o usuário vê uma tela em branco.
        Com Error Boundary, apenas a subárvore afetada é substituída pelo fallback.
      </div>

      <div className="secao">
        <h4>Simular um erro</h4>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => setModoFalha('ok')} style={{ borderColor: '#22c55e' }}>
            ✓ Sem erro
          </button>
          <button onClick={() => setModoFalha('sincrono')} style={{ borderColor: '#ef4444' }}>
            ✗ Erro síncrono
          </button>
          <button onClick={() => setModoFalha('dados')} style={{ borderColor: '#f59e0b' }}>
            ✗ Dados nulos
          </button>
        </div>
      </div>

      <div className="secao">
        <h4>Com Error Boundary</h4>
        <ErrorBoundary
          fallback={(erro, resetar) => (
            <div style={{
              padding: 16, background: '#450a0a', borderRadius: 8,
              border: '1px solid #ef4444',
            }}>
              <p style={{ color: '#fca5a5', fontWeight: 600, marginBottom: 6 }}>
                Algo deu errado aqui.
              </p>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: 10 }}>
                Mensagem: <code>{erro.message}</code>
              </p>
              <button onClick={resetar} style={{ borderColor: '#22c55e' }}>
                Tentar novamente
              </button>
            </div>
          )}
        >
          <ComponenteArriscado modoFalha={modoFalha} />
        </ErrorBoundary>
      </div>

      <div className="secao">
        <h4>Sem Error Boundary</h4>
        <div style={{ padding: 12, background: '#0f172a', borderRadius: 8, border: '1px solid #334155' }}>
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Se este componente falhasse sem Error Boundary, toda a página ficaria
            em branco. Teste no modo "Sem erro" — em produção o efeito seria catastrófico.
          </p>
        </div>
      </div>

      <div className="info-box dica">
        <strong>Limitações do Error Boundary:</strong>
        <br />• Não captura erros em event handlers (<code>onClick</code>, etc.) — use try/catch.
        <br />• Não captura erros assíncronos (<code>fetch</code>, <code>setTimeout</code>) — use try/catch ou React Query.
        <br />• Não captura erros no próprio ErrorBoundary — aninhe dois.
        <br />• Em desenvolvimento, o React exibe o overlay mesmo com ErrorBoundary.
      </div>
    </div>
  )
}
