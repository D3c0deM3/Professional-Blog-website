'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { cn } from '@/lib/utils'

type Density = 'low' | 'medium' | 'high'

interface AlgorithmicBackgroundProps {
  density?: Density
  motionScale?: number
  className?: string
}

const densityConfig: Record<Density, { nodes: number; particleCount: number; neighborCount: number }> = {
  low: { nodes: 18, particleCount: 60, neighborCount: 2 },
  medium: { nodes: 26, particleCount: 90, neighborCount: 3 },
  high: { nodes: 36, particleCount: 130, neighborCount: 3 },
}

function parseHslVariable(value: string, fallback: string) {
  if (!value) {
    return fallback
  }
  const normalized = value.replace(/\s+/g, ', ')
  return `hsl(${normalized})`
}

function createFibonacciSphere(count: number) {
  const points: Array<{ theta: number; phi: number }> = []
  const offset = 2 / count
  const increment = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i += 1) {
    const y = i * offset - 1 + offset / 2
    const theta = i * increment
    const phi = Math.acos(y)
    points.push({ theta, phi })
  }
  return points
}

export default function AlgorithmicBackground({
  density = 'medium',
  motionScale = 1,
  className,
}: AlgorithmicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const effectiveMotion = prefersReducedMotion ? 0 : Math.max(0, motionScale)
    const { nodes, particleCount, neighborCount } = densityConfig[density]

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'low-power',
    })
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    camera.position.set(0, 0.2, 6)

    const rootStyles = getComputedStyle(document.documentElement)
    const primaryColor = new THREE.Color(
      parseHslVariable(rootStyles.getPropertyValue('--primary').trim(), '#0f172a'),
    )
    const accentColor = new THREE.Color(
      parseHslVariable(rootStyles.getPropertyValue('--accent').trim(), '#0f3d3e'),
    )
    
    const isDark = document.documentElement.classList.contains('dark')
    const graphite = new THREE.Color(isDark ? '#94a3b8' : '#1f2937')

    const group = new THREE.Group()
    scene.add(group)

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: primaryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    })
    const wireframeA = new THREE.Mesh(new THREE.IcosahedronGeometry(2.1, 1), wireframeMaterial)
    const wireframeB = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.4, 0),
      new THREE.MeshBasicMaterial({
        color: accentColor,
        wireframe: true,
        transparent: true,
        opacity: 0.16,
      }),
    )
    wireframeB.rotation.x = Math.PI / 3
    wireframeB.rotation.y = Math.PI / 5
    group.add(wireframeA, wireframeB)

    const orbitGroup = new THREE.Group()
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: graphite,
      transparent: true,
      opacity: 0.18,
    })
    const orbitRadii = [1.6, 2.0, 2.4]
    orbitRadii.forEach((radius, index) => {
      const points: THREE.Vector3[] = []
      const segments = 80
      for (let i = 0; i <= segments; i += 1) {
        const angle = (i / segments) * Math.PI * 2
        points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0))
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const orbit = new THREE.LineLoop(geometry, orbitMaterial)
      orbit.rotation.x = (index + 1) * 0.6
      orbit.rotation.y = (index + 1) * 0.35
      orbitGroup.add(orbit)
    })
    group.add(orbitGroup)

    const nodeSeeds = createFibonacciSphere(nodes)
    const nodeMeta = nodeSeeds.map((seed, index) => ({
      theta: seed.theta,
      phi: seed.phi,
      radius: 1.8 + (index % 4) * 0.12,
      speed: 0.08 + (index % 5) * 0.015,
      phase: (index % 7) * 0.6,
    }))

    const nodePositions = new Float32Array(nodes * 3)
    const nodeGeometry = new THREE.BufferGeometry()
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3))
    const nodeMaterial = new THREE.PointsMaterial({
      color: graphite,
      size: 0.045,
      transparent: true,
      opacity: 0.52,
      sizeAttenuation: true,
    })
    const nodePoints = new THREE.Points(nodeGeometry, nodeMaterial)
    group.add(nodePoints)

    const basePositions = nodeMeta.map((node) => {
      const sinPhi = Math.sin(node.phi)
      return new THREE.Vector3(
        node.radius * sinPhi * Math.cos(node.theta),
        node.radius * Math.cos(node.phi),
        node.radius * sinPhi * Math.sin(node.theta),
      )
    })

    const edgePairs: Array<[number, number]> = []
    for (let i = 0; i < nodes; i += 1) {
      const distances = basePositions.map((pos, j) => ({
        index: j,
        distance: pos.distanceToSquared(basePositions[i]),
      }))
      distances.sort((a, b) => a.distance - b.distance)
      for (let n = 1; n <= neighborCount; n += 1) {
        const j = distances[n]?.index
        if (j === undefined) continue
        const a = Math.min(i, j)
        const b = Math.max(i, j)
        if (!edgePairs.find((pair) => pair[0] === a && pair[1] === b)) {
          edgePairs.push([a, b])
        }
      }
    }

    const edgePositions = new Float32Array(edgePairs.length * 2 * 3)
    const edgeGeometry = new THREE.BufferGeometry()
    edgeGeometry.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3))
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: graphite,
      transparent: true,
      opacity: 0.22,
    })
    const edgeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial)
    group.add(edgeLines)

    const particleMeta = Array.from({ length: particleCount }, (_, index) => ({
      a: 1 + (index % 3),
      b: 2 + (index % 4),
      c: 3 + (index % 5),
      radius: 1.6 + (index % 6) * 0.12,
      phase: (index % 9) * 0.4,
      tilt: (index % 5) * 0.1,
    }))
    const particlePositions = new Float32Array(particleCount * 3)
    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: accentColor,
      size: 0.032,
      transparent: true,
      opacity: 0.36,
      sizeAttenuation: true,
    })
    const particlePoints = new THREE.Points(particleGeometry, particleMaterial)
    group.add(particlePoints)

    let animationFrame = 0
    const clock = new THREE.Clock()

    const updateGeometry = (time: number) => {
      for (let i = 0; i < nodes; i += 1) {
        const node = nodeMeta[i]
        const theta = node.theta + time * node.speed
        const phi = node.phi + Math.sin(time * 0.45 + node.phase) * 0.18
        const radius = node.radius + Math.sin(time * 0.35 + node.phase) * 0.04
        const sinPhi = Math.sin(phi)
        nodePositions[i * 3] = radius * sinPhi * Math.cos(theta)
        nodePositions[i * 3 + 1] = radius * Math.cos(phi)
        nodePositions[i * 3 + 2] = radius * sinPhi * Math.sin(theta)
      }
      nodeGeometry.attributes.position.needsUpdate = true

      for (let i = 0; i < edgePairs.length; i += 1) {
        const [a, b] = edgePairs[i]
        edgePositions[i * 6] = nodePositions[a * 3]
        edgePositions[i * 6 + 1] = nodePositions[a * 3 + 1]
        edgePositions[i * 6 + 2] = nodePositions[a * 3 + 2]
        edgePositions[i * 6 + 3] = nodePositions[b * 3]
        edgePositions[i * 6 + 4] = nodePositions[b * 3 + 1]
        edgePositions[i * 6 + 5] = nodePositions[b * 3 + 2]
      }
      edgeGeometry.attributes.position.needsUpdate = true

      for (let i = 0; i < particleCount; i += 1) {
        const particle = particleMeta[i]
        const t = time * 0.4
        const x = particle.radius * Math.sin(particle.a * t + particle.phase)
        const y = particle.radius * Math.sin(particle.b * t + particle.phase * 0.7)
        const z = particle.radius * Math.cos(particle.c * t + particle.phase)
        particlePositions[i * 3] = x
        particlePositions[i * 3 + 1] = y * Math.cos(particle.tilt) - z * Math.sin(particle.tilt)
        particlePositions[i * 3 + 2] = y * Math.sin(particle.tilt) + z * Math.cos(particle.tilt)
      }
      particleGeometry.attributes.position.needsUpdate = true

      wireframeA.rotation.y = time * 0.08
      wireframeA.rotation.x = time * 0.05
      wireframeB.rotation.z = time * 0.06
      orbitGroup.rotation.y = time * 0.04
      orbitGroup.rotation.x = time * 0.03
      particlePoints.rotation.y = time * 0.03
    }

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const { width, height } = parent.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio, 2)
      renderer.setPixelRatio(dpr)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    resize()
    const handleResize = () => resize()
    window.addEventListener('resize', handleResize)

    const renderFrame = () => {
      const time = clock.getElapsedTime() * 0.6 * effectiveMotion
      updateGeometry(time)
      renderer.render(scene, camera)
      animationFrame = window.requestAnimationFrame(renderFrame)
    }

    if (effectiveMotion > 0) {
      renderFrame()
    } else {
      updateGeometry(0)
      renderer.render(scene, camera)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      window.cancelAnimationFrame(animationFrame)
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh
        const hasGeometry = typeof mesh.geometry?.dispose === 'function'
        if (hasGeometry) {
          mesh.geometry.dispose()
        }
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined
        if (material) {
          if (Array.isArray(material)) {
            material.forEach((item) => item.dispose())
          } else {
            material.dispose()
          }
        }
      })
      nodeGeometry.dispose()
      edgeGeometry.dispose()
      particleGeometry.dispose()
      wireframeMaterial.dispose()
      orbitMaterial.dispose()
      nodeMaterial.dispose()
      edgeMaterial.dispose()
      particleMaterial.dispose()
      renderer.dispose()
    }
  }, [density, motionScale])

  return (
    <div
      className={cn(
        'pointer-events-none select-none',
        className,
      )}
      aria-hidden
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
