import { useCallback, useRef, useState } from 'react'

// -------------------------------------------------------------------
// DESAFIO FINAL: Implemente um hook useDebounce sem stale closures
// -------------------------------------------------------------------
//
// CONTEXTO:
//   Debounce é uma técnica que adia a execução de uma função até que
//   o usuário pare de acionar eventos por um período (ex: parar de digitar).
//   É essencial para evitar chamadas excessivas à API.
//
// O PROBLEMA DE STALE CLOSURE:
//   Se você implementar com useCallback(fn, [delay]), toda vez que
//   `callback` mudar, o timeout anterior é descartado e um novo é criado.
//   Se implementar com useCallback(fn, []), a callback interna fica velha.
//
// A SOLUÇÃO (padrão com Refs):
//   1. Guarde o ID do timeout em um ref (não no estado)
//   2. Guarde a callback mais recente em um ref (sincronize em todo render)
//   3. O debounce usa callbackRef.current — sempre atual, sem deps extras
//
// TAREFAS:
//   [ ] Complete a função useDebounce abaixo
//   [ ] A função retornada deve disparar callback apenas após `delay` ms de inatividade
//   [ ] Verifique: "Chamadas à API" deve crescer lentamente mesmo digitando rápido
// -------------------------------------------------------------------

function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number): T {
  // Ref para sempre ter a versão mais recente da callback (evita stale closure)
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  // Ref para guardar o ID do timeout entre renders
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return useCallback((..._args: Parameters<T>) => {
    // TODO: Cancele o timeout anterior se existir
    // TODO: Crie um novo timeout que chame callbackRef.current(..._args) após `delay` ms
  }, [delay]) as T
}

// -------------------------------------------------------------------
// Componente que usa o hook — não mexa aqui durante o desafio
// -------------------------------------------------------------------

type Resultado = { id: number; titulo: string }

function buscarNaApi(query: string): Resultado[] {
  if (!query.trim()) return []
  return [
    { id: 1, titulo: `Resultado para "${query}" #1` },
    { id: 2, titulo: `Resultado para "${query}" #2` },
    { id: 3, titulo: `Resultado para "${query}" #3` },
  ]
}

export function Desafio() {
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [chamadas, setChamadas] = useState(0)
  const [ultimaBusca, setUltimaBusca] = useState('')

  const buscar = useDebounce((valor: string) => {
    setChamadas(c => c + 1)
    setUltimaBusca(valor)
    setResultados(buscarNaApi(valor))
  }, 500)

  return (
    <div className="card">
      <h3>Desafio Final: Hook useDebounce com Refs</h3>

      <div className="info-box desafio">
        <strong>Missão:</strong> Complete a função <code>useDebounce</code> no código
        acima. A busca deve disparar apenas <strong>500ms após parar de digitar</strong>.
        <br /><br />
        Dica: <code>clearTimeout(timerRef.current)</code> + <code>setTimeout(...)</code> +{' '}
        <code>callbackRef.current(...args)</code>
      </div>

      <div className="demo-area">
        <input
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            buscar(e.target.value)
          }}
          placeholder="Digite para buscar..."
        />

        <div style={{ display: 'flex', gap: 24, marginTop: 12 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>
              Chamadas à API
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: chamadas > 10 ? '#ef4444' : '#22c55e' }}>
              {chamadas}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              {chamadas > 10 ? 'Sem debounce?' : 'Bom!'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>
              Última busca
            </div>
            <code style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
              "{ultimaBusca || '...'}"
            </code>
          </div>
        </div>

        {resultados.length > 0 && (
          <div style={{ marginTop: 12 }}>
            {resultados.map(r => (
              <div key={r.id} style={{
                padding: '6px 10px', background: '#0f172a', borderRadius: 6,
                marginBottom: 4, fontSize: '0.82rem', color: '#94a3b8',
              }}>
                {r.titulo}
              </div>
            ))}
          </div>
        )}
      </div>

      <details style={{ marginTop: 16 }}>
        <summary style={{ cursor: 'pointer', color: '#64748b', fontSize: '0.82rem' }}>
          Ver solução
        </summary>
        <pre style={{
          background: '#0f172a', borderRadius: 8, padding: 16, marginTop: 8,
          fontSize: '0.78rem', color: '#94a3b8', overflow: 'auto',
        }}>
{`function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const callbackRef = useRef(callback)
  callbackRef.current = callback   // sempre atualizado

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return useCallback((...args: Parameters<T>) => {
    // Cancela o timeout anterior
    if (timerRef.current) clearTimeout(timerRef.current)

    // Agenda nova execução
    timerRef.current = setTimeout(() => {
      callbackRef.current(...args)   // versão atual da callback
    }, delay)
  }, [delay]) as T
}

// Por que funciona sem stale closure?
// - timerRef guarda o ID entre renders sem custo de re-render
// - callbackRef.current sempre aponta para a callback mais recente
// - O useCallback depende apenas de delay — estável na maioria dos casos`}
        </pre>
      </details>
    </div>
  )
}
