import React from "react"

import { BunchOfStuff } from './mocks';
import { VerySlowComponent } from './very-slow-component';
import { Badge } from "@/components/ui/badge";

const MovingBlock = ({ position }: { position: number }) => (
  <Badge
    className="fixed left-[27rem] w-12 h-4" style={{ top: position }}>
    {position}
  </Badge>
);

// apenas uma aproximação hard-coded para demonstrar o problema de re-renders
// não deve ser usado em código real
function getPosition(val: number) { return 150 - val / 2 }

export const App = () => {
  const [position, setPosition] = React.useState(150);

  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    // calcula a posição com base no valor de scroll
    const calculated = getPosition(e.currentTarget.scrollTop);
    // salva no estado
    setPosition(calculated);
  };

  return (
    <main className="container mx-auto">
      <div
        className="w-[30rem] h-[10rem] border border-gray-500/50 z-[1] overflow-auto"
        onScroll={onScroll}
      >
        {/* passa o valor da posição para o novo componente movable */}
        <MovingBlock position={position} />
        <VerySlowComponent />
        <BunchOfStuff />
      </div>
    </main>
  );
}
