FROM node:18
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
# RUN npm install
# If you are building your code for production
RUN npm ci --omit=dev
RUN npm i -g prisma
RUN prisma generate
# Bundle app source
COPY . .
EXPOSE 8080
CMD [ "node", "./bin/www" ]