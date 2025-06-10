# Imagen base de Node
FROM node:18

# Carpeta de trabajo en el contenedor
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto 4001
EXPOSE 4001

# Comando para iniciar la app
CMD ["npm", "start"]
