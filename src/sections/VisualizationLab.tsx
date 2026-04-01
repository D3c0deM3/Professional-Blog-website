'use client'

import { startTransition, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TreeNode {
  value: number
  left: TreeNode | null
  right: TreeNode | null
  height: number
}

interface PositionedTreeNode {
  value: number
  depth: number
  x: number
  y: number
  height: number
  balance: number
}

interface TreeLayout {
  nodes: PositionedTreeNode[]
  edges: Array<{ from: number; to: number }>
  maxDepth: number
}

interface BalanceStep {
  root: TreeNode | null
  note: string
  active: number[]
}

const initialBstValues = [42, 20, 64, 11, 31, 53, 78]
const initialAvlValues = [50, 30, 20, 10, 70, 80]
const initialListValues = ['head', 'mid', 'tail']
const initialCycleValues = ['A', 'B', 'C', 'D']
const initialStackValues = ['base', 'frame-1', 'frame-2']
const initialQueueValues = ['req-1', 'req-2', 'req-3']
const initialGraphNodes = ['A', 'B', 'C', 'D', 'E']
const initialGraphEdges = [
  { source: 'A', target: 'B' },
  { source: 'A', target: 'D' },
  { source: 'B', target: 'C' },
  { source: 'C', target: 'E' },
]

const avlPresets = [
  { label: 'Skewed insert', values: [60, 50, 40, 30, 20, 10] },
  { label: 'Zig-zag insert', values: [40, 20, 30, 10, 25, 27] },
  { label: 'Wide insert', values: [70, 30, 90, 20, 10, 5, 95] },
]

function createNode(value: number): TreeNode {
  return { value, left: null, right: null, height: 1 }
}

function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null
  return {
    value: node.value,
    height: node.height,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  }
}

function heightOf(node: TreeNode | null) {
  return node?.height ?? 0
}

function balanceOf(node: TreeNode | null) {
  return node ? heightOf(node.left) - heightOf(node.right) : 0
}

function refreshTreeHeights(node: TreeNode | null): number {
  if (!node) return 0
  const left = refreshTreeHeights(node.left)
  const right = refreshTreeHeights(node.right)
  node.height = Math.max(left, right) + 1
  return node.height
}

function insertBst(root: TreeNode | null, value: number): TreeNode {
  if (!root) {
    return createNode(value)
  }

  if (value < root.value) {
    root.left = insertBst(root.left, value)
  } else if (value > root.value) {
    root.right = insertBst(root.right, value)
  }

  root.height = Math.max(heightOf(root.left), heightOf(root.right)) + 1
  return root
}

function buildBst(values: number[]) {
  let root: TreeNode | null = null
  values.forEach((value) => {
    root = insertBst(root, value)
  })
  return root
}

function countNodes(node: TreeNode | null): number {
  if (!node) return 0
  return 1 + countNodes(node.left) + countNodes(node.right)
}

function isBalancedTree(node: TreeNode | null): boolean {
  if (!node) return true
  const difference = Math.abs(heightOf(node.left) - heightOf(node.right))
  return difference <= 1 && isBalancedTree(node.left) && isBalancedTree(node.right)
}

function buildBalanceSteps(root: TreeNode | null): BalanceStep[] {
  const clonedRoot = cloneTree(root)
  if (!clonedRoot) {
    return []
  }

  refreshTreeHeights(clonedRoot)

  if (isBalancedTree(clonedRoot)) {
    return [{ root: clonedRoot, note: 'The current tree is already balanced.', active: [] }]
  }

  const pseudoRoot: TreeNode = {
    value: Number.MIN_SAFE_INTEGER,
    height: 1,
    left: null,
    right: clonedRoot,
  }

  const steps: BalanceStep[] = []
  const capture = (note: string, active: number[]) => {
    refreshTreeHeights(pseudoRoot.right)
    steps.push({
      root: cloneTree(pseudoRoot.right),
      note,
      active,
    })
  }

  let tail = pseudoRoot
  let rest = tail.right

  while (rest) {
    if (!rest.left) {
      tail = rest
      rest = rest.right
      continue
    }

    const lifted = rest.left
    if (!lifted) break

    rest.left = lifted.right
    lifted.right = rest
    tail.right = lifted
    rest = lifted
    capture(`Right rotation at ${lifted.right?.value} lifts ${lifted.value}.`, [lifted.value, lifted.right?.value ?? lifted.value])
  }

  const compress = (count: number) => {
    let scanner = pseudoRoot
    for (let index = 0; index < count; index += 1) {
      const child = scanner.right
      const grand = child?.right
      if (!child || !grand) break

      scanner.right = grand
      child.right = grand.left
      grand.left = child
      scanner = grand
      capture(`Left rotation at ${child.value} lifts ${grand.value}.`, [child.value, grand.value])
    }
  }

  const nodeCount = countNodes(pseudoRoot.right)
  let leaves = 2 ** Math.floor(Math.log2(nodeCount + 1)) - 1
  compress(nodeCount - leaves)

  while (leaves > 1) {
    leaves = Math.floor(leaves / 2)
    compress(leaves)
  }

  capture('Balanced structure ready.', [])
  return steps
}

function buildTreeLayout(root: TreeNode | null): TreeLayout {
  if (!root) {
    return { nodes: [], edges: [], maxDepth: 0 }
  }

  let order = 0
  let maxDepth = 0
  const nodes: Array<{ value: number; depth: number; order: number; height: number; balance: number }> = []
  const edges: Array<{ from: number; to: number }> = []

  const visit = (node: TreeNode | null, depth: number, parent?: number) => {
    if (!node) return

    visit(node.left, depth + 1, node.value)
    maxDepth = Math.max(maxDepth, depth)
    nodes.push({
      value: node.value,
      depth,
      order,
      height: node.height,
      balance: balanceOf(node),
    })
    order += 1
    if (parent !== undefined) {
      edges.push({ from: parent, to: node.value })
    }
    visit(node.right, depth + 1, node.value)
  }

  visit(root, 0)

  const orderBase = Math.max(nodes.length - 1, 1)
  const depthBase = Math.max(maxDepth, 1)

  return {
    maxDepth,
    edges,
    nodes: nodes.map((node) => ({
      value: node.value,
      depth: node.depth,
      height: node.height,
      balance: node.balance,
      x: nodes.length === 1 ? 0.5 : node.order / orderBase,
      y: maxDepth === 0 ? 0.5 : node.depth / depthBase,
    })),
  }
}

function parseNumericValue(input: string) {
  const value = Number(input.trim())
  if (!Number.isFinite(value)) return null
  return Math.round(value)
}

function normalizeToken(input: string, limit = 10) {
  return input.trim().slice(0, limit)
}

function normalizeGraphToken(input: string) {
  return normalizeToken(input.toUpperCase(), 3)
}

function removeFirstMatch(values: string[], target: string) {
  const index = values.findIndex((value) => value === target)
  if (index === -1) {
    return values
  }
  return [...values.slice(0, index), ...values.slice(index + 1)]
}

function signedNumber(value: number) {
  return value > 0 ? `+${value}` : `${value}`
}

function SurfacePanel({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn('algorithm-panel', className)}>{children}</div>
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="max-w-3xl space-y-4">
      <div className="algorithm-kicker">{eyebrow}</div>
      <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
        {title}
      </h1>
      <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">{description}</p>
    </div>
  )
}

function BinaryTreeCanvas({
  root,
  highlightValues,
  variant,
  className,
}: {
  root: TreeNode | null
  highlightValues: number[]
  variant: 'bst' | 'avl'
  className?: string
}) {
  const layout = buildTreeLayout(root)

  if (!layout.nodes.length) {
    return (
      <div className={cn('flex min-h-[320px] items-center justify-center rounded-[1.4rem] text-sm text-slate-500 dark:text-slate-400', className)}>
        Add values to generate the tree structure.
      </div>
    )
  }

  const positions = new Map(
    layout.nodes.map((node) => [
      node.value,
      {
        x: 10 + node.x * 80,
        y: layout.maxDepth === 0 ? 50 : 16 + node.y * 60,
      },
    ])
  )

  return (
    <div className={cn('algorithm-diagram relative overflow-hidden rounded-[1.4rem]', className)}>
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {layout.edges.map((edge) => {
          const from = positions.get(edge.from)
          const to = positions.get(edge.to)
          if (!from || !to) return null

          const active = highlightValues.includes(edge.from) || highlightValues.includes(edge.to)

          return (
            <motion.line
              key={`${edge.from}-${edge.to}`}
              initial={false}
              animate={{
                x1: from.x,
                y1: from.y,
                x2: to.x,
                y2: to.y,
                strokeWidth: active ? 2.5 : 1.6,
                opacity: active ? 0.92 : 0.45,
              }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
              className={variant === 'avl' ? (active ? 'stroke-[#14b8a6]' : 'stroke-[rgba(153,246,228,0.45)]') : active ? 'stroke-[#0f766e] dark:stroke-[#5eead4]' : 'stroke-[rgba(30,41,59,0.3)] dark:stroke-[rgba(255,255,255,0.4)]'}
              strokeLinecap="round"
            />
          )
        })}

        {layout.nodes.map((node) => {
          const position = positions.get(node.value)
          if (!position) return null
          const isActive = highlightValues.includes(node.value)

          return (
            <g key={node.value}>
              {isActive && (
                <motion.circle
                  initial={false}
                  animate={{ cx: position.x, cy: position.y, r: 10.2, opacity: 0.22 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                  fill={variant === 'avl' ? '#5eead4' : '#99f6e4'}
                />
              )}
              <motion.circle
                initial={false}
                animate={{
                  cx: position.x,
                  cy: position.y,
                  r: isActive ? 7.8 : 7,
                }}
                transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                className={`${variant === 'avl' ? (isActive ? 'fill-[#14b8a6]' : 'fill-[#0f172a]') : isActive ? 'fill-[#0f766e] dark:fill-[#5eead4]' : 'fill-[#f8fafc] dark:fill-[#1e293b]'} ${variant === 'avl' ? 'stroke-[rgba(226,232,240,0.8)]' : 'stroke-[rgba(15,23,42,0.18)] dark:stroke-[rgba(255,255,255,0.2)]'}`}
                strokeWidth="1.6"
              />
              <motion.text
                initial={false}
                animate={{ x: position.x, y: position.y + 1.4 }}
                transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                fontSize="4"
                fontWeight="700"
                textAnchor="middle"
                className={variant === 'avl' ? 'fill-[#f8fafc]' : isActive ? 'fill-[#ecfeff]' : 'fill-[#0f172a] dark:fill-[#f8fafc]'}
              >
                {node.value}
              </motion.text>
              {variant === 'avl' && (
                <motion.text
                  initial={false}
                  animate={{ x: position.x, y: position.y + 11 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                  fontSize="2.8"
                  fontWeight="600"
                  textAnchor="middle"
                  fill="rgba(226, 232, 240, 0.82)"
                >
                  bf {signedNumber(node.balance)}
                </motion.text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function GraphCanvas({
  nodes,
  edges,
  activeNode,
  activeEdge,
}: {
  nodes: string[]
  edges: Array<{ source: string; target: string }>
  activeNode: string | null
  activeEdge: string | null
}) {
  if (!nodes.length) {
    return (
      <div className="flex h-[340px] items-center justify-center rounded-[1.5rem] border border-slate-200/80 bg-white/70 dark:bg-slate-800/70 dark:border-white/10 dark:bg-slate-900/40 text-sm text-slate-500 dark:text-slate-400">
        Add graph nodes to start the network.
      </div>
    )
  }

  const positions = new Map(
    nodes.map((node, index) => {
      const angle = -Math.PI / 2 + (index / nodes.length) * Math.PI * 2
      return [
        node,
        {
          x: 50 + Math.cos(angle) * 30,
          y: 50 + Math.sin(angle) * 30,
        },
      ]
    })
  )

  return (
    <div className="algorithm-diagram relative overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/70 dark:bg-slate-800/70 dark:border-white/10 dark:bg-slate-900/40">
      <motion.div
        aria-hidden
        className="absolute inset-6 rounded-full border border-dashed border-emerald-500/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      />
      <svg viewBox="0 0 100 100" className="relative h-[340px] w-full">
        {edges.map((edge) => {
          const from = positions.get(edge.source)
          const to = positions.get(edge.target)
          if (!from || !to) return null
          const edgeId = `${edge.source}-${edge.target}`

          return (
            <motion.line
              key={edgeId}
              initial={false}
              animate={{
                x1: from.x,
                y1: from.y,
                x2: to.x,
                y2: to.y,
                opacity: edgeId === activeEdge ? 1 : 0.46,
                strokeWidth: edgeId === activeEdge ? 2.4 : 1.6,
              }}
              transition={{ type: 'spring', stiffness: 160, damping: 18 }}
              className={edgeId === activeEdge ? 'stroke-[#0f766e] dark:stroke-[#5eead4]' : 'stroke-[rgba(15,23,42,0.34)] dark:stroke-[rgba(255,255,255,0.4)]'}
              strokeLinecap="round"
            />
          )
        })}

        {nodes.map((node) => {
          const point = positions.get(node)
          if (!point) return null
          const isActive = node === activeNode

          return (
            <g key={node}>
              <motion.circle
                initial={false}
                animate={{
                  cx: point.x,
                  cy: point.y,
                  r: isActive ? 7.4 : 6.6,
                }}
                transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                className={`${isActive ? 'fill-[#0f766e] dark:fill-[#5eead4]' : 'fill-[#f8fafc] dark:fill-[#1e293b]'} ${isActive ? 'stroke-[#ccfbf1] dark:stroke-[#14b8a6]' : 'stroke-[rgba(15,23,42,0.16)] dark:stroke-[rgba(255,255,255,0.2)]'}`}
                strokeWidth="1.6"
              />
              <motion.text
                initial={false}
                animate={{ x: point.x, y: point.y + 1.4 }}
                transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                fontSize="4.1"
                fontWeight="700"
                textAnchor="middle"
                className={isActive ? 'fill-[#ecfeff]' : 'fill-[#0f172a] dark:fill-[#f8fafc]'}
              >
                {node}
              </motion.text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function VisualizationLab() {
  const [bstValues, setBstValues] = useState(initialBstValues)
  const [bstInput, setBstInput] = useState('')
  const [bstHighlight, setBstHighlight] = useState<number[]>([initialBstValues.at(-1) ?? initialBstValues[0]])
  const [bstNote, setBstNote] = useState('Standard BST insertions preserve the ordering invariant.')

  const [avlValues, setAvlValues] = useState(initialAvlValues)
  const [avlInput, setAvlInput] = useState('')
  const [avlDisplayRoot, setAvlDisplayRoot] = useState<TreeNode | null>(() => buildBst(initialAvlValues))
  const [avlHighlight, setAvlHighlight] = useState<number[]>([])
  const [avlNote, setAvlNote] = useState('This panel starts from the raw insertion shape. Press Balance Tree to animate rotations.')

  const [listValues, setListValues] = useState(initialListValues)
  const [listInput, setListInput] = useState('')
  const [listHighlight, setListHighlight] = useState<string | null>(initialListValues.at(-1) ?? null)
  const [listNote, setListNote] = useState('Append at the tail to preserve the current order.')

  const [cycleValues, setCycleValues] = useState(initialCycleValues)
  const [cycleInput, setCycleInput] = useState('')
  const [cycleHighlight, setCycleHighlight] = useState<string | null>(initialCycleValues.at(-1) ?? null)
  const [cycleNote, setCycleNote] = useState('Circular links keep traversal moving back to the head.')

  const [stackValues, setStackValues] = useState(initialStackValues)
  const [stackInput, setStackInput] = useState('')
  const [stackHighlight, setStackHighlight] = useState<string | null>(initialStackValues.at(-1) ?? null)
  const [stackNote, setStackNote] = useState('Push adds to the top frame, while pop removes the most recent frame.')

  const [queueValues, setQueueValues] = useState(initialQueueValues)
  const [queueInput, setQueueInput] = useState('')
  const [queueHighlight, setQueueHighlight] = useState<string | null>(initialQueueValues[0] ?? null)
  const [queueNote, setQueueNote] = useState('Enqueue adds at the rear, and dequeue removes from the front.')

  const [graphNodes, setGraphNodes] = useState(initialGraphNodes)
  const [graphEdges, setGraphEdges] = useState(initialGraphEdges)
  const [graphNodeInput, setGraphNodeInput] = useState('')
  const [graphSourceInput, setGraphSourceInput] = useState('')
  const [graphTargetInput, setGraphTargetInput] = useState('')
  const [graphActiveNode, setGraphActiveNode] = useState<string | null>('E')
  const [graphActiveEdge, setGraphActiveEdge] = useState<string | null>('C-E')
  const [graphNote, setGraphNote] = useState('Graph growth repositions the topology while keeping existing edges intact.')

  const avlTimers = useRef<number[]>([])

  useEffect(() => {
    return () => {
      avlTimers.current.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  const bstRoot = buildBst(bstValues)

  const clearAvlTimers = () => {
    avlTimers.current.forEach((timer) => window.clearTimeout(timer))
    avlTimers.current = []
  }

  const resetAvlToRaw = (nextValues: number[], note?: string) => {
    clearAvlTimers()
    const rawRoot = buildBst(nextValues)
    setAvlValues(nextValues)
    setAvlDisplayRoot(rawRoot)
    setAvlHighlight([])
    setAvlNote(note ?? 'Tree reset to the raw insertion shape. Press Balance Tree to animate rotations.')
  }

  const handleBstInsert = () => {
    const value = parseNumericValue(bstInput)
    if (value === null) {
      setBstNote('Enter a valid integer before inserting into the tree.')
      return
    }
    if (bstValues.includes(value)) {
      setBstNote(`Value ${value} already exists, so the BST shape stays unchanged.`)
      return
    }

    const next = [...bstValues, value]
    setBstValues(next)
    setBstInput('')
    setBstHighlight([value])
    setBstNote(`Inserted ${value}; values smaller move left and larger move right.`)
  }

  const handleBstRemove = () => {
    const value = parseNumericValue(bstInput)
    if (value === null) {
      setBstNote('Enter the node value you want to remove from the BST.')
      return
    }
    if (!bstValues.includes(value)) {
      setBstNote(`Value ${value} is not present, so there is nothing to remove.`)
      return
    }

    const next = bstValues.filter((item) => item !== value)
    setBstValues(next)
    setBstInput('')
    setBstHighlight(next.at(-1) ? [next.at(-1) as number] : [])
    setBstNote(`Removed ${value}; the tree is rebuilt from the remaining insertion order.`)
  }

  const handleAvlInsert = () => {
    const value = parseNumericValue(avlInput)
    if (value === null) {
      setAvlNote('Enter a valid integer to add into the rotation demo.')
      return
    }
    if (avlValues.includes(value)) {
      setAvlNote(`Value ${value} already exists in the current insertion sequence.`)
      return
    }

    const next = [...avlValues, value]
    setAvlInput('')
    resetAvlToRaw(next, `Inserted ${value}. The raw BST shape is shown first, ready for balancing.`)
  }

  const handleAvlRemove = () => {
    const value = parseNumericValue(avlInput)
    if (value === null) {
      setAvlNote('Enter the integer you want removed from the balancing sequence.')
      return
    }
    if (!avlValues.includes(value)) {
      setAvlNote(`Value ${value} is not in the current tree.`)
      return
    }

    const next = avlValues.filter((item) => item !== value)
    setAvlInput('')
    resetAvlToRaw(next, `Removed ${value}. The raw insertion shape has been restored.`)
  }

  const handleAvlBalance = () => {
    clearAvlTimers()
    const rawRoot = buildBst(avlValues)
    const steps = buildBalanceSteps(rawRoot)

    if (!steps.length) {
      setAvlNote('Add values before running the balance animation.')
      return
    }

    if (steps.length === 1 && steps[0].note === 'The current tree is already balanced.') {
      setAvlDisplayRoot(steps[0].root)
      setAvlHighlight([])
      setAvlNote(steps[0].note)
      return
    }

    setAvlDisplayRoot(rawRoot)
    setAvlHighlight([])
    setAvlNote('Running a smooth rotation cascade to balance the current tree.')

    steps.forEach((step, index) => {
      const timer = window.setTimeout(() => {
        startTransition(() => {
          setAvlDisplayRoot(step.root)
          setAvlHighlight(step.active)
          setAvlNote(step.note)
        })
      }, index * 900)

      avlTimers.current.push(timer)
    })
  }

  const addToListFront = () => {
    const token = normalizeToken(listInput)
    if (!token) {
      setListNote('Enter a label to add to the front of the list.')
      return
    }
    const next = [token, ...listValues]
    setListValues(next)
    setListInput('')
    setListHighlight(token)
    setListNote(`Inserted ${token} at the head; every pointer shifts one step right.`)
  }

  const addToListBack = () => {
    const token = normalizeToken(listInput)
    if (!token) {
      setListNote('Enter a label to append to the linked list.')
      return
    }
    const next = [...listValues, token]
    setListValues(next)
    setListInput('')
    setListHighlight(token)
    setListNote(`Appended ${token} at the tail; the existing chain remains in order.`)
  }

  const removeFromList = () => {
    const token = normalizeToken(listInput)
    if (!token) {
      setListNote('Enter the node label you want removed from the linked list.')
      return
    }
    if (!listValues.includes(token)) {
      setListNote(`${token} is not in the current list.`)
      return
    }
    const next = removeFirstMatch(listValues, token)
    setListValues(next)
    setListInput('')
    setListHighlight(next.at(-1) ?? null)
    setListNote(`Removed ${token}; the chain reconnects around the missing node.`)
  }

  const addToCycle = () => {
    const token = normalizeToken(cycleInput, 6).toUpperCase()
    if (!token) {
      setCycleNote('Enter a short node label to add to the circular list.')
      return
    }
    const next = [...cycleValues, token]
    setCycleValues(next)
    setCycleInput('')
    setCycleHighlight(token)
    setCycleNote(`Inserted ${token}; the tail now routes back to the head through the new node.`)
  }

  const removeFromCycle = () => {
    const token = normalizeToken(cycleInput, 6).toUpperCase()
    if (!token) {
      setCycleNote('Enter the node label you want removed from the circular list.')
      return
    }
    if (!cycleValues.includes(token)) {
      setCycleNote(`${token} is not in the circular list.`)
      return
    }
    const next = removeFirstMatch(cycleValues, token)
    setCycleValues(next)
    setCycleInput('')
    setCycleHighlight(next[0] ?? null)
    setCycleNote(`Removed ${token}; the cycle immediately reconnects to preserve continuity.`)
  }

  const pushStack = () => {
    const token = normalizeToken(stackInput)
    if (!token) {
      setStackNote('Enter a value before pushing onto the stack.')
      return
    }

    const next = [...stackValues, token]
    setStackValues(next)
    setStackInput('')
    setStackHighlight(token)
    setStackNote(`Pushed ${token}; the new value is now on top of the stack.`)
  }

  const popStack = () => {
    if (!stackValues.length) {
      setStackNote('The stack is already empty.')
      return
    }

    const popped = stackValues.at(-1)
    const next = stackValues.slice(0, -1)
    setStackValues(next)
    setStackHighlight(next.at(-1) ?? null)
    setStackNote(`Popped ${popped}; the previous frame is now exposed.`)
  }

  const enqueueValue = () => {
    const token = normalizeToken(queueInput)
    if (!token) {
      setQueueNote('Enter a value before enqueueing.')
      return
    }

    const next = [...queueValues, token]
    setQueueValues(next)
    setQueueInput('')
    setQueueHighlight(token)
    setQueueNote(`Enqueued ${token}; it joins the rear of the queue.`)
  }

  const dequeueValue = () => {
    if (!queueValues.length) {
      setQueueNote('The queue is already empty.')
      return
    }

    const removed = queueValues[0]
    const next = queueValues.slice(1)
    setQueueValues(next)
    setQueueHighlight(next[0] ?? null)
    setQueueNote(`Dequeued ${removed}; the front of the queue advanced one step.`)
  }

  const addGraphNode = () => {
    const node = normalizeGraphToken(graphNodeInput)
    if (!node) {
      setGraphNote('Enter a node label such as F or G before adding it to the graph.')
      return
    }
    if (graphNodes.includes(node)) {
      setGraphNote(`Node ${node} already exists in the graph.`)
      return
    }

    const next = [...graphNodes, node]
    setGraphNodes(next)
    setGraphNodeInput('')
    setGraphActiveNode(node)
    setGraphActiveEdge(null)
    setGraphNote(`Added node ${node}; the graph layout redistributes to accommodate it.`)
  }

  const removeGraphNode = () => {
    const node = normalizeGraphToken(graphNodeInput)
    if (!node) {
      setGraphNote('Enter the node label you want removed from the graph.')
      return
    }
    if (!graphNodes.includes(node)) {
      setGraphNote(`Node ${node} is not part of the current graph.`)
      return
    }

    const nextNodes = graphNodes.filter((item) => item !== node)
    const nextEdges = graphEdges.filter((edge) => edge.source !== node && edge.target !== node)
    setGraphNodes(nextNodes)
    setGraphEdges(nextEdges)
    setGraphNodeInput('')
    setGraphActiveNode(nextNodes[0] ?? null)
    setGraphActiveEdge(null)
    setGraphNote(`Removed node ${node}; any incident edges were removed with it.`)
  }

  const addGraphEdge = () => {
    const source = normalizeGraphToken(graphSourceInput)
    const target = normalizeGraphToken(graphTargetInput)
    if (!source || !target) {
      setGraphNote('Provide both a source and a target node before linking them.')
      return
    }
    if (source === target) {
      setGraphNote('Choose two different nodes to form a visible edge.')
      return
    }
    if (!graphNodes.includes(source) || !graphNodes.includes(target)) {
      setGraphNote('Both nodes must exist before the edge can be added.')
      return
    }

    const edgeId = [source, target].sort().join('-')
    const exists = graphEdges.some((edge) => [edge.source, edge.target].sort().join('-') === edgeId)
    if (exists) {
      setGraphNote(`Edge ${source}-${target} already exists.`)
      return
    }

    const next = [...graphEdges, { source, target }]
    setGraphEdges(next)
    setGraphSourceInput('')
    setGraphTargetInput('')
    setGraphActiveNode(target)
    setGraphActiveEdge(`${source}-${target}`)
    setGraphNote(`Added edge ${source}-${target}; the adjacency of both nodes increases.`)
  }

  return (
    <div className="container-padding relative mx-auto max-w-7xl pb-20 pt-28 sm:pt-32">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Visualization Lab"
          title="A dedicated page for live data-structure and algorithm demos."
          description="This route now isolates the teaching tools from the homepage so the professor gets a cleaner portfolio up front and a denser interactive classroom surface here."
        />

        <Tabs defaultValue="avl" className="space-y-5">
          <TabsList className="h-auto w-full flex-nowrap justify-start gap-2 overflow-x-auto rounded-[1.4rem] border border-slate-200/80 bg-white/70 dark:bg-slate-800/70 dark:border-white/10 dark:bg-slate-900/40 p-2">
            <TabsTrigger value="avl" className="min-w-fit whitespace-nowrap rounded-full px-4 py-2 data-[state=active]:bg-slate-950 data-[state=active]:text-white">AVL</TabsTrigger>
            <TabsTrigger value="bst" className="min-w-fit whitespace-nowrap rounded-full px-4 py-2 data-[state=active]:bg-slate-950 data-[state=active]:text-white">BST</TabsTrigger>
            <TabsTrigger value="graph" className="min-w-fit whitespace-nowrap rounded-full px-4 py-2 data-[state=active]:bg-slate-950 data-[state=active]:text-white">Graph</TabsTrigger>
            <TabsTrigger value="list" className="min-w-fit whitespace-nowrap rounded-full px-4 py-2 data-[state=active]:bg-slate-950 data-[state=active]:text-white">List</TabsTrigger>
            <TabsTrigger value="cycle" className="min-w-fit whitespace-nowrap rounded-full px-4 py-2 data-[state=active]:bg-slate-950 data-[state=active]:text-white">Cycle</TabsTrigger>
            <TabsTrigger value="stack" className="min-w-fit whitespace-nowrap rounded-full px-4 py-2 data-[state=active]:bg-slate-950 data-[state=active]:text-white">Stack</TabsTrigger>
            <TabsTrigger value="queue" className="min-w-fit whitespace-nowrap rounded-full px-4 py-2 data-[state=active]:bg-slate-950 data-[state=active]:text-white">Queue</TabsTrigger>
          </TabsList>

          <TabsContent value="avl">
            <SurfacePanel className="overflow-hidden p-6 sm:p-7">
              <div className="grid gap-6 lg:grid-cols-[0.84fr_1.16fr]">
                <div className="space-y-5">
                  <div>
                    <p className="algorithm-kicker">Rotation Demo</p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Smooth balancing of the current tree</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      The structure starts as the raw BST formed by insertion order. Press Balance Tree to animate the rotations that compress it into a balanced form.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                    <Input
                      value={avlInput}
                      onChange={(event) => setAvlInput(event.target.value)}
                      placeholder="Enter an integer"
                      className="h-11 rounded-2xl border-slate-300 dark:border-white/20 bg-white/90 dark:bg-slate-800/90 dark:bg-accent/10 dark:text-accent"
                    />
                    <Button onClick={handleAvlInsert} className="h-11 rounded-2xl px-5">Insert</Button>
                    <Button onClick={handleAvlRemove} variant="outline" className="h-11 rounded-2xl px-5">
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={handleAvlBalance} className="rounded-full bg-emerald-700 text-white hover:bg-emerald-800 dark:hover:bg-emerald-600">
                      Balance Tree
                    </Button>
                    <Button onClick={() => resetAvlToRaw(avlValues)} variant="outline" className="rounded-full">
                      Reset Raw Shape
                    </Button>
                    {avlPresets.map((preset) => (
                      <Button
                        key={preset.label}
                        variant="outline"
                        onClick={() => resetAvlToRaw(preset.values, `${preset.label} loaded. Press Balance Tree to animate the rotations.`)}
                        className="rounded-full border-emerald-700/20 dark:border-emerald-400/20 bg-emerald-50/80 dark:bg-emerald-400/10 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-400/20"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>

                  <SurfacePanel className="p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Balancing thread</p>
                    <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">{avlNote}</p>
                  </SurfacePanel>

                  <div className="flex flex-wrap gap-2">
                    {avlValues.map((value) => (
                      <span
                        key={value}
                        className={cn(
                          'rounded-full border px-3 py-1 text-xs font-semibold',
                          avlHighlight.includes(value)
                            ? 'border-emerald-600/20 bg-emerald-500/10 text-emerald-700'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        )}
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>

                <BinaryTreeCanvas
                  root={avlDisplayRoot}
                  highlightValues={avlHighlight}
                  variant="avl"
                  className="min-h-[360px] border border-emerald-500/10 bg-slate-950/95"
                />
              </div>
            </SurfacePanel>
          </TabsContent>

          <TabsContent value="bst">
            <SurfacePanel className="overflow-hidden p-6 sm:p-7">
              <div className="grid gap-6 lg:grid-cols-[0.84fr_1.16fr]">
                <div className="space-y-5">
                  <div>
                    <p className="algorithm-kicker">Ordered Search</p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Binary Search Tree insertion and removal</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Enter an integer to grow or shrink the tree. The structure rebuilds from insertion order so students can see how shape depends on the sequence.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                    <Input
                      value={bstInput}
                      onChange={(event) => setBstInput(event.target.value)}
                      placeholder="Enter an integer"
                      className="h-11 rounded-2xl border-slate-300 dark:border-white/20 bg-white/90 dark:bg-slate-800/90 dark:bg-accent/10 dark:text-accent"
                    />
                    <Button onClick={handleBstInsert} className="h-11 rounded-2xl px-5">Insert</Button>
                    <Button onClick={handleBstRemove} variant="outline" className="h-11 rounded-2xl px-5">
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>

                  <SurfacePanel className="p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Current operation</p>
                    <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">{bstNote}</p>
                  </SurfacePanel>
                </div>

                <BinaryTreeCanvas
                  root={bstRoot}
                  highlightValues={bstHighlight}
                  variant="bst"
                  className="min-h-[360px] border border-slate-200/80 bg-white/75 dark:bg-slate-800/75 dark:border-white/10 dark:bg-slate-900/50"
                />
              </div>
            </SurfacePanel>
          </TabsContent>

          <TabsContent value="graph">
            <SurfacePanel className="overflow-hidden p-6 sm:p-7">
              <div className="grid gap-6 lg:grid-cols-[0.84fr_1.16fr]">
                <div className="space-y-5">
                  <div>
                    <p className="algorithm-kicker">Connectivity</p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Graph construction with live topology shifts</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Add or remove nodes, then connect them with edges. The graph redistributes itself to keep the structure legible as it grows.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                      <Input
                        value={graphNodeInput}
                        onChange={(event) => setGraphNodeInput(event.target.value)}
                        placeholder="Node label"
                        className="h-11 rounded-2xl border-slate-300 dark:border-white/20 bg-white/90 dark:bg-slate-800/90 dark:bg-accent/10 dark:text-accent"
                      />
                      <Button onClick={addGraphNode} className="h-11 rounded-2xl px-5">Add Node</Button>
                      <Button onClick={removeGraphNode} variant="outline" className="h-11 rounded-2xl px-5">
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        value={graphSourceInput}
                        onChange={(event) => setGraphSourceInput(event.target.value)}
                        placeholder="Source"
                        className="h-11 rounded-2xl border-slate-300 dark:border-white/20 bg-white/90 dark:bg-slate-800/90 dark:bg-accent/10 dark:text-accent"
                      />
                      <Input
                        value={graphTargetInput}
                        onChange={(event) => setGraphTargetInput(event.target.value)}
                        placeholder="Target"
                        className="h-11 rounded-2xl border-slate-300 dark:border-white/20 bg-white/90 dark:bg-slate-800/90 dark:bg-accent/10 dark:text-accent"
                      />
                    </div>
                    <Button onClick={addGraphEdge} variant="outline" className="h-11 rounded-2xl border-sky-700/20 bg-sky-50/80 text-sky-800 hover:bg-sky-100">
                      Add Edge
                    </Button>
                  </div>

                  <SurfacePanel className="p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Graph commentary</p>
                    <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">{graphNote}</p>
                  </SurfacePanel>
                </div>

                <GraphCanvas
                  nodes={graphNodes}
                  edges={graphEdges}
                  activeNode={graphActiveNode}
                  activeEdge={graphActiveEdge}
                />
              </div>
            </SurfacePanel>
          </TabsContent>

          <TabsContent value="list">
            <SurfacePanel className="overflow-hidden p-6 sm:p-7">
              <div className="grid gap-6 lg:grid-cols-[0.84fr_1.16fr]">
                <div className="space-y-5">
                  <div>
                    <p className="algorithm-kicker">Sequential Links</p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Linked list insertions at head and tail</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Add labels to the front or back of the chain, then remove a label to see how a pointer-based list reconnects.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <Input
                      value={listInput}
                      onChange={(event) => setListInput(event.target.value)}
                      placeholder="Node label"
                      className="h-11 rounded-2xl border-slate-300 dark:border-white/20 bg-white/90 dark:bg-slate-800/90 dark:bg-accent/10 dark:text-accent"
                    />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Button onClick={addToListFront} className="h-11 rounded-2xl">Add Front</Button>
                      <Button onClick={addToListBack} variant="outline" className="h-11 rounded-2xl">Add Back</Button>
                      <Button onClick={removeFromList} variant="outline" className="h-11 rounded-2xl">
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  <SurfacePanel className="p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Pointer note</p>
                    <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">{listNote}</p>
                  </SurfacePanel>
                </div>

                <div className="algorithm-diagram flex min-h-[320px] flex-wrap items-center gap-3 rounded-[1.5rem] border border-slate-200/80 bg-white/75 dark:bg-slate-800/75 dark:border-white/10 dark:bg-slate-900/50 p-6">
                  <AnimatePresence initial={false}>
                    {listValues.map((value, index) => (
                      <motion.div
                        key={`${value}-${index}`}
                        layout
                        initial={{ opacity: 0, y: 16, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                        className="flex items-center gap-3"
                      >
                        <div
                          className={cn(
                            'rounded-[1.25rem] border px-5 py-4 text-sm font-semibold shadow-sm',
                            value === listHighlight
                              ? 'border-emerald-600/20 dark:border-emerald-400/20 bg-emerald-500/10 dark:bg-emerald-400/20 text-emerald-800 dark:text-emerald-400'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                          )}
                        >
                          {value}
                        </div>
                        {index < listValues.length - 1 ? (
                          <motion.div
                            initial={false}
                            animate={{ x: [0, 6, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                            className="text-2xl text-slate-400"
                          >
                            →
                          </motion.div>
                        ) : (
                          <div className="rounded-full border border-dashed border-slate-300 dark:border-white/20 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-400">
                            null
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </SurfacePanel>
          </TabsContent>

          <TabsContent value="cycle">
            <SurfacePanel className="overflow-hidden p-6 sm:p-7">
              <div className="grid gap-6 lg:grid-cols-[0.84fr_1.16fr]">
                <div className="space-y-5">
                  <div>
                    <p className="algorithm-kicker">Circular Traversal</p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Circular linked list with continuous flow</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Add or remove nodes from the circular list and watch the tail reconnect to the head so traversal never terminates.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                    <Input
                      value={cycleInput}
                      onChange={(event) => setCycleInput(event.target.value)}
                      placeholder="Node label"
                      className="h-11 rounded-2xl border-slate-300 dark:border-white/20 bg-white/90 dark:bg-slate-800/90 dark:bg-accent/10 dark:text-accent"
                    />
                    <Button onClick={addToCycle} className="h-11 rounded-2xl px-5">Add Node</Button>
                    <Button onClick={removeFromCycle} variant="outline" className="h-11 rounded-2xl px-5">
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>

                  <SurfacePanel className="p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Cycle note</p>
                    <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">{cycleNote}</p>
                  </SurfacePanel>
                </div>

                <div className="algorithm-diagram relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/75 dark:bg-slate-800/75 dark:border-white/10 dark:bg-slate-900/50 p-6">
                  <motion.div
                    aria-hidden
                    className="absolute h-56 w-56 rounded-full border border-dashed border-emerald-500/25"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                  />
                  <svg viewBox="0 0 100 100" className="h-[320px] w-full">
                    {cycleValues.map((value, index) => {
                      const angle = -Math.PI / 2 + (index / cycleValues.length) * Math.PI * 2
                      const nextAngle = -Math.PI / 2 + (((index + 1) % cycleValues.length) / cycleValues.length) * Math.PI * 2
                      const x = 50 + Math.cos(angle) * 28
                      const y = 50 + Math.sin(angle) * 28
                      const nextX = 50 + Math.cos(nextAngle) * 28
                      const nextY = 50 + Math.sin(nextAngle) * 28
                      const isActive = value === cycleHighlight

                      return (
                        <g key={`${value}-${index}`}>
                          <motion.line
                            initial={false}
                            animate={{ x1: x, y1: y, x2: nextX, y2: nextY }}
                            transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                            className="stroke-[rgba(15,23,42,0.28)] dark:stroke-[rgba(255,255,255,0.4)]"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <motion.circle
                            initial={false}
                            animate={{ cx: x, cy: y, r: isActive ? 7.2 : 6.5 }}
                            transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                            className={`${isActive ? 'fill-[#0f766e] dark:fill-[#5eead4]' : 'fill-[#f8fafc] dark:fill-[#1e293b]'} ${isActive ? 'stroke-[#ccfbf1] dark:stroke-[#14b8a6]' : 'stroke-[rgba(15,23,42,0.16)] dark:stroke-[rgba(255,255,255,0.2)]'}`}
                            strokeWidth="1.6"
                          />
                          <motion.text
                            initial={false}
                            animate={{ x, y: y + 1.3 }}
                            transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                            fontSize="4"
                            fontWeight="700"
                            textAnchor="middle"
                            className={isActive ? 'fill-[#ecfeff]' : 'fill-[#0f172a] dark:fill-[#f8fafc]'}
                          >
                            {value}
                          </motion.text>
                        </g>
                      )
                    })}
                  </svg>
                </div>
              </div>
            </SurfacePanel>
          </TabsContent>

          <TabsContent value="stack">
            <SurfacePanel className="overflow-hidden p-6 sm:p-7">
              <div className="grid gap-6 lg:grid-cols-[0.84fr_1.16fr]">
                <div className="space-y-5">
                  <div>
                    <p className="algorithm-kicker">LIFO Behavior</p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Stack push and pop visualization</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Push values onto the stack to grow it upward, then pop to remove the most recent frame. This is useful for recursion, call stacks, and backtracking discussions.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                    <Input
                      value={stackInput}
                      onChange={(event) => setStackInput(event.target.value)}
                      placeholder="Frame label"
                      className="h-11 rounded-2xl border-slate-300 dark:border-white/20 bg-white/90 dark:bg-slate-800/90 dark:bg-accent/10 dark:text-accent"
                    />
                    <Button onClick={pushStack} className="h-11 rounded-2xl px-5">Push</Button>
                    <Button onClick={popStack} variant="outline" className="h-11 rounded-2xl px-5">Pop</Button>
                  </div>

                  <SurfacePanel className="p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Stack note</p>
                    <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">{stackNote}</p>
                  </SurfacePanel>
                </div>

                <div className="algorithm-diagram flex min-h-[360px] items-end justify-center rounded-[1.5rem] border border-slate-200/80 bg-white/75 dark:bg-slate-800/75 dark:border-white/10 dark:bg-slate-900/50 p-6">
                  <div className="flex w-full max-w-xs flex-col-reverse gap-3">
                    <AnimatePresence initial={false}>
                      {stackValues.map((value, index) => (
                        <motion.div
                          key={`${value}-${index}`}
                          layout
                          initial={{ opacity: 0, y: 18, scale: 0.94 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -16, scale: 0.92 }}
                          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                          className={cn(
                            'rounded-[1.25rem] border px-5 py-4 text-center text-sm font-semibold shadow-sm',
                            value === stackHighlight
                              ? 'border-emerald-600/20 dark:border-emerald-400/20 bg-emerald-500/10 dark:bg-emerald-400/20 text-emerald-800 dark:text-emerald-400'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                          )}
                        >
                          {value}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/20 px-4 py-2 text-center text-xs uppercase tracking-[0.22em] text-slate-400">
                      stack base
                    </div>
                  </div>
                </div>
              </div>
            </SurfacePanel>
          </TabsContent>

          <TabsContent value="queue">
            <SurfacePanel className="overflow-hidden p-6 sm:p-7">
              <div className="grid gap-6 lg:grid-cols-[0.84fr_1.16fr]">
                <div className="space-y-5">
                  <div>
                    <p className="algorithm-kicker">FIFO Behavior</p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Queue enqueue and dequeue visualization</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Enqueue grows the rear of the line, and dequeue removes from the front. This is useful for scheduling, buffering, and breadth-first processing intuition.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                    <Input
                      value={queueInput}
                      onChange={(event) => setQueueInput(event.target.value)}
                      placeholder="Queue item"
                      className="h-11 rounded-2xl border-slate-300 dark:border-white/20 bg-white/90 dark:bg-slate-800/90 dark:bg-accent/10 dark:text-accent"
                    />
                    <Button onClick={enqueueValue} className="h-11 rounded-2xl px-5">Enqueue</Button>
                    <Button onClick={dequeueValue} variant="outline" className="h-11 rounded-2xl px-5">Dequeue</Button>
                  </div>

                  <SurfacePanel className="p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Queue note</p>
                    <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">{queueNote}</p>
                  </SurfacePanel>
                </div>

                <div className="algorithm-diagram flex min-h-[360px] flex-col justify-center rounded-[1.5rem] border border-slate-200/80 bg-white/75 dark:bg-slate-800/75 dark:border-white/10 dark:bg-slate-900/50 p-6">
                  <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    <span>Front</span>
                    <span>Rear</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <AnimatePresence initial={false}>
                      {queueValues.map((value, index) => (
                        <motion.div
                          key={`${value}-${index}`}
                          layout
                          initial={{ opacity: 0, x: 18, scale: 0.94 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -18, scale: 0.92 }}
                          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                          className={cn(
                            'rounded-[1.25rem] border px-5 py-4 text-sm font-semibold shadow-sm',
                            value === queueHighlight
                              ? 'border-emerald-600/20 dark:border-emerald-400/20 bg-emerald-500/10 dark:bg-emerald-400/20 text-emerald-800 dark:text-emerald-400'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                          )}
                        >
                          {value}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {!queueValues.length && (
                      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/20 px-5 py-4 text-sm text-slate-400">
                        Queue is empty
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SurfacePanel>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
