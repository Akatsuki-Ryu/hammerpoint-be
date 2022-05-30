
FROM node:17

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
COPY package.json .
RUN npm install

# Bundle app source
COPY . .

# Exports
EXPOSE 3002
#RUN npm start
CMD ["npm", "start"]

