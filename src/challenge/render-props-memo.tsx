import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ============================================================
// Desafio: Render Props & Memoização
//
// PARTE 1 — Render Props
// ScrollableAreaWithMovingBlock funciona, mas MovingBlock está
// hardcoded dentro dele. ProgressBar também quer usar `position`
// mas não tem acesso.
//
// TODO: Refatore ScrollableAreaWithMovingBlock para um ScrollableArea
// genérico usando render props. `children` deve ser uma função:
//   (position: number) => ReactNode
// Assim tanto MovingBlock quanto ProgressBar podem usar o position.
//
// PARTE 2 — Memoização
// ExpensiveChild está embrulhado em React.memo, mas re-renderiza
// toda vez que o contador muda. A memoização não está funcionando.
//
// TODO: Conserte a cadeia de memoização no componente pai.
// ============================================================

const wait = (ms: number) => {
  const start = Date.now()
  let now = start
  while (now - start < ms) now = Date.now()
}

// --- Componentes de visualização ---

const MovingBlock = ({ position }: { position: number }) => (
  <Badge className="fixed left-108 w-12 h-4" style={{ top: position }}>
    {position}
  </Badge>
)

// ProgressBar está definido mas não é usado — ScrollableAreaWithMovingBlock
// não expõe `position` para o consumidor
const ProgressBar = ({ position }: { position: number }) => {
  const pct = Math.min(100, Math.max(0, ((150 - position) / 150) * 100))
  return (
    <div className="w-full mb-2">
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="h-2 bg-blue-500 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{Math.round(pct)}%</span>
    </div>
  )
}

const ScrollContent = () => (
  <div className="p-4 space-y-4">
    {Array.from({ length: 20 }, (_, i) => (
      <p key={i} className="text-sm text-muted-foreground">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Linha {i + 1}.
      </p>
    ))}
  </div>
)

function getPosition(val: number) { return 150 - val / 2 }

// TODO: Este componente amarra MovingBlock internamente.
// Refatore para aceitar children como render prop: (position) => ReactNode
const ScrollableAreaWithMovingBlock = ({ children }: { children: React.ReactNode }) => {
  const [position, setPosition] = React.useState(150)

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setPosition(getPosition(e.currentTarget.scrollTop))
  }

  return (
    <div
      className="w-120 h-40 border border-gray-500/50 z-1 overflow-auto"
      onScroll={onScroll}
    >
      <MovingBlock position={position} />
      {children}
    </div>
  )
}

// --- Parte 2: Memoização ---

// React.memo embrulha o componente, mas será que está funcionando?
const ExpensiveChild = React.memo(({ onClick, config }: {
  onClick: () => void
  config: { theme: string }
}) => {
  wait(500)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Componente Caro</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">theme: {config.theme}</p>
        <Button variant="outline" className="mt-2" onClick={onClick}>
          Ação
        </Button>
      </CardContent>
    </Card>
  )
})

// --- Componente principal ---

export const RenderPropsMemo = () => {
  const [count, setCount] = React.useState(0)

  return (
    <main className="container mx-auto my-8 flex flex-col gap-12">
      <section>
        <h2 className="text-xl font-bold mb-4">Parte 1 — Render Props</h2>
        <ScrollableAreaWithMovingBlock>
          {/* TODO: ProgressBar precisa do position mas não tem acesso.
              Refatore ScrollableAreaWithMovingBlock usando render props. */}
          <ScrollContent />
        </ScrollableAreaWithMovingBlock>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Parte 2 — Memoização</h2>
        <div className="flex flex-col gap-4">
          <Button className="w-fit" onClick={() => setCount(c => c + 1)}>
            Contador: {count}
          </Button>
          {/* TODO: ExpensiveChild re-renderiza a cada clique. Por quê?
              Dica: olhe as props passadas abaixo. */}
          <ExpensiveChild
            onClick={() => console.log("ação executada")}
            config={{ theme: "dark" }}
          />
        </div>
      </section>
    </main>
  )
}
