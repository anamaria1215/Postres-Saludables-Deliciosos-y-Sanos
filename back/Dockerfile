FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3002
CMD ["npm", "run", "start"]

#ARCHIVO DOCKERFILE PREPARADO, AÚN NO IMPLEMENTADO