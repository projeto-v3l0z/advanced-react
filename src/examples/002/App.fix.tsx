import React from "react"

import { BunchOfStuff } from './mocks';
import { VerySlowComponent } from './very-slow-component';
import { Badge } from "@/components/ui/badge";

const MovingBlock = ({ position }: { position: number }) => (
  <Badge
    className="fixed left-108 w-12 h-4" style={{ top: position }}>
    {position}
  </Badge>
);

// apenas uma aproximação hard-coded para demonstrar o problema de re-renders
// não deve ser usado em código real
function getPosition(val: number) { return 150 - val / 2 }

const ScrollableAreaWithMovingBlock = ({ children }: { children: React.ReactNode }) => {
  const [position, setPosition] = React.useState(150);

  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    // calcula a posição com base no valor de scroll
    const calculated = getPosition(e.currentTarget.scrollTop);
    // salva no estado
    setPosition(calculated);
  };

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

export const App = () => {
  return (
    <main className="container mx-auto">
      {/* passa o valor da posição para o novo componente movable */}
      <ScrollableAreaWithMovingBlock>
        <VerySlowComponent />
        <BunchOfStuff />
      </ScrollableAreaWithMovingBlock>
    </main >
  );
}

