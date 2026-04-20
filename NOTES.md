## Workshop programação avançada em React.js

Baseado no livro "Advanced React" por Nadia Makarevich

## Tópicos abordados

1. Introdução a re-renderização (30 min.)

Iremos falar sobre problemas comuns que degradam a performance de aplicações em React.

- Por que a performance importa?
  App lento = usuário frustrado que abandona a página. Estudos do Google mostram que cada 100ms a mais de carregamento derruba conversão. E não é só UX: performance ruim queima bateria, gasta dados móveis e exclui quem usa hardware mais antigo.

- Por que é tão fácil destruir a performance de um frontend escrito em React?
  React é declarativo e "esconde" o custo real do que você escreve. Um componente inocente pode disparar centenas de re-renderizações em cascata sem aviso. A API é tão amigável que você cai em armadilhas sem perceber, até a aplicação travar.

- Como começar a masterizar o modelo mental dos ciclos de vida de um componente, deixar de ser leigo em relação a como as re-renderizações se propagam pela aplicação
  Pense em re-renderização como uma onda: começa num componente e desce pela árvore inteira por padrão. Não é o DOM que re-renderiza, é a função do componente que executa de novo. Entender quando e por que essa função roda é o que separa quem chuta de quem resolve.

## Exemplo 1

```tsx
export const App = () => {
  const [isOpen, setIsOpen] = React.useState(false) /* Mudanças nesse estado,
                                                      re-renderizam todo o componente
                                                      e seus children 
                                                      <VerySlowComponent/> &
                                                      <BunchOfStuff/> */

  return (
    <div className="flex flex-col gap-8 p-8">
      <Button className="w-fit" onClick={() => setIsOpen(true)}>
        Abrir modal
      </Button>
      {isOpen && <ModalDialog onClose={() => setIsOpen(false)} />}
      <VerySlowComponent /> {/* Aqui, se esses dois componentes demoram 
                              pra re-renderizar, cada vez que `isOpen` mudar
                              no App eles também atrasarão a abertura do modal */}
      <BunchOfStuff />
    </div>
  )
}
```

Você pode pensar, hm... por que só não colocar VerySlowComponent e BunchOfStuff em React.memo() ?
Porém, `React.memo()` só ajuda quando as props ficam estáveis, não resolve a causa do problema: o estado do modal continua alto demais na árvore.
Além disso, `React.memo()` também tem overhead, porque o React precisa comparar props a cada render para decidir se reaproveita ou não o resultado anterior.
O jeito mais robusto de resolver isso é mover o estado para mais perto do modal, isolando a re-renderização sem depender dessa comparação extra.

```tsx
const SettingsButton = () => {
  const [isOpen, setIsOpen] = React.useState(false) // estado fica perto de quem realmente usa

  return (
    <>
      <Button className="w-fit" onClick={() => setIsOpen(true)}>
        Abrir modal
      </Button>

      {isOpen && (
        <ModalDialog
          onClose={() => setIsOpen(false)} // só este trecho participa do abrir/fechar
        />
      )}
    </>
  )
}

export const App = () => {
  return (
    <div className="flex flex-col gap-8 p-8">
      <SettingsButton /> {/* estado isolado: o modal não puxa a página inteira */}
      <VerySlowComponent /> {/* pesado, mas fora do ciclo de render do modal */}
      <BunchOfStuff />
    </div>
  )
}
```

Esse padrão é conhecido como `moving state down`: em vez de deixar o estado no componente pai, você o move para o ponto mais baixo possível da árvore.
Com isso, a re-renderização fica mais localizada, previsível e barata.
O ganho não vem de "otimizar" o React com memoização, mas de modelar melhor a fronteira de responsabilidade dos componentes.

## Exemplo 2

```tsx
// apenas uma aproximação hard-coded para demonstrar o problema de re-renders
// não deve ser usado em código real
function getPosition(val: number) {
  return 150 - val / 2
}

export const App = () => {
  const [position, setPosition] = React.useState(150) /* Mudanças nesse estado,
                                                      re-renderizam todo o componente
                                                      e seus children 
                                                      <VerySlowComponent/> &
                                                      <BunchOfStuff/> */ 

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
```

Para solucionar neste caso, não é tão simples quanto o exemplo anterior, que poderiamos simplesmente mover o useState para o componente filho (Modal), pois a <div/> pai utiliza a função `onScroll`

Então neste caso precisamos usar um truque pra resolver isso, criar um componente que embrulhe o resto dos componentes pesados, utilizando as `props` pra renderizar eles.

```tsx
const MovingBlock = ({ position }: { position: number }) => (
  <Badge
    className="fixed left-[27rem] w-12 h-4" style={{ top: position }}>
    {position}
  </Badge>
);

// apenas uma aproximação hard-coded para demonstrar o problema de re-renders
// não deve ser usado em código real
function getPosition(val: number) { return 150 - val / 2 }

// Este componente faz com que os elementos/componentes que fore passados para dentro dele (composition) sejam renderizados independetemente, sem fazer com que eles tenham que re-renderizar quando um estado pertencente a esse componente mudar.
const ScrollableAreaWithMovingBlock = ({ children }: { children: React.ReactNode }) => {
  const [position, setPosition] = React.useState(150);

  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    // calcula a posição com base no valor de scroll
    const calculated = getPosition(e.currentTarget.scrollTop);
    // salva no estado
    setPosition(calculated);
  };

  return (
    <div
      className="w-[30rem] h-[10rem] border border-gray-500/50 z-[1] overflow-auto"
      onScroll={onScroll}
    >
      <MovingBlock position={position} />
      {children}
    </div>
  )
}

export const App = () => {
  return (
    <main className="container mx-auto">
      <ScrollableAreaWithMovingBlock>
        {/* Esses componentes agora serão renderizados apenas uma vez. */}
        <VerySlowComponent />
        <BunchOfStuff />
      </ScrollableAreaWithMovingBlock>
    </main >
  );
}
```

Mas isso não faz sentido nenhum? Isso não contradiz o modelo de arvore de componentes do react?
O react não deveria sempre re-renderizar todos os componentes abaixo na arvore de componentes?
Por que <VerySlowComponent/> e <BunchOfStuff/> não são mais re-renderizados?

Não. O React re-renderiza os componentes que ele mesmo instancia no JSX. Com compososição, quem instancia
<VerySlowComponent /> e <BunchOfStuff /> é <App /> (não <ScrollableAreaWithMovingBlock />). Eles são passados como
`children` — uma prop que não muda quando `position` muda. Props iguais = sem re-renderização. Então não importa se essas props aqui são na verdade outros componentes, pro react, são outro tipo de atributos dessa instancia de componente, que não são adicionados a árvore de componente do <ScrollableAreaWithMovingBlock />

2. Render props e memoização (30 min.)

No Tópico 1 resolvemos re-renders com a ferramenta mais barata: arquitetura (mover state pra baixo, isolar por composição). Agora vamos ver as duas ferramentas avançadas que entram quando arquitetura sozinha não resolve: **render props** (Cap. 4 do livro) para flexibilizar composição com dados compartilhados, e **memoização** (Cap. 5) para controlar re-renders onde a árvore de componentes não pode ser reescrita.

- Por que render props ainda importam num mundo de hooks?
  Hooks substituíram a maioria dos usos de render props para *compartilhar lógica*, mas não todos. Render props continuam sendo a resposta certa quando o que você quer compartilhar é **comportamento de renderização com dados internos que variam por consumidor**. Exemplos clássicos: um componente que rastreia posição do mouse e entrega o valor pra quem consumir desenhar o que quiser; um `<Hover>` que expõe `isHovered`; um sistema de formulário que entrega `register` e `errors` por campo (o React Hook Form faz isso). Hook não resolve quando a lógica precisa estar casada com um ponto específico da árvore JSX do consumidor.

- Memoização não é "só colocar `React.memo`"
  `React.memo` compara props por referência (shallow equality). Se você passa `onClick={() => ...}` ou `items={[...]}` inline, toda render do pai cria referência nova — `memo` sempre vê props "diferentes" e não ajuda em nada. Memoização funcional exige uma **cadeia inteira estável**: o pai não re-renderiza ao toa (ou foi ele mesmo memoizado), e todas as props não-primitivas (funções, objetos, arrays) vêm envelopadas em `useCallback` / `useMemo`. Quebrar um elo da cadeia invalida tudo.

- Reconciliação, em uma frase (pra justificar o `.map` do file tree)
  Em cada render, React compara a árvore nova com a antiga *na mesma posição*; mesmo `type` no mesmo lugar = mesma instância, state preservado. Em listas, `key` substitui a posição como identificador. Por isso no `.map` de `children` do file tree a gente usa `key={file.name}` — o nome é estável e único naquele nível.

## Exemplo 3

O desafio interativo do dia: construir recursivamente um file tree no estilo do VS Code. Starter em `src/challenge/recursive-file-tree.tsx` renderiza só "Home"; final em `src/challenge/recursive-file-tree.final.tsx`.

```tsx
// versão final — src/challenge/recursive-file-tree.final.tsx
type FileNode = { name: string; children?: Array<FileNode> }

export const File = ({ file }: { file: FileNode }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const CaretIcon = isOpen ? CaretRightIcon : CaretDownIcon

  if (file.children) {
    return (
      <li className="my-1.5">
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
    <li className="my-1.5">
      <span className="flex items-center gap-1.5">
        <FileIcon className="size-6 text-slate-500" />
        {file.name}
      </span>
    </li>
  )
}
```

Dois pontos pra comentar enquanto codamos isso:

1. Cada `<File />` tem seu próprio `useState`. Numa árvore com 50 pastas são 50 hooks — **não** é problema. State local é barato e, principalmente, está no nível certo: quem sabe se está aberto ou fechado é a própria pasta.

2. A `key={child.name}` é o que faz o React preservar `isOpen` entre renders do pai. Tem um arquivo `recursive-file-tree.reconciliation.tsx` que troca isso por `key={Math.random()}`: um botão no topo dispara re-render e toda a árvore colapsa. Demo de 30 segundos se sobrar tempo — não é o foco da aula.

## Exemplo 4 — Render props

Voltando ao Exemplo 2 do Tópico 1: criamos `ScrollableAreaWithMovingBlock` para isolar o re-render do `position`. Mas repare que a lógica de scroll está *amarrada* ao `<MovingBlock />` — se amanhã eu quiser mostrar o position num `Badge`, num gráfico, ou numa barra de progresso, preciso escrever outro wrapper. A lógica é reutilizável; o que renderiza com ela, não.

Render props resolvem isso passando uma **função como children** (ou como prop nomeada), e essa função recebe o dado interno do componente:

```tsx
// Componente de plataforma: só carrega a lógica de scroll+position
const ScrollableArea = ({
  children
}: {
  children: (position: number) => React.ReactNode
}) => {
  const [position, setPosition] = React.useState(150)

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setPosition(getPosition(e.currentTarget.scrollTop))
  }

  return (
    <div
      className="w-120 h-40 border border-gray-500/50 overflow-auto"
      onScroll={onScroll}
    >
      {children(position)}
    </div>
  )
}

// Consumidor decide o que fazer com o `position`
export const App = () => (
  <main className="container mx-auto">
    <ScrollableArea>
      {(position) => (
        <>
          <MovingBlock position={position} />
          <VerySlowComponent />
          <BunchOfStuff />
        </>
      )}
    </ScrollableArea>
  </main>
)
```

"Mas isso é só um custom hook disfarçado, não?" Quase. A diferença está em *onde* o state vive. Com hook, o state vive no componente que chama o hook — se você precisa que o state esteja isolado num ponto específico da árvore (pra não propagar re-renders pra cima), render props te dão esse controle. O padrão combina os dois mundos: a lógica é reutilizável como num hook, mas o state fica encapsulado como num componente.

Quando usar cada um?

- **Custom hook**: lógica precisa de state ou efeitos, mas *onde* ele fica na árvore não importa (qualquer consumidor aguenta o re-render).
- **Render prop**: a lógica gera state que re-renderiza, e você precisa que esse re-render fique confinado a um ponto específico da árvore.
- **Children as component** (padrão do Tópico 1): não precisa expor dado interno; só quer aceitar conteúdo arbitrário.

Render props dominavam a community em 2017-2018 (React Router v4, Downshift, Formik antigo). Hoje boa parte dos casos virou hook, mas bibliotecas sérias ainda usam o padrão onde a garantia de isolamento é necessária.

## Exemplo 5 — Memoização

Começando com o anti-padrão mais comum. Código "otimizado" que não otimiza nada:

```tsx
const ExpensiveChild = React.memo(({ onClick, config }: Props) => {
  // ... componente pesado
})

export const App = () => {
  const [count, setCount] = React.useState(0)

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <ExpensiveChild
        onClick={() => console.log("hi")} // 🔴 função nova todo render
        config={{ theme: "dark" }}        // 🔴 objeto novo todo render
      />
    </>
  )
}
```

Cada clique no botão re-renderiza `App`. Na re-render, a função `onClick` e o objeto `config` são recriados — referências novas. `React.memo` faz shallow comparison, vê `prevProps.onClick !== nextProps.onClick`, e decide "props mudaram, vou re-renderizar". `ExpensiveChild` re-renderiza do mesmo jeito, só que agora com o overhead extra da comparação.

Consertando a cadeia:

```tsx
const ExpensiveChild = React.memo(({ onClick, config }: Props) => { /* ... */ })

export const App = () => {
  const [count, setCount] = React.useState(0)

  const handleClick = React.useCallback(() => console.log("hi"), [])
  const config = React.useMemo(() => ({ theme: "dark" }), [])

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <ExpensiveChild onClick={handleClick} config={config} />
    </>
  )
}
```

`useCallback` e `useMemo` devolvem a mesma referência entre renders enquanto as deps não mudam. Agora a comparação de `React.memo` passa e `ExpensiveChild` é pulado. Três observações importantes:

1. **A cadeia quebra se você esquecer qualquer prop.** Se `ExpensiveChild` também recebesse `style={{ color: "red" }}` inline, tudo voltaria a re-renderizar. Memoização é tudo-ou-nada por componente.

2. **Memoização não é grátis.** `useMemo` e `useCallback` salvam a referência no closure do hook, e `React.memo` roda a shallow comparison em toda render do pai. Pra componentes pequenos, o custo da comparação pode passar do custo do re-render que você queria evitar.

3. **Children-as-props (o padrão do Tópico 1) dispensa memoização.** Como o React compara os `children` passados de cima (referências estáveis, porque quem cria o elemento é quem está de fora), você pega o mesmo efeito de "pular re-render" sem precisar embrulhar nada em `useMemo`. Foi exatamente isso que fez `ScrollableAreaWithMovingBlock` funcionar sem nenhum `memo`.

A regra prática: arquitetura primeiro (Tópico 1 e render props), memoização por último, e sempre mediada por Profiler. Código cheio de `useCallback`/`useMemo` "por precaução" é anti-padrão — polui, atrapalha leitura, e na maioria das vezes não melhora nada mensurável.

## Armadilhas comuns

- **Componente definido dentro de outro componente.** Cada render do pai cria uma função nova, que para o React é um `type` diferente. Filhos desmontam e remontam todo render — state perdido, efeitos re-executados. Solução: mover pra fora.
- **`useCallback` com dependência instável.** Se a dep do `useCallback` é ela mesma recriada todo render (array, objeto), o callback também é. A otimização some silenciosamente. Ou memoiza a dep também, ou repensa a estrutura.
- **`key={index}` em lista que reordena, filtra ou remove do meio.** Key bate por posição — state e DOM grudam no lugar errado. Seguro só em listas estáticas.