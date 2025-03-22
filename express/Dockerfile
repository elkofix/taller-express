# Usamos una imagen oficial de Node.js basada en Alpine
FROM node:18-alpine

# Instalar dependencias necesarias para bcrypt
RUN apk add --no-cache python3 make g++ 

# Establecemos el directorio de trabajo en el contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos las dependencias nuevamente dentro del contenedor
RUN npm install && npm rebuild bcrypt --build-from-source

# Copiamos el resto de la aplicación
COPY . .

# Exponemos el puerto de Express
EXPOSE 3000

# Iniciamos la aplicación
CMD ["npm", "run", "dev"]
