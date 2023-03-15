## First launch

### Ready
/app/DockerfileのENTRYPOINTのコメントを外す

### Build
docker-compose up -d --build

### Check（get container id）
docker ps

### Exec
docker exec -it node sh

### npm init
npm init -y

### ApolloServer & GraphQL
npm install apollo-server graphql

### Nodemon
npm install --save-dev nodemon
npx nodemon index.js
