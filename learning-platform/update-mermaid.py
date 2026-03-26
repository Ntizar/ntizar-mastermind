import json

# Leer modules-v2.json actual
with open('modules-v2.json', 'r', encoding='utf-8') as f:
    modules = json.load(f)

# Actualizar M1 con diagrama Mermaid
modules['mod1']['content'] = modules['mod1']['content'].replace(
    "<div class='flow-diagram'",
    "<div class='mermaid' style='margin:2rem 0;text-align:center;'>\ngraph TD\n    A[HUMANO] --> B[01-classifier]\n    B --> C{Complejidad?}\n    C -->|Alta| D[02-explorer → 03-planner → 04-spec]\n    C -->|Media| E[03-planner → 04-spec]\n    C -->|Baja| F[05-implementer]\n    D --> G[05-implementer]\n    E --> G\n    F --> G\n    G --> H[06-reviewer]\n    H --> I{PASS?}\n    I -->|No| G\n    I -->|Sí| J[07-critic]\n    J --> K[08-synthesizer]\n    K --> L[HUMANO ✅]\n    L --> M[09-archiver]\n</div>\n\n<div class='flow-diagram'"
)

# Guardar
with open('modules-v2-mermaid.json', 'w', encoding='utf-8') as f:
    json.dump(modules, f, indent=2, ensure_ascii=False)

print('✅ Mermaid diagram added to M1')
