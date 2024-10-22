@echo off
:menu
cls
echo 1. Crear y ejecutar el broker
echo 2. reiniciar el broker
echo 3. frenar el borker
echo 4. iniciar el broker
echo 5. eliminar el broker
echo.
set /p choice="Elige una opcion: "

if %choice%==1 goto create_borker
if %choice%==2 goto restart_broker
if %choice%==3 goto stop_broker
if %choice%==4 goto start_broker
if %choice%==5 goto delete_broker
goto menu

:create_borker
cls
docker run -d --name mosquitto-broker -p 1883:1883 -v /mosquitto.conf:/mosquitto/mosquitto.conf eclipse-mosquitto
pause
goto menu

:restart_broker
cls
docker restart mosquitto-broker
pause
goto menu

:stop_broker
cls
docker stop mosquitto-broker
pause
goto menu

:start_broker
cls
docker start mosquitto-broker
pause
goto menu


:delete_broker
cls
docker rm mosquitto-broker
pause
goto menu

