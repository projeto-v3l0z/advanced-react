import { FolderIcon } from "@phosphor-icons/react"

export const RecursiveFileTree = () => {
  return (
    <main className="container mx-auto my-8">
      <ul>
        <li className="my-1.5">
          <span className="flex items-center gap-1.5">
            <FolderIcon weight="fill" className="size-6 text-sky-500" />
            Home
          </span>
        </li>
      </ul>
    </main>
  )
}
