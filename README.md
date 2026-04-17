# Workshop: React Avançado

Workshop prático de ~2 horas sobre conceitos avançados do React, baseado no livro *Advanced React* de Nadia Makarevich.

## Pré-requisitos

- Node.js 18+
- Conhecimento básico de React (useState, useEffect)

## Como começar

```bash
git clone <url-do-repo>
cd advanced-react
npm install
npm run dev
```

## Fluxo de trabalho

1. Abra `src/App.tsx` e descomente a linha do módulo que você quer trabalhar
2. Salve — o Vite recarrega automaticamente
3. Leia o `README.md` do módulo (opcional, mas recomendado)
4. Abra o `Desafio.tsx` do módulo e siga os comentários `// TODO`
5. Observe o resultado no navegador — há indicadores visuais de sucesso (verde = ok)
6. Travou? Consulte `src/solutions/<módulo>/` — só olhe se precisar

> **Dica:** em `src/App.tsx`, cada linha de import tem `as Modulo` — só uma pode estar
> descomentada de cada vez. O TypeScript avisa se você esquecer de comentar a anterior.

## Módulos

| # | Tema | Duração | Pasta |
|---|------|---------|-------|
| 1 | Re-renders e Composição | 30 min | `src/workshop/01-rerenders/` |
| 2 | Memoização | 30 min | `src/workshop/02-memoizacao/` |
| 3 | Context e Refs | 25 min | `src/workshop/03-context-refs/` |
| 4 | Closures e Erros | 25 min | `src/workshop/04-closures-erros/` |

Cada módulo contém:
- `README.md` — conceito, objetivo e como verificar
- `Problema.tsx` — demo do comportamento problemático (para entender o que você vai corrigir)
- `Desafio.tsx` — **o arquivo que você edita**, com TODOs e feedback visual

As soluções ficam em `src/solutions/` — estrutura espelhada à de `src/workshop/`.
