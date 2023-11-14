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

  type Cart {
    userId: ID!
    items: [CartItem]!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
  }

  type Query {
    products: [Product]
    user(id: ID!): User
    users: [User]
    userCart(userId: ID!): Cart
  }

  type Mutation {
    addToCart(userId: ID!, productId: Int!, quantity: Int!): User
    removeFromCart(userId: ID!, productId: Int!): User
    clearCart(userId: ID!): User
    purchaseCart(userId: ID!): User  # Ajouter une mutation pour l'achat du panier
    loginUser(username: String!, password: String!): User
  }
`;

module.exports = typeDefs;
