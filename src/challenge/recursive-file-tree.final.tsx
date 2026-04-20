import React from "react"
import {
  CaretDownIcon,
  CaretRightIcon,
  FileIcon,
  FolderIcon,
} from "@phosphor-icons/react"

type FileNode = {
  name: string
  children?: Array<FileNode>
}

const data: FileNode[] = [
  {
    name: "Home",
    children: [
      {
        name: "Filmes",
        children: [
          {
            name: "Ação",
            children: [
              {
                name: "Anos 2000",
                children: [
                  { name: "Velozes e Furiosos.mp4" },
                  { name: "Missão Impossível.mp4" },
                ],
              },
              {
                name: "Anos 2010",
                children: [
                  { name: "Mad Max - Fury Road.mp4" },
                  { name: "John Wick.mp4" },
                ],
              },
            ],
          },
          {
            name: "Comédia",
            children: [],
          },
        ],
      },
      {
        name: "Músicas",
        children: [],
      },
      {
        name: "Fotos",
        children: [],
      },
      {
        name: "Documentos",
        children: [
          { name: "contrato.pdf" },
          { name: "passwords.txt" },
        ],
      },
      {
        name: "Downloads",
        children: [],
      },
    ],
  },
]

export const File = ({ file }: { file: FileNode }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const CaretIcon = isOpen ? CaretRightIcon : CaretDownIcon

  if (file.children) {
    return (
      <li className="my-1.5" key={file.name}>
        <span className="flex items-center gap-1.5">
          <button onClick={() => setIsOpen(!isOpen)}>
            <CaretIcon className="size-4 text-slate-500" />
          </button>
          <FolderIcon weight="fill" className="size-6 text-sky-500" />
          {file.name}
        </span>

        {isOpen && (
          <ul className="pl-6">
            {file.children?.map((child) => (
              <File file={child} key={child.name} />
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <li className="my-1.5" key={file.name}>
      <span className="flex items-center gap-1.5">
        <FileIcon className="size-6 text-slate-500" />
        {file.name}
      </span>
    </li>
  )
}


export const RecursiveFileTree = () => {
  return (
    <main className="container mx-auto my-8">
      <ul className="pl-6">
        {data.map((file) => (
          <File file={file} key={file.name} />
        ))}
      </ul>
    </main>
  )
}
