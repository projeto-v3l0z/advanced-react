import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const wait = (ms: number) => {
  const start = Date.now()
  let now = start
  while (now - start < ms) now = Date.now()
}

export const BunchOfStuff = () => {
  wait(300)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Outro Conteúdo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {["Row A", "Row B", "Row C"].map((item) => (
            <div key={item} className="flex items-center justify-between rounded-md border px-3 py-2">
              <span className="text-sm">{item}</span>
              <Badge variant="outline">{item.slice(-1)}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}