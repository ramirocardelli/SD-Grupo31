@echo off
:menu
cls
echo 1. Crear imagen
echo 2. ver imagenes creadas (FIJARSE ANTES DE CREAR)
echo 3. eliminar imagen (FIJARSE ANTES DE ELIMINAR)
echo 4. crear y ejecutar broker (DEBE TENER IMAGEN CREADA)
echo 5. frenar el borker
echo 6. iniciar el broker
echo 7. eliminar el broker
echo 8. cargar usuarios (DEBE ESTAR EL CONTENEDOR CORRIENDO)
echo.
set /p choice="Elige una opcion: "

if %choice%==1 goto create_image
if %choice%==2 goto list_images
if %choice%==3 goto delete_image
if %choice%==4 goto create_borker
if %choice%==5 goto stop_broker
if %choice%==6 goto start_broker
if %choice%==7 goto delete_broker
if %choice%==8 goto create_user
goto menu

:create_image
cls
docker build -t imagen_docker_configurado .
pause
goto menu

:list_images
cls
docker images
pause
goto menu

:delete_image
cls
docker rmi imagen_docker_configurado
pause
goto menu

:create_borker
cls
docker run -d --name mosquitto-broker -p 1883:1883 imagen_docker_configurado
pause
docker exec -it mosquitto-broker mosquitto_passwd -U /mosquitto/config/usuarios
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

:create_user
cls
docker cp usuarios mosquitto-broker:/mosquitto/config/
docker exec -it mosquitto-broker mosquitto_passwd -U /mosquitto/config/usuarios
docker restart mosquitto-broker
pause
goto menu



