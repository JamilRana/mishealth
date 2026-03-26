import os

content = """import * as React from "react"

export default function Page({ params }) {
  return <div className="p-10 font-black text-slate-400 uppercase tracking-widest">Restored Core Infrastructure - Interface Placeholder</div>
}
"""

app_dir = 'src/app'
for root, dirs, files in os.walk(app_dir):
    for f in files:
        if f.endswith('.tsx'):
            path = os.path.join(root, f)
            if os.path.getsize(path) == 0:
                with open(path, 'w', encoding='utf-8') as f_out:
                    f_out.write(content)
                print(f"Restored {path}")
