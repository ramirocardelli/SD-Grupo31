FROM eclipse-mosquitto:latest
RUN mkdir -p /mosquitto/config
COPY mosquitto.conf /mosquitto/config/mosquitto.conf
COPY usuarios /mosquitto/config/usuarios
RUN mosquitto_passwd -U /mosquitto/config/usuarios
EXPOSE 1883
CMD ["/usr/sbin/mosquitto", "-c", "/mosquitto/config/mosquitto.conf"] 
