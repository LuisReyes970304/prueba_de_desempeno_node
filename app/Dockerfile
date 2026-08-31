FROM node:24-alpine

WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código de la aplicación
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 3015

# Ejecutar aplicación en desarrollo
CMD ["npm", "run", "start"]
