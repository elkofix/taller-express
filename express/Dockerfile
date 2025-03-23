# Usamos una imagen oficial de Node.js
FROM node:18-alpine

# Establecemos el directorio de trabajo en el contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto de la aplicación
COPY . .

# Exponemos el puerto de Express
EXPOSE 3000

# Iniciamos la aplicación
CMD ["npm", "run", "dev"]
