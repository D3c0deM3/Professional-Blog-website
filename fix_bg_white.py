import os

filepath = 'src/sections/VisualizationLab.tsx'
with open(filepath, 'r') as f:
    content = f.read()

content = content.replace("bg-white/10", "bg-white/10 dark:bg-white/5")
content = content.replace("bg-white/50", "bg-white/50 dark:bg-slate-800/50")
content = content.replace("bg-white/70", "bg-white/70 dark:bg-slate-800/70")
content = content.replace("bg-white/75", "bg-white/75 dark:bg-slate-800/75")
content = content.replace("bg-white/80", "bg-white/80 dark:bg-slate-800/80")
content = content.replace("bg-white/90", "bg-white/90 dark:bg-slate-800/90")

# Re-run the emerald fix for other variations if they were missed.
content = content.replace(
    "'border-emerald-600/20 bg-emerald-500/10 text-emerald-800'",
    "'border-emerald-600/20 dark:border-emerald-400/20 bg-emerald-500/10 dark:bg-emerald-400/20 text-emerald-800 dark:text-emerald-400'"
)

with open(filepath, 'w') as f:
    f.write(content)
