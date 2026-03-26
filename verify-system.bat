@echo off
REM verify-system.bat — Ntizar Brain v3
REM Verifica que todos los archivos del sistema existen.
REM Usar despues de clonar, copiar a nuevo PC, o cuando algo no funciona.

echo.
echo ========================================
echo  Ntizar Brain v3 — System Check
echo ========================================
echo.

set WORKSPACE=%~dp0

echo --- .opencode/agents/ ---
set COUNT=0
for %%f in ("%WORKSPACE%.opencode\agents\ntizar-*.md") do (
    echo   [OK] %%~nxf
    set /a COUNT+=1
)
if %COUNT%==0 echo   [ERROR] No se encontraron agentes
echo   Total: %COUNT% (esperados: 11)

echo.
echo --- .opencode/commands/ ---
set CMDCOUNT=0
for %%f in ("%WORKSPACE%.opencode\commands\ntizar-*.md") do (
    echo   [OK] %%~nxf
    set /a CMDCOUNT+=1
)
if %CMDCOUNT%==0 echo   [ERROR] No se encontraron comandos
echo   Total: %CMDCOUNT% (esperados: 4)

echo.
echo --- agents/ (Obsidian) ---
for %%f in ("%WORKSPACE%agents\0*.md" "%WORKSPACE%agents\1*.md") do (
    echo   [DOC] %%~nxf
)

echo.
echo --- Directorios ---
if exist "%WORKSPACE%agents\learnings\archive" (echo   [OK] learnings/archive/) else (echo   [WARN] learnings/archive/ no existe)
if exist "%WORKSPACE%agents\state" (echo   [OK] agents/state/) else (echo   [ERROR] agents/state/ no existe)
if exist "%WORKSPACE%agents\skills" (echo   [OK] agents/skills/) else (echo   [ERROR] agents/skills/ no existe)
if exist "%WORKSPACE%agents\projects" (echo   [OK] agents/projects/) else (echo   [ERROR] agents/projects/ no existe)

echo.
echo ========================================
echo  Check completo. Ver _system-config.md
echo  para la tabla de agentes esperados.
echo ========================================
echo.
pause
