import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type BasicModalDialogProps = {
  onClose: () => void
}

export const ModalDialog = ({ onClose }: BasicModalDialogProps) => {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar item</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar um novo item.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="field-name" className="text-sm font-medium">
              Nome
            </label>
            <Input id="field-name" placeholder="Digite o nome" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onClose}>Criar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
