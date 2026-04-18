import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const wait = (ms: number) => {
  const start = Date.now()
  let now = start
  while (now - start < ms) now = Date.now()
}

export const VerySlowComponent = () => {
  wait(500)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seção Pesada A</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {["Item 1", "Item 2", "Item 3"].map((item) => (
            <div key={item} className="flex items-center justify-between rounded-md border px-3 py-2">
              <span className="text-sm">{item}</span>
              <Badge variant="secondary">sim</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}