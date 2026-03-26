# Review Template

```
REVIEWER REPORT — [nombre-tarea] — [fecha]
══════════════════════════════════════════
Spec de referencia: [nombre o ruta de la spec]

CRITERIOS VERIFICADOS:
  [✅/❌] [criterio 1] → [evidencia concreta en 1 línea]
  [✅/❌] [criterio 2] → [evidencia concreta en 1 línea]
  [✅/❌] [criterio N] → [evidencia concreta en 1 línea]

CALIDAD DEL OUTPUT:
  [✅/⚠️/❌] Coherencia interna     → [observación breve]
  [✅/⚠️/❌] Completitud            → [observación breve]
  [✅/⚠️/❌] Ajuste a restricciones → [observación breve]
  [✅/⚠️/❌] Claridad               → [observación breve]

HALLAZGOS:
  [CRITICAL] [descripción exacta del problema] → bloquea entrega
  [WARNING]  [descripción exacta] → debe revisarse antes de archivar
  [INFO]     [descripción exacta] → sugerencia no bloqueante
  (si no hay hallazgos → escribir "ninguno")

VEREDICTO: PASS / FAIL
Motivo: [1 línea clara que justifica el veredicto]
```

## Escala de veredicto
- **PASS**: todos los criterios ✅ + sin ningún CRITICAL
- **FAIL**: uno o más criterios ❌ O cualquier CRITICAL presente

## Reglas de uso
- No emitir PASS con CRITICALs sin resolver — nunca
- No proponer correcciones — el reviewer solo verifica y diagnostica; las correcciones son del implementer
- Siempre tener la spec en mano al revisar — sin spec no hay revisión válida
- La evidencia de cada criterio debe ser observable: una línea de código, una ruta de archivo, un valor concreto
