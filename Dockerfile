FROM node:14.18.0

# Add Maintainer Info
LABEL maintainer="Rahul Sharma <rahul@3embed.com>"
RUN mkdir -p /webapp
ADD . /webapp
WORKDIR /webapp

# Download all dependencies. 
COPY package*.json ./
RUN npm install --no-optional
RUN npm install -D @swc/cli @swc/core
# RUN npm audit fix
RUN npm cache clean --force
RUN npm run build

# Copy the source from the current directory to the Working Directory inside the container
COPY . .

# Command to run the executable
USER root
EXPOSE 3002/tcp
CMD ["node", "server.js"]
