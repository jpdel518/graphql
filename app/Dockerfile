FROM node:19

WORKDIR /var/www/app

COPY src/package*.json .

RUN npm install

COPY src .

EXPOSE 4000

#ENTRYPOINT ["/bin/sh", "-c", "while :; do sleep 10; done"]
#CMD [ "node", "index.js" ]
CMD [ "npx", "nodemon", "index.js" ]
