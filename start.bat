@echo off
echo ========================================
echo      NoteMaster - Démarrage Auto
echo ========================================
echo.

echo Démarrage du serveur backend...
start "Backend" cmd /k "cd /d %~dp0backend && npm run dev"

echo Attente de 3 secondes...
timeout /t 3 /nobreak >nul

echo Démarrage du serveur frontend...
start "Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ========================================
echo Les deux serveurs sont en cours de démarrage !
echo - Backend API : http://localhost:3001/api
echo - Frontend : http://localhost:3000
echo ========================================
echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause >nul
