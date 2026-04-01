import re

filepath = 'src/sections/VisualizationLab.tsx'
with open(filepath, 'r') as f:
    content = f.read()

content = content.replace(
    "'border-slate-200 bg-white text-slate-600 dark:text-slate-300'",
    "'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
)

content = content.replace(
    "'border-slate-200 bg-white text-slate-700 dark:text-slate-200'",
    "'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'"
)

with open(filepath, 'w') as f:
    f.write(content)
