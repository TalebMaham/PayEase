const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./resolvers/productResolvers');
const db = require('./db/db');

const app = express();
const port = process.env.PORT || 4000;

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startServer().then(() => {
  app.listen(port, () => {
    console.log(`Serveur GraphQL prêt à l'écoute sur http://localhost:${port}/graphql`);
  });
});



