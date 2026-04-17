import { useImperativeHandle, useRef, useState } from 'react'

// -------------------------------------------------------------------
// DESAFIO: Use useImperativeHandle para expor uma API imperativa ao pai
// -------------------------------------------------------------------
//
// SITUAÇÃO:
//   No React 19, `ref` é uma prop normal — não precisa mais de forwardRef!
//   Mas quando você quer expor métodos customizados (em vez do elemento DOM
//   bruto), ainda precisa do useImperativeHandle.
//
// TAREFAS:
//   [ ] Adicione `ref` como prop tipada em InputCustomizadoProps
//   [ ] Use useImperativeHandle para expor { focus, limpar, selecionarTudo }
//   [ ] Troque o tipo do inputRef no pai de `any` para MétodosExpostos
//
// BÔNUS:
//   [ ] Faça o botão "Selecionar Tudo" funcionar
// -------------------------------------------------------------------

type MétodosExpostos = {
  focus: () => void
  limpar: () => void
  selecionarTudo: () => void
}

type InputCustomizadoProps = {
  placeholder?: string
  rotulo?: string
  ref?: React.Ref<MétodosExpostos>  // React 19: ref é prop normal
}

// TODO: Desestruture `ref` nos props e use useImperativeHandle abaixo
function InputCustomizado({ placeholder, rotulo }: InputCustomizadoProps) {
  const inputInterno = useRef<HTMLInputElement>(null)

  // TODO: useImperativeHandle(ref, () => ({
  //   focus: () => inputInterno.current?.focus(),
  //   limpar: () => { ... },
  //   selecionarTudo: () => inputInterno.current?.select(),
  // }))

  return (
    <div>
      {rotulo && (
        <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: 4 }}>
          {rotulo}
        </label>
      )}
      <input
        ref={inputInterno}
        placeholder={placeholder}
        style={{
          border: '2px solid #3b82f6',
          borderRadius: 8,
          padding: '8px 12px',
          background: '#0f172a',
          color: '#e2e8f0',
          fontSize: '0.875rem',
          outline: 'none',
          width: '100%',
          maxWidth: 280,
        }}
      />
    </div>
  )
}

export function Desafio() {
  // TODO: troque `any` por `MétodosExpostos` quando terminar
  const inputRef = useRef<any>(null)
  const [status, setStatus] = useState('Aguardando ação...')

  return (
    <div className="card">
      <h3>Desafio: useImperativeHandle (React 19)</h3>

      <div className="info-box desafio">
        <strong>Missão:</strong> Faça os botões funcionarem expondo métodos customizados
        via <code>useImperativeHandle</code>.
        <br /><br />
        <strong>React 19:</strong> <code>ref</code> agora é uma prop normal — sem{' '}
        <code>forwardRef</code>! Basta tipá-la em <code>InputCustomizadoProps</code> e
        passar para o componente normalmente.
      </div>

      <div className="demo-area">
        <InputCustomizado
          ref={inputRef}
          rotulo="Campo controlado pelo pai via ref:"
          placeholder="Digite algo aqui..."
        />

        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <button onClick={() => { inputRef.current?.focus(); setStatus('focus() chamado!') }}>
            Focar
          </button>
          <button onClick={() => { inputRef.current?.limpar(); setStatus('limpar() chamado!') }}>
            Limpar
          </button>
          <button onClick={() => { inputRef.current?.selecionarTudo?.(); setStatus('selecionarTudo() chamado!') }}>
            Selecionar Tudo (bônus)
          </button>
        </div>

        <p style={{ marginTop: 10, fontSize: '0.8rem', color: '#94a3b8' }}>
          Status: <span style={{ color: '#22c55e' }}>{status}</span>
        </p>
      </div>

      <details style={{ marginTop: 16 }}>
        <summary style={{ cursor: 'pointer', color: '#64748b', fontSize: '0.82rem' }}>
          Ver solução
        </summary>
        <pre style={{
          background: '#0f172a', borderRadius: 8, padding: 16, marginTop: 8,
          fontSize: '0.78rem', color: '#94a3b8', overflow: 'auto',
        }}>
{`// React 19: ref é prop normal, sem forwardRef!

type InputCustomizadoProps = {
  placeholder?: string
  rotulo?: string
  ref?: React.Ref<MétodosExpostos>   // ← só isso
}

function InputCustomizado({ placeholder, rotulo, ref }: InputCustomizadoProps) {
  const inputInterno = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => inputInterno.current?.focus(),
    limpar: () => {
      if (inputInterno.current) inputInterno.current.value = ''
      inputInterno.current?.focus()
    },
    selecionarTudo: () => inputInterno.current?.select(),
  }))

  return (
    <div>
      {rotulo && <label>{rotulo}</label>}
      <input ref={inputInterno} placeholder={placeholder} ... />
    </div>
  )
}

// No pai — funciona diretamente:
const inputRef = useRef<MétodosExpostos>(null)
<InputCustomizado ref={inputRef} ... />`}
        </pre>
      </details>
    </div>
  )
}
