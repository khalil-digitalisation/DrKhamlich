@echo off
REM ---------------------------------------------------------------
REM  Apercu local du site avec l'iframe Reservio fonctionnelle.
REM
REM  Reservio impose "frame-ancestors https:" : l'iframe reste blanche
REM  en double-clic (file://) et en http://localhost. Il faut une vraie
REM  origine https:// -> ce script s'en charge.
REM
REM  Fichier de TEST uniquement. Ne pas deployer sur le site.
REM ---------------------------------------------------------------
cd /d "%~dp0"

echo Demarrage du serveur HTTPS local...
start "serveur-https-drkhamlich" /min python "%~dp0_preview-server.py"

timeout /t 3 /nobreak >nul

echo Ouverture de Chrome...
set "PROFIL=%TEMP%\drkhamlich-preview"
start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" ^
  --ignore-certificate-errors ^
  --user-data-dir="%PROFIL%" ^
  --no-first-run ^
  "https://localhost:8443/index.html#rdv"

echo.
echo ================================================================
echo  Apercu ouvert : https://localhost:8443/index.html
echo.
echo  Chrome s'ouvre dans une fenetre de TEST isolee, autorisant le
echo  certificat local. C'est normal et sans effet sur votre Chrome
echo  habituel.
echo.
echo  Pour arreter : fermez cette fenetre noire.
echo ================================================================
echo.
pause
