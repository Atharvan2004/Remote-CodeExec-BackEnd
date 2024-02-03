FROM ubuntu:20.04

RUN apt update && apt install -y tcl
RUN apt-get install curl gnupg -y
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install nodejs -y
RUN node -v
RUN npm -v

# Install Python
RUN apt-get install -y python3 python3-pip

# Install Java
RUN apt-get install -y openjdk-11-jdk

# Install C and C++ compilers
RUN apt-get install -y build-essential

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
RUN npm install -g ts-node

COPY . .
RUN mkdir temp

CMD ["npm", "run", "dev"]

EXPOSE 3000