<p align="center">
  <img src="assets/banner.png" alt="Ntizar Mastermind" width="800"/>
</p>

<h1 align="center">(OpenCode + Obsidian) ^ Ntizar Mastermind</h1>

<p align="center">
  <strong>Un sistema de orquestacion multi-agente que realmente recuerda, aprende y olvida.</strong>
</p>

<p align="center">
  <a href="#inicio-rapido">Inicio Rapido</a> |
  <a href="README.md">English</a> |
  <a href="docs/ARCHITECTURE.md">Arquitectura</a> |
  <a href="#plataforma-de-aprendizaje">Plataforma</a> |
  <a href="#hoja-de-ruta">Roadmap</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-3.0-blue" alt="Version 3.0"/>
  <img src="https://img.shields.io/badge/agentes-11-orange" alt="11 Agentes"/>
  <img src="https://img.shields.io/badge/modelos-multi--modelo-green" alt="Multi-modelo"/>
  <img src="https://img.shields.io/badge/memoria-Ebbinghaus%20decay-purple" alt="Sistema de Memoria"/>
  <img src="https://img.shields.io/badge/licencia-MIT-lightgrey" alt="MIT License"/>
</p>

---

## El Problema

Usas IA todos los dias. Copias y pegas contexto. Re-explicas tu proyecto. Pierdes aprendizajes entre sesiones. Tus prompts son largos, caros y fragiles.

**Y si tu IA tuviera cerebro?**

No un chatbot. No un solo prompt. Un sistema estructurado, multi-agente, con memoria persistente, roles especializados y una curva de olvido que mantiene tu contexto ligero y relevante.

## Que Es Ntizar Mastermind?

Ntizar Mastermind es un **framework open-source de orquestacion multi-agente** que funciona sobre [OpenCode](https://opencode.ai) + [Obsidian](https://obsidian.md). Transforma tu flujo de trabajo con IA de "una conversacion a la vez" a un **sistema de inteligencia persistente y auto-mejorable**.

### Como Funciona

```
Tu das una tarea
    |
    v
El ORQUESTADOR la clasifica (tipo, complejidad, dominio)
    |
    v
Selecciona el FLUJO optimo (3 a 10 agentes)
    |
    v
Cada AGENTE se ejecuta en el mejor modelo para su rol
    |
    v
Los resultados son REVISADOS, CRITICADOS y SINTETIZADOS
    |
    v
Los aprendizajes se ARCHIVAN con curva de expiracion
    |
    v
La siguiente sesion empieza mas inteligente, no desde cero
```

### Diferenciadores Clave

| Caracteristica | Prompting Tradicional | Ntizar Mastermind v3 |
|----------------|----------------------|---------------------|
| Contexto | Se pierde cada sesion | Memoria persistente con decaimiento inteligente |
| Agentes | Una sola personalidad | 11 agentes especializados con roles definidos |
| Modelos | Un modelo hace todo | Cada agente usa su modelo optimo |
| Coste | Contexto completo siempre | 40-60% ahorro en tokens via carga inteligente |
| Calidad | Sin proceso de revision | Revision obligatoria + critico adversarial |
| Aprendizaje | Empieza desde cero | Acumula patrones, skills y conocimiento de proyectos |
| Control | La IA decide todo | Humano en el bucle en cada checkpoint critico |

---

## Los 11 Agentes

El sistema opera como un **pipeline** donde cada agente tiene una unica responsabilidad:

| # | Agente | Rol | Piensa en el como... |
|---|--------|-----|---------------------|
| 00 | **Orquestador** | Clasifica tareas, disena flujos, delega | El CEO |
| 01 | **Clasificador** | Evalua complejidad, dominio, ambiguedad | El Triaje |
| 02 | **Explorador** | Lee contexto sin modificar nada | El Scout |
| 03 | **Planificador** | Define estrategia, pasos, criterios de exito | El Arquitecto |
| 04 | **Spec Writer** | Convierte plan en spec ejecutable sin ambiguedad | El Abogado de Contratos |
| 05 | **Implementador** | Ejecuta la spec, produce entregables | El Constructor |
| 06 | **Revisor** | Validacion PASS/FAIL contra criterios de la spec | El Inspector de Calidad |
| 07 | **Critico** | Revision adversarial -- encuentra lo que otros no ven | El Abogado del Diablo |
| 08 | **Sintetizador** | Transforma reportes en resultados legibles | El Traductor |
| 09 | **Archivador** | Destila aprendizajes con metadatos de decaimiento | El Bibliotecario |
| 10 | **Bibliotecario** | Mantiene el grafo de conocimiento y salud del sistema | El Jardinero |

**El Critico nunca se degrada.** Si el mejor modelo no esta disponible, el Critico se omite completamente en vez de ejecutarse en un modelo inferior. Calidad sobre cantidad.

---

## Arquitectura Multi-Modelo

No toda tarea necesita el modelo mas caro. Mastermind asigna a cada agente el modelo correcto para su trabajo:

```
Orquestador + Critico  -->  Claude Opus / GPT-4o     (alto razonamiento)
Explorador             -->  Gemini 2.5 Pro           (contexto de 1M tokens)
Implementador          -->  Claude Opus / Sonnet      (generacion de codigo)
Revisor                -->  Claude Sonnet / Flash     (criterios concretos)
Sintetizador + Archiv. -->  Claude Haiku / Flash      (tareas mecanicas)
```

**Resultado:** Misma calidad de output, 40-60% menos coste. Tu eliges los modelos -- el sistema propone, tu confirmas.

---

## Memoria Que Olvida (A Proposito)

Cada aprendizaje capturado por el sistema tiene un **tipo de decaimiento** basado en la curva del olvido de Ebbinghaus:

```
R(t) = a / (log(t+1))^b + c
```

| Tipo de Decaimiento | A los 30 dias | A los 90 dias | A los 180 dias | Usado Para |
|--------------------|---------------|---------------|----------------|-----------|
| **Permanente** | 100% | 100% | 100% | Reglas del sistema, patrones fundamentales |
| **Lento** | 71% | 58% | 48% | Patrones tecnicos reutilizables |
| **Normal** | 52% | 37% | 29% | Soluciones a problemas especificos |
| **Rapido** | 30% | 18% | 12% | Fixes puntuales, contexto temporal |

**Por que?** Porque cargar 200 aprendizajes en cada sesion es caro y ruidoso. El sistema solo carga aprendizajes que son **relevantes para la tarea actual** Y que **no han decaido por debajo del umbral**. El conocimiento viejo e irrelevante se desvanece naturalmente. Los patrones criticos persisten para siempre.

---

## Arquitectura de Dos Capas (Innovacion v3)

El sistema vive en dos capas sincronizadas con **cero duplicacion**:

```
agents/                    .opencode/agents/
(Obsidian - Documentacion)     (OpenCode - Ejecucion)
 |                              |
 |  Contexto rico, wikilinks,  |  Config YAML minima,
 |  misiones, interconexiones  |  instrucciones operativas,
 |                              |  asignacion de modelos
 |                              |
 +--- Fuente de verdad          +--- Motor de ejecucion
      (legible por humanos)          (ejecutable por maquina)
```

Los archivos `.opencode/` referencian los docs de Obsidian para contexto completo. Los archivos de Obsidian referencian los de `.opencode/` para trazabilidad. **42% de reduccion** en contenido de la capa ejecutable vs v2, sin perdida de funcionalidad.

---

## Inicio Rapido

### Prerequisitos

- [Obsidian](https://obsidian.md) (gratis)
- [OpenCode](https://opencode.ai) (herramienta CLI para desarrollo con IA)
- Al menos una API key de un modelo de IA (Claude, GPT-4, Gemini, etc.)

### Instalacion

```bash
# 1. Clonar el repositorio
git clone https://github.com/Ntizar/ntizar-mastermind.git

# 2. Abrir la carpeta como vault de Obsidian
#    (Archivo > Abrir boveda > Abrir carpeta como boveda)

# 3. Configurar tus API keys en OpenCode
#    (ver docs de OpenCode para setup)

# 4. Verificar la instalacion
./verify-system.bat    # Windows
# o verificar manualmente: 11 agentes, 4 comandos, todos los directorios existen

# 5. Iniciar el sistema
opencode
# Luego ejecutar: /ntizar-start
```

### Primera Tarea

Una vez que el sistema arranca, simplemente dale una tarea:

```
"Crea una landing page para mi portfolio con soporte de modo oscuro"
```

El orquestador:
1. La clasificara (desarrollo web, complejidad media)
2. Propondra un flujo y asignacion de modelos
3. Esperara tu confirmacion
4. Ejecutara el pipeline completo
5. Archivara lo que aprendio

---

## Estructura del Proyecto

```
ntizar-mastermind/
|
|-- AGENTS.md                    # Punto de entrada del sistema
|-- verify-system.bat            # Verificador de instalacion
|
|-- agents/                      # CAPA DOCUMENTAL (Obsidian)
|   |-- 00-orchestrator.md       # ... hasta 10-librarian.md
|   |-- session-prompt.md        # Prompt de activacion manual
|   |-- state/                   # Config del sistema + estado de sesion
|   |-- templates/               # Intake de tareas, specs, reviews, proyectos, learnings
|   |-- skills/                  # Conocimiento de dominio (4 activos)
|   |-- learnings/               # Patrones capturados con metadatos de decaimiento
|   |-- projects/                # Hubs de proyectos + clusters de conocimiento
|
|-- .opencode/                   # CAPA DE EJECUCION (OpenCode runtime)
|   |-- agents/                  # Configs de agentes (YAML + instrucciones minimas)
|   |-- commands/                # Comandos slash (/ntizar-start, etc.)
|
|-- learning-platform/           # App web que ensena el sistema (WIP)
|-- design-system/               # Framework CSS Liquid Glass
|-- docs/                        # Documentacion extendida
```

---

## Sistema de Skills

Los skills son **playbooks de dominio** que los agentes cargan cuando son relevantes:

| Skill | Dominio | Que Anade |
|-------|---------|-----------|
| `software-dev` | Desarrollo de software universal | 6 fases obligatorias, matriz de decisiones, reglas de codigo |
| `dashboard-dev` | Visualizacion de datos | Pipeline de 6 fases, re-aprendizaje dinamico de proyectos pasados |
| `web-deploy` | Hosting compartido Apache | Patron de propagacion single-source, checklists de deploy |
| `pwa-android` | PWA a APK Android | Stack completo: iconos, PWABuilder, verificacion binaria |

Los skills se cargan **bajo demanda** -- solo cuando el clasificador detecta un dominio que coincide. Puedes crear los tuyos usando la plantilla incluida.

---

## Plataforma de Aprendizaje

> **Estado:** Fase 3 en desarrollo

Una plataforma web interactiva que ensena a cualquier persona como construir y usar el sistema Ntizar Mastermind. Disenada para **5 perfiles de usuario** -- desde no-programadores hasta equipos de desarrollo.

**Preview en vivo:** [learning-platform-roan-six.vercel.app](https://learning-platform-roan-six.vercel.app)

Caracteristicas:
- 9 modulos progresivos (M0-M8)
- Contenido adaptado al perfil del usuario
- Gamificacion con XP, niveles y badges
- Sistema de diseno Liquid Glass UI
- Exportacion de certificado en PDF

---

## Hoja de Ruta

### Actual: v3.0 (Marzo 2026)
- [x] Arquitectura de dos capas (Obsidian + OpenCode)
- [x] 11 agentes especializados con responsabilidad unica
- [x] Asignacion multi-modelo por agente
- [x] Sistema de memoria con decaimiento Ebbinghaus
- [x] 4 skills de dominio
- [x] 32+ aprendizajes indexados
- [x] Instalacion portable con verificacion
- [x] Plataforma de aprendizaje (Fase 2 completa)

### Siguiente: v3.1 -- Optimizacion MCP Multi-Agente
- [ ] **Integracion nativa de servidor MCP** -- los agentes se comunican via Model Context Protocol en vez de delegacion por Task tool, habilitando ejecucion paralela real
- [ ] **Sistema de presupuesto de tokens** -- cada agente declara su coste de tokens por adelantado; el orquestador optimiza la asignacion dentro de un presupuesto de sesion
- [ ] **Handoffs de agentes en streaming** -- los agentes pasan resultados parciales al siguiente en el pipeline sin esperar a completarse
- [ ] **Cache de resultados de agentes** -- sub-tareas identicas entre sesiones reutilizan outputs cacheados (con invalidacion consciente del decaimiento)
- [ ] **Reescritura dinamica de flujos** -- el orquestador puede modificar el pipeline en medio de la ejecucion basandose en resultados intermedios

### Futuro: v4.0 -- Inteligencia Colaborativa
- [ ] **Comparticion de conocimiento multi-usuario** -- equipos comparten aprendizajes entre vaults con resolucion de conflictos
- [ ] **Marketplace de skills** -- skills contribuidos por la comunidad (como plugins de Obsidian)
- [ ] **Deteccion de patrones cross-proyecto** -- el sistema identifica patrones entre todos tus proyectos automaticamente
- [ ] **Editor visual de flujos** -- disena pipelines de agentes visualmente en Obsidian
- [ ] **Suite de benchmarks** -- mide el rendimiento del sistema con sets de tareas estandarizados
- [ ] **Plataforma de aprendizaje como motor de onboarding** -- nuevos miembros del equipo aprenden el sistema a traves de tours guiados interactivos

### La Vision

El objetivo final es un sistema donde:
1. **Tu IA mejora cada dia** -- no solo dentro de una sesion, sino a lo largo de meses de conocimiento acumulado
2. **El coste disminuye mientras la calidad aumenta** -- enrutamiento mas inteligente significa menos tokens desperdiciados
3. **Cualquiera puede replicarlo** -- la plataforma de aprendizaje + este repo = transferencia de conocimiento completa
4. **La comunidad lo mejora** -- skills abiertos, aprendizajes abiertos, patrones abiertos

---

## Contribuir

Las contribuciones son bienvenidas. Ver [CONTRIBUTING.md](CONTRIBUTING.md) para las directrices.

Areas donde necesitamos ayuda:
- **Nuevos skills** -- playbooks de dominio para tu area de experiencia
- **Optimizaciones de agentes** -- mejores prompts, flujos mas inteligentes
- **Plataforma de aprendizaje** -- contenido, traducciones, accesibilidad
- **Integracion MCP** -- el trabajo del protocolo multi-agente de v3.1
- **Documentacion** -- tutoriales, guias, videos
- **Testing** -- tareas de benchmark y metricas de calidad

---

## Las 12 Reglas

Estas reglas fueron destiladas de 13 ciclos de uso real y evolucion del sistema:

1. **Flujo completo obligatorio** -- ningun agente se salta
2. **Sincronizacion multi-archivo** -- propagar cambios a todos los archivos afectados
3. **Verificar integridad binaria** -- comprobar magic bytes, no solo extensiones
4. **Deploy consciente de la plataforma** -- conocer las limitaciones de tu hosting
5. **README actualizado con cada version** -- siempre al dia
6. **El humano decide la arquitectura** -- la IA propone, el humano dispone
7. **Clusters dinamicos** -- las categorias de conocimiento crecen organicamente
8. **Carga bajo demanda** -- aprendizajes cargados por relevancia + decaimiento, nunca todos a la vez
9. **Capacidad minima documentada** -- cada agente tiene un suelo
10. **Critico: omitir, nunca degradar** -- la calidad no es negociable
11. **Verificar en vivo antes de entregar** -- siempre confirmar que el deploy funciona
12. **Asignacion de modelos es colaborativa** -- el sistema propone, el humano confirma

---

## Licencia

MIT License. Ver [LICENSE](LICENSE).

---

## Por Que "Mastermind"?

Porque un mastermind no es un solo genio -- es un grupo de mentes especializadas trabajando juntas hacia un objetivo comun. Eso es exactamente lo que hace este sistema: 11 agentes, cada uno brillante en una cosa, orquestados para resolver problemas que ningun prompt individual podria manejar.

---

<p align="center">
  Construido con obsesion por <a href="https://github.com/Ntizar">@Ntizar</a>
  <br/>
  <sub>Si este sistema te ahorra tiempo, pasalo.</sub>
</p>
