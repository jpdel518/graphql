const { ApolloServer, gql } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config()

// DataSourceはREST API用のデータソースライブラリ
// データのキャッシュ等を自動で行ってくれる
// fetchの途中でinterceptして、headerにtokenを追加するなどの処理も可能
class jsonPlaceAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://jsonplaceholder.typicode.com/';
    }

    async getUsers() {
        const response = await this.get('users');
        return response;
    }

    async getUser(id) {
        const response = await this.get(`users/${id}`);
        return response;
    }

    async getPosts() {
        const response = await this.get('posts');
        return response;
    }
}

const typeDefs = gql`
    type User {
        id: ID!
        name: String
        email: String!
        client_id: String!
        client_secret: String!
        client_code: String
        client_token: String
        myPosts: [Post]
    }
    type JsonPlaceUser {
        id: ID!
        name: String
        email: String!
        myPosts: [Post]
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        userId: ID!
    }

    type Query {
        hello(name: String!): String
        jsonPlaceUsers: [JsonPlaceUser!]!
        jsonPlaceUser(id: ID!): JsonPlaceUser
        posts: [Post!]!
        me: User
    }

    type Mutation {
        getCode(client_id: String!): String
        signup(name: String!, email: String!, client_id: String!, client_secret: String!): User
        signin(client_id: String!): User
        oauth(client_id: String!, client_code: String!): String
        updateUser(id: Int!, name: String, email: String): User
        deleteUser(id: Int!): User
    }
`;

const resolvers = {
    Query: {
        hello: (parent, args) => {
            console.log('parent', parent);
            console.log('args', args);
            return `Hello world! ${args.name}`;
        },
        // 使用しない引数はアンダースコアで省略するのが通例（parent => _, args => __）
        jsonPlaceUsers: async (_, __, { dataSources, currentUser }) => {
            // const response = await axios.get('https://jsonplaceholder.typicode.com/users');
            // return response.data;
            if (!currentUser) throw new Error("Not verified user requested");
            return dataSources.jsonPlaceAPI.getUsers();
        },
        jsonPlaceUser: async (_, args, { dataSources, currentUser }) => {
            // let response = await axios.get(`https://jsonplaceholder.typicode.com/users/${args.id}`);
            // response = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${args.id}`);
            // user = Object.assign({}, user, { myPosts: response.data });
            // return response.data;
            if (!currentUser) throw new Error("Not verified user requested");
            return dataSources.jsonPlaceAPI.getUser(args.id);
        },
        posts: async (_, __, { dataSources, currentUser }) => {
            // const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
            // return response.data;
            if (!currentUser) throw new Error("Not verified user requested");
            return dataSources.jsonPlaceAPI.getPosts();
        },
        me: (_, __, { currentUser }) => (currentUser)
    },
    Mutation: {
        getCode: async (_, args) => {
            // const response = await axios.get(`https://github.com/login/oauth/authorize?client_id=${args.client_id}&scope=user`);
            // console.log('aaaaa', response);
                return `https://github.com/login/oauth/authorize?client_id=${args.client_id}&scope=user`;
        },
        signup: async (_, args) => {
            // const response = await axios.get(`https://github.com/login/oauth/authorize?client_id=${args.clientId}&scope=user`);
            // console.log('signup', response);
            let user = await prisma.user.create({
                data: {
                    name: args.name,
                    email: args.email,
                    client_id: args.client_id,
                    client_secret: args.client_secret,
                }
            });
            console.log("signup user", user);
        },
        signin: async (_, args) => {
            console.log("signin args", args);
            let user = await prisma.user.findFirst({
                where: {
                    client_id: args.client_id,
                }
            });
            console.log("signin user", user);

            return user;
        },
        oauth: async (_, args) => {
            console.log("oauth args", args);
            let user = await prisma.user.findFirst({
                where: {
                    client_id: args.client_id,
                }
            });
            console.log("oauth user", user);
            if (!user) return null;

            const response = await axios.post(`https://github.com/login/oauth/access_token`, {
                client_id: user.client_id,
                client_secret: user.client_secret,
                code: args.client_code,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            });
            const data = JSON.parse(JSON.stringify(response.data));
            console.log("oauth token", data);
            if (data.error) throw new Error(data.error);

            user = await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    name: data.name,
                    client_code: args.client_code,
                    client_token: data.access_token,
                }
            });
            return user.client_token;
        },
        // name, emailのどちらかがあれば更新
        // 値が入っていない方のデータは更新されずにそのままになる
        updateUser: (_, args, { currentUser }) => {
            if (!currentUser) throw new Error("Not verified user requested");
            return prisma.user.update({
                where: {
                    id: args.id
                },
                data: {
                    name: args.name,
                    email: args.email
                }
            });
        },
        deleteUser: (_, args, { currentUser }) => {
            if (!currentUser) throw new Error("Not verified user requested");
            return prisma.user.delete({
                where: {
                    id: args.id
                }
            });
        }
    },
    User: {
        myPosts: async (parent, __, { dataSources }) => {
            // const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
            const posts = await dataSources.jsonPlaceAPI.getPosts();
            return posts.filter(post => post.userId === parent.id);
        }
    }
};

const prisma = new PrismaClient();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const token = req.headers.authorization || "";
        const currentUser = await prisma.user.findFirst({
            where: {
                client_token: token
            }
        });
        console.log("context headerToken", token);
        console.log("context currentUser", currentUser);
        return { currentUser }
    },
    dataSources: () => ({ jsonPlaceAPI: new jsonPlaceAPI() })
});
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
