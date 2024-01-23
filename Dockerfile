FROM node:18
ENV PORT=8080
ENV TOKEN_SIGNATURE=tokenPass
ENV MONGO_URI=mongodb+srv://dario:741456@cluster0.z1ldbfa.mongodb.net/chat?retryWrites=true&w=majority
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "node", "src/index.js"]
