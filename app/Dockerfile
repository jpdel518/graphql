FROM node:19

WORKDIR /var/www/app

COPY src/package*.json .

RUN npm install

COPY src .

EXPOSE 3000

ENTRYPOINT ["/bin/sh", "-c", "while :; do sleep 10; done"]
CMD [ "node", "index.js" ]
