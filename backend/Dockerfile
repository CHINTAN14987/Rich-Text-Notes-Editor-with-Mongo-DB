FROM node:14.17.1

# Working dir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy package Json file
COPY package*.json ./

# Install Prettier (For our package's build function)
RUN npm install prettier -g

# Install Files
RUN npm install

# copy Source files
COPY ./ .

#expose the port
EXPOSE 8080

# Build
CMD npm start   