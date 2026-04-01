import os

filepath = 'src/sections/VisualizationLab.tsx'
with open(filepath, 'r') as f:
    content = f.read()

content = content.replace(
    "'border-emerald-600/20 bg-emerald-500/10 text-emerald-800'",
    "'border-emerald-600/20 dark:border-emerald-400/20 bg-emerald-500/10 dark:bg-emerald-400/20 text-emerald-800 dark:text-emerald-400'"
)

content = content.replace(
    "border-emerald-700/20 bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100",
    "border-emerald-700/20 dark:border-emerald-400/20 bg-emerald-50/80 dark:bg-emerald-400/10 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-400/20"
)

content = content.replace(
    "hover:bg-emerald-800",
    "hover:bg-emerald-800 dark:hover:bg-emerald-600"
)

with open(filepath, 'w') as f:
    f.write(content)
