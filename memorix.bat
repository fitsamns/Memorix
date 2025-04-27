@echo off
title Memorix - Controle de Flashcards
color 0B
cls

:menu
echo.
echo  ___________________________________________________________
echo ^|                                                         ^|
echo ^|                MEMORIX - FLASHCARDS APP                 ^|
echo ^|_________________________________________________________^|
echo ^|                                                         ^|
echo ^|  Sistema de repeticao com algoritmo SM-2                ^|
echo ^|  [React + TypeScript + Vite + TailwindCSS]              ^|
echo ^|_________________________________________________________^|
echo.
echo  [1] Instalar dependencias (npm install)
echo  [2] Iniciar servidor de desenvolvimento (npm run dev)
echo  [3] Limpar node_modules e cache
echo  [4] Abrir no VS Code
echo  [5] Sair
echo.

set /p choice=Escolha uma opcao: 

if "%choice%"=="1" goto install
if "%choice%"=="2" goto dev
if "%choice%"=="3" goto clean
if "%choice%"=="4" goto vscode
if "%choice%"=="5" exit

echo Opcao invalida! Escolha de 1 a 5.
goto menu

:install
echo.
echo  Instalando dependencias...
npm install
if %errorlevel% neq 0 (
    echo  ERRO: Falha na instalacao. Verifique sua conexao.
    pause
)
goto menu

:dev
echo.
echo  Iniciando servidor de desenvolvimento...
echo  Abra http://localhost:5173 no navegador
npm run dev
if %errorlevel% neq 0 (
    echo  ERRO: Servidor nao iniciado. Verifique os logs.
    pause
)
goto menu

:clean
echo.
echo  Limpando dependencias...
rd /s /q node_modules 2>nul
npm cache clean --force
echo  Limpeza concluida!
goto menu

:vscode
echo.
echo  Abrindo projeto no VS Code...
code .
goto menu
