import os
import re

def process_file(filepath, replacements):
    with open(filepath, 'r') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w') as f:
        f.write(content)

# Define replacements for light -> light + dark
hero_reps = [
    ("border-slate-200/80 bg-white/70 px-5 py-5", "border-slate-200/80 bg-white/70 px-5 py-5 dark:border-white/10 dark:bg-slate-950/70"),
    ("text-slate-500", "text-slate-500 dark:text-slate-400"),
    ("text-slate-950", "text-slate-950 dark:text-white"),
    ("text-slate-600", "text-slate-600 dark:text-slate-300"),
    ("border border-slate-200/80 bg-white/80", "border border-slate-200/80 bg-white/80 dark:border-white/10 dark:bg-slate-950/80"),
    ("text-slate-700", "text-slate-700 dark:text-slate-200"),
    ("shadow-slate-900/10", "shadow-slate-900/10 dark:shadow-black/50"),
    ("border-emerald-700/20 bg-emerald-50/70 px-7 text-emerald-800 hover:bg-emerald-100", "border-emerald-700/20 bg-emerald-50/70 px-7 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:hover:bg-emerald-400/20")
]

process_file("src/sections/Hero.tsx", hero_reps)

vis_reps = [
    ("border border-slate-200/80 bg-white/70", "border border-slate-200/80 bg-white/70 dark:border-white/10 dark:bg-slate-900/40"),
    ("border border-slate-200/80 bg-white/75", "border border-slate-200/80 bg-white/75 dark:border-white/10 dark:bg-slate-900/50"),
    ("border border-slate-200 bg-white", "border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900"),
    ("bg-white/90", "bg-white/90 dark:bg-accent/10 dark:text-accent"),
    ("text-slate-950", "text-slate-950 dark:text-white"),
    ("text-slate-500", "text-slate-500 dark:text-slate-400"),
    ("text-slate-600", "text-slate-600 dark:text-slate-300"),
    ("text-slate-700", "text-slate-700 dark:text-slate-200"),
    ("border-slate-300", "border-slate-300 dark:border-white/20")
]

process_file("src/sections/VisualizationLab.tsx", vis_reps)

nav_reps = [
    ("bg-[rgba(248,251,253,0.82)] shadow-[0_18px_48px_rgba(15,23,42,0.08)]", "bg-[rgba(248,251,253,0.82)] shadow-[0_18px_48px_rgba(15,23,42,0.08)] dark:bg-slate-950/80 dark:shadow-[0_18px_48px_rgba(0,0,0,0.5)]"),
    ("border border-slate-200/80 bg-white/80", "border border-slate-200/80 bg-white/80 dark:border-white/10 dark:bg-slate-900/80"),
    ("border border-slate-200/80 bg-white/75", "border border-slate-200/80 bg-white/75 dark:border-white/10 dark:bg-slate-900/80"),
    ("text-slate-950", "text-slate-950 dark:text-white"),
    ("bg-[rgba(248,251,253,0.96)]", "bg-[rgba(248,251,253,0.96)] dark:bg-slate-950/95"),
    ("bg-white/70 text-slate-600 hover:bg-slate-100 hover:text-slate-950", "bg-white/70 text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:bg-slate-900/70 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"),
    ("text-slate-500 hover:bg-slate-100 hover:text-slate-950", "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"),
    ("bg-slate-950 text-white", "bg-slate-950 text-white dark:bg-primary dark:text-primary-foreground"),
    ("border-slate-200/80", "border-slate-200/80 dark:border-white/10")
]

process_file("src/components/Navigation.tsx", nav_reps)

foot_reps = [
    ("border-slate-200/70 bg-white/40", "border-slate-200/70 bg-white/40 dark:border-white/10 dark:bg-slate-950/40"),
    ("text-slate-500", "text-slate-500 dark:text-slate-400"),
    ("text-slate-700", "text-slate-700 dark:text-slate-300"),
    ("hover:text-slate-950", "hover:text-slate-950 dark:hover:text-white")
]

process_file("src/components/Footer.tsx", foot_reps)

# For globals.css globals backgrounds
with open("src/app/globals.css", "r") as f:
    css = f.read()

css = css.replace("body {", "body {\n  @apply bg-background text-foreground;")
css = css.replace("rgba(16, 185, 129, 0.05)", "rgba(16, 185, 129, 0.11)")
css = css.replace("linear-gradient(180deg, #f8fbfd 0%, #eef4f7 48%, #f8fbfd 100%);", "linear-gradient(180deg, #f8fbfd 0%, #eef4f7 48%, #f8fbfd 100%);\n}\n\n.dark body {\n  background-image:\n    radial-gradient(circle at 10% 10%, rgba(16, 185, 129, 0.08), transparent 24%),\n    radial-gradient(circle at 88% 18%, rgba(255, 255, 255, 0.05), transparent 24%),\n    linear-gradient(180deg, hsl(224, 71%, 4%), hsl(224, 71%, 8%) 48%, hsl(224, 71%, 4%) 100%);")

# Also add dark styles for panels in css
css = css.replace(
""".glass-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid rgba(15, 20, 35, 0.16);""",
""".glass-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid rgba(15, 20, 35, 0.16);
}
.dark .glass-panel::before {
  border: 1px solid rgba(255, 255, 255, 0.16);""")

css = css.replace("""box-shadow: 0 30px 90px rgba(15, 20, 35, 0.14);""", """box-shadow: 0 30px 90px rgba(15, 20, 35, 0.14);
}
.dark .glass-panel {
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.4);
  background:
    radial-gradient(circle at 20% 0%, rgba(200, 200, 255, 0.05), transparent 60%),
    radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.03), transparent 55%),
    linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.02) 14%, rgba(255, 255, 255, 0.04) 50%, rgba(255, 255, 255, 0.02) 86%, rgba(255, 255, 255, 0) 100%);""")

css = css.replace("""box-shadow:
    0 22px 60px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);""", """box-shadow:
    0 22px 60px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
}
.dark .algorithm-panel {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.8)),
    radial-gradient(circle at top right, rgba(16, 185, 129, 0.15), transparent 30%);
  box-shadow:
    0 22px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);""")

with open("src/app/globals.css", "w") as f:
    f.write(css)

print("success")
