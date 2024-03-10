FROM ubuntu:latest
RUN apt-get update && apt-get install -y \
    build-essential \        
    python3 \                
    nodejs \                 
    default-jdk              

RUN gcc --version && g++ --version && python3 --version && node --version && javac -version

WORKDIR /usr/src/app

COPY package*.json ./

# RUN npm install

# Copy the rest of the application code
# COPY . .

# Expose the port the app runs on (if needed)
# EXPOSE 3000

# Command to run the application (if needed)
CMD ["app.handler"]