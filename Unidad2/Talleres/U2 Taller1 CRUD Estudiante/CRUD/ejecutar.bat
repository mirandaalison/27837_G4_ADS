@echo off
echo ============================================================
echo   COMPILADOR Y EJECUTOR - CRUD ESTUDIANTES
echo   Arquitectura 3 Capas + Patron MVC
echo ============================================================
echo.

echo [1/3] Creando directorio de salida...
if not exist "out" mkdir out

echo [2/3] Compilando clases Java...
javac -d out -cp out src/main/java/ec/edu/espe/datos/model/*.java src/main/java/ec/edu/espe/datos/repository/*.java src/main/java/ec/edu/espe/logica_negocio/*.java src/main/java/ec/edu/espe/presentacion/*.java

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: No se pudo compilar el proyecto
    pause
    exit /b 1
)

echo [3/3] Iniciando aplicacion...
echo.
cd out
java ec.edu.espe.presentacion.Main

echo.
echo La aplicacion ha terminado.
pause