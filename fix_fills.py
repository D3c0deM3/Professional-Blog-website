import os

filepath = 'src/sections/VisualizationLab.tsx'
with open(filepath, 'r') as f:
    content = f.read()

old1 = "fill={variant === 'avl' ? (isActive ? '#14b8a6' : '#0f172a') : isActive ? '#0f766e' : '#f8fafc'}"
new1 = "className={variant === 'avl' ? (isActive ? 'fill-[#14b8a6]' : 'fill-[#0f172a]') : isActive ? 'fill-[#0f766e] dark:fill-[#5eead4]' : 'fill-[#f8fafc] dark:fill-[#1e293b]'}"
content = content.replace(old1, new1)

old2 = "fill={isActive ? '#0f766e' : '#f8fafc'}"
new2 = "className={isActive ? 'fill-[#0f766e] dark:fill-[#5eead4]' : 'fill-[#f8fafc] dark:fill-[#1e293b]'}"
content = content.replace(old2, new2)

with open(filepath, 'w') as f:
    f.write(content)
