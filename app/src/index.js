const { ApolloServer, gql } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
        name: String!
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
        users: [User!]!
        user(id: ID!): User
        posts: [Post!]!
    }

    type Mutation {
        createUser(name: String!, email: String!): User
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
        users: async (_, __, { dataSources }) => {
            // const response = await axios.get('https://jsonplaceholder.typicode.com/users');
            // return response.data;
            return dataSources.jsonPlaceAPI.getUsers();
        },
        user: async (_, args, { dataSources }) => {
            // let response = await axios.get(`https://jsonplaceholder.typicode.com/users/${args.id}`);
            // response = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${args.id}`);
            // user = Object.assign({}, user, { myPosts: response.data });
            // return response.data;
            return dataSources.jsonPlaceAPI.getUser(args.id);
        },
        posts: async (_, __, { dataSources }) => {
            // const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
            // return response.data;
            return dataSources.jsonPlaceAPI.getPosts();
        }
    },
    Mutation: {
        createUser: (_, args) => {
            return prisma.user.create({
                data: {
                    name: args.name,
                    email: args.email
                }
            });
        },
        // name, emailのどちらかがあれば更新
        // 値が入っていない方のデータは更新されずにそのままになる
        updateUser: (_, args) => {
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
        deleteUser: (_, args) => {
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

const server = new ApolloServer({ typeDefs, resolvers, dataSources: () => ({ jsonPlaceAPI: new jsonPlaceAPI() }) });
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
