import os

filepath = 'src/sections/VisualizationLab.tsx'
with open(filepath, 'r') as f:
    content = f.read()

import re
# We need to merge adjacent className props on motion.circle components
pattern = r"className=\{([^\}]+)\}\s+className=\{([^\}]+)\}"
def replacer(match):
    return "className={`${" + match.group(1) + "} ${" + match.group(2) + "}`}"

content = re.sub(pattern, replacer, content)

with open(filepath, 'w') as f:
    f.write(content)
