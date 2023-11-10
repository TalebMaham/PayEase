const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Product {
    id: Int!
    name: String!
    price: Float!
    inventory: Int!
  }

  type CartItem {
    id: Int!
    product: Product!
    quantity: Int!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    password: String! # Ne renvoyez jamais le mot de passe en clair depuis le serveur GraphQL
    cart: [CartItem]
  }

  type Query {
    products: [Product]
    user(id: ID!): User
    users: [User] # Ajout de cette requête pour récupérer tous les utilisateurs
  }

  type Mutation {
    addToCart(userId: ID!, productId: Int!, quantity: Int!): User
    removeFromCart(userId: ID!, productId: Int!): User
    clearCart(userId: ID!): User
    loginUser(username: String!, password: String!): User
    # Ajoutez la mutation loginUser qui prend un nom d'utilisateur et un mot de passe
  }
`;

module.exports = typeDefs;
