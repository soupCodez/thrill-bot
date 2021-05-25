FROM node:latest

RUN su root
RUN mkdir -p /usr/src/thrill-bot
WORKDIR /usr/src/thrill-bot

COPY package.json /usr/src/thrill-bot

# RUN echo "deb https://ftp.ca.debian.org/debian bullseye main" | tee -a /etc/apt/sources.list

# RUN apt update
# RUN apt install -y wget
# RUN wget https://unofficial-builds.nodejs.org/download/release/v16.2.0/node-v16.2.0-linux-armv6l.tar.gz
# RUN tar -xzf node-v16.2.0-linux-armv6l.tar.gz
# RUN cd node-v16.2.0-linux-armv6l
# RUN cp -R * /usr/local

# RUN npm install
# RUN npm install pm2 -g

COPY . /usr/src/thrill-bot

# # CMD ["pm2-runtime", "process.yml"]
# CMD ["node", "index.js"]