import os

filepath = 'src/sections/VisualizationLab.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Tree edges
old1 = "stroke={variant === 'avl' ? (active ? '#14b8a6' : 'rgba(153, 246, 228, 0.45)') : active ? '#0f766e' : 'rgba(30, 41, 59, 0.3)'}"
new1 = "className={variant === 'avl' ? (active ? 'stroke-[#14b8a6]' : 'stroke-[rgba(153,246,228,0.45)]') : active ? 'stroke-[#0f766e] dark:stroke-[#5eead4]' : 'stroke-[rgba(30,41,59,0.3)] dark:stroke-[rgba(255,255,255,0.4)]'}"
content = content.replace(old1, new1)

# Tree node circles
old2 = "stroke={variant === 'avl' ? 'rgba(226, 232, 240, 0.8)' : 'rgba(15, 23, 42, 0.18)'}"
new2 = "className={variant === 'avl' ? 'stroke-[rgba(226,232,240,0.8)]' : 'stroke-[rgba(15,23,42,0.18)] dark:stroke-[rgba(255,255,255,0.2)]'}"
content = content.replace(old2, new2)

old_text2 = "fill={variant === 'avl' ? '#f8fafc' : isActive ? '#ecfeff' : '#0f172a'}"
new_text2 = "className={variant === 'avl' ? 'fill-[#f8fafc]' : isActive ? 'fill-[#ecfeff]' : 'fill-[#0f172a] dark:fill-[#f8fafc]'}"
content = content.replace(old_text2, new_text2)

# Graph edges
old3 = "stroke={edgeId === activeEdge ? '#0f766e' : 'rgba(15, 23, 42, 0.34)'}"
new3 = "className={edgeId === activeEdge ? 'stroke-[#0f766e] dark:stroke-[#5eead4]' : 'stroke-[rgba(15,23,42,0.34)] dark:stroke-[rgba(255,255,255,0.4)]'}"
content = content.replace(old3, new3)

# Graph nodes
old4 = "stroke={isActive ? '#ccfbf1' : 'rgba(15, 23, 42, 0.16)'}"
new4 = "className={isActive ? 'stroke-[#ccfbf1] dark:stroke-[#14b8a6]' : 'stroke-[rgba(15,23,42,0.16)] dark:stroke-[rgba(255,255,255,0.2)]'}"
content = content.replace(old4, new4)

old_text4 = "fill={isActive ? '#ecfeff' : '#0f172a'}"
new_text4 = "className={isActive ? 'fill-[#ecfeff]' : 'fill-[#0f172a] dark:fill-[#f8fafc]'}"
content = content.replace(old_text4, new_text4)

# Linked List edges
old5 = 'stroke="rgba(15, 23, 42, 0.28)"'
new5 = 'className="stroke-[rgba(15,23,42,0.28)] dark:stroke-[rgba(255,255,255,0.4)]"'
content = content.replace(old5, new5)

# Linked List nodes
old6 = "stroke={isActive ? '#ccfbf1' : 'rgba(15, 23, 42, 0.16)'}"
new6 = "className={isActive ? 'stroke-[#ccfbf1] dark:stroke-[#14b8a6]' : 'stroke-[rgba(15,23,42,0.16)] dark:stroke-[rgba(255,255,255,0.2)]'}"
content = content.replace(old6, new6)

with open(filepath, 'w') as f:
    f.write(content)
