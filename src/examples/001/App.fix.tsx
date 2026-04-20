import React from "react"
import { Button } from "@/components/ui/button"
import { VerySlowComponent } from "./very-slow-component"
import { BunchOfStuff } from "./mocks"
import { ModalDialog } from "./basic-modal-dialog"

const SettingsModal = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <Button className="w-fit" onClick={() => setIsOpen(true)}>
        Abrir modal
      </Button>
      {isOpen && <ModalDialog onClose={() => setIsOpen(false)} />}
    </>
  )
}

export const App = () => {
  return (
    <div className="flex flex-col gap-8 p-8">
      <SettingsModal />
      <VerySlowComponent />
      <BunchOfStuff />
    </div>
  )
}
