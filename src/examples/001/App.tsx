import React from "react"
import { Button } from "@/components/ui/button"
import { VerySlowComponent } from "./very-slow-component"
import { BunchOfStuff } from "./mocks"
import { ModalDialog } from "./basic-modal-dialog"

export const App = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-8 p-8">
      <Button className="w-fit" onClick={() => setIsOpen(true)}>
        Abrir modal
      </Button>
      {isOpen && <ModalDialog onClose={() => setIsOpen(false)} />}
      <VerySlowComponent />
      <BunchOfStuff />
    </div>
  )
}
