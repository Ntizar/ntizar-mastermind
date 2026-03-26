@echo off
setlocal EnableDelayedExpansion
title Brain Academy - Server
cd /d "%~dp0"

echo.
echo  ╔══════════════════════════════════════╗
echo  ║     BRAIN ACADEMY - Learning v2      ║
echo  ╚══════════════════════════════════════╝
echo.

:: Check de archivos requeridos
echo  [CHECK] Verificando archivos...
set "MISSING="
for %%f in (index.html sandbox.html sandbox.js modules-v2.json platform-v2.js profiles.json ntizar.css) do (
    if not exist "%%f" set "MISSING=%%f"
)
if defined MISSING (
    echo  [ERROR] Falta: %MISSING%
    echo.
    echo  Asegurate de estar en la carpeta learning-platform/
    pause
    exit /b 1
)
echo  [OK] Todos los archivos encontrados
echo.

:: Intentar Python 3
where python >nul 2>&1
if %ERRORLEVEL%==0 (
    python -c "import sys; exit(0 if sys.version_info[0]>=3 else 1)" 2>nul
    if !ERRORLEVEL!==0 (
        echo  [OK] Python 3 detectado
        echo.
        echo  Servidor en: http://localhost:8000
        echo  Abriendo navegador...
        start http://localhost:8000
        echo.
        echo  Para parar: cierra esta ventana o presiona Ctrl+C
        echo.
        python -m http.server 8000
        goto :fin
    )
)

:: Intentar Python 2 (fallback)
where python2 >nul 2>&1
if %ERRORLEVEL%==0 (
    echo  [OK] Python 2 detectado
    echo.
    echo  Servidor en: http://localhost:8000
    echo  Abre el navegador en esa URL
    echo  Para parar: cierra esta ventana o presiona Ctrl+C
    echo.
    python2 -m SimpleHTTPServer 8000
    goto :fin
)

:: Intentar Node.js
where node >nul 2>&1
if %ERRORLEVEL%==0 (
    echo  [OK] Node.js detectado
    echo.
    echo  Iniciando http-server...
    echo.
    echo  Servidor en: http://localhost:8080
    echo  Abriendo navegador...
    start http://localhost:8080
    echo.
    echo  Para parar: cierra esta ventana o presiona Ctrl+C
    echo.
    npx http-server . -p 8080 -c-1
    goto :fin
)

:: Intentar PHP
where php >nul 2>&1
if %ERRORLEVEL%==0 (
    echo  [OK] PHP detectado
    echo.
    echo  Servidor en: http://localhost:8080
    echo  Abriendo navegador...
    start http://localhost:8080
    echo.
    echo  Para parar: cierra esta ventana o presiona Ctrl+C
    echo.
    php -S localhost:8080
    goto :fin
)

:: Nada encontrado
echo  [ERROR] No se detecto ningun servidor disponible.
echo.
echo  Instala UNO de estos:
echo.
echo    1. Python 3  → https://www.python.org/downloads/
echo       (marca "Add to PATH" al instalar)
echo.
echo    2. Node.js   → https://nodejs.org/
echo       (version LTS recomendada)
echo.
echo  Opciones recomendadas:
echo    - Windows: Python 3 (mas simple)
echo    - Dev: Node.js con npx http-server
echo.
echo  Despues de instalar, ejecuta este .bat otra vez.
echo.
pause

:fin
