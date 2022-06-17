# pull the base image
FROM node:14

# set the working direction
WORKDIR /src/server

# # add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./

COPY package-lock.json ./

RUN npm install

# add app
COPY . .
# Binding port
EXPOSE 8080

# RUN npm run build
# start app
CMD ["npm", "run build:gcp"]