import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { App } from "@/examples/001/App"
// import { App } from "@/examples/001/App.fix"
// import { App } from "@/examples/001/App.context"
// import { App } from "@/examples/001/App.atom"
// import { App } from "@/examples/002/App"
// import { App } from "@/examples/002/App.fix"
// import { RecursiveFileTree } from "./challenge/recursive-file-tree"
// import { RecursiveFileTree } from "./challenge/recursive-file-tree.final"
// import { RecursiveFileTree } from "./challenge/recursive-file-tree.reconciliation"
// import { RenderPropsMemo } from "./challenge/render-props-memo"
// import { RenderPropsMemo } from "./challenge/render-props-memo.final"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    {/* <RecursiveFileTree /> */}
    {/* <RenderPropsMemo /> */}
  </StrictMode>,
)
