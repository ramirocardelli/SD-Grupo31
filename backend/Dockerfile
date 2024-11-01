
# Usa una imagen base oficial de Node.js
FROM node:latest

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto de la aplicación
EXPOSE 3000

CMD ["node", "index.js"]