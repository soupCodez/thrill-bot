FROM ubuntu:latest

RUN mkdir -p /usr/src/thrill-bot
WORKDIR /usr/src/thrill-bot

COPY package.json /usr/src/thrill-bot

COPY node.sh /usr/src/thrill-bot

RUN bash -c "apt-get install nodejs"

RUN npm install
RUN npm install pm2 -g

COPY . /usr/src/thrill-bot

CMD ["pm2-runtime", "process.yml"]
# CMD ["node", "index.js"]