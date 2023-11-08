const db = require('../db/db');

const resolvers = {
  Query: {
    products: () => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Products', (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    },
    user: (parent, args) => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Users WHERE id = ?', [args.id], (error, results) => {
          if (error) {
            reject(error);
          } else if (results.length === 0) {
            resolve(null); // Aucun utilisateur trouvé
          } else {
            const user = results[0];
            // Vous pouvez formater les données ici si nécessaire
            resolve(user);
          }
        });
      });
    },
  },
  Mutation: {
    addToCart: (parent, args) => {
      return new Promise((resolve, reject) => {
        // Supposons que vous ayez une table CartItems pour gérer les éléments du panier
        db.query('INSERT INTO CartItems (userId, productId, quantity) VALUES (?, ?, ?)', [args.userId, args.productId, args.quantity], (error, results) => {
          if (error) {
            reject(error);
          } else {
            // Vous pouvez retourner l'utilisateur mis à jour après l'ajout au panier
            resolve(resolvers.Query.user(null, { id: args.userId }));
          }
        });
      });
    },
    removeFromCart: (parent, args) => {
      return new Promise((resolve, reject) => {
        // Supposons que vous ayez une table CartItems pour gérer les éléments du panier
        db.query('DELETE FROM CartItems WHERE userId = ? AND productId = ?', [args.userId, args.productId], (error, results) => {
          if (error) {
            reject(error);
          } else {
            // Vous pouvez retourner l'utilisateur mis à jour après le retrait du produit du panier
            resolve(resolvers.Query.user(null, { id: args.userId }));
          }
        });
      });
    },
    clearCart: (parent, args) => {
      return new Promise((resolve, reject) => {
        // Supposons que vous ayez une table CartItems pour gérer les éléments du panier
        db.query('DELETE FROM CartItems WHERE userId = ?', [args.userId], (error, results) => {
          if (error) {
            reject(error);
          } else {
            // Vous pouvez retourner l'utilisateur mis à jour après avoir vidé le panier
            resolve(resolvers.Query.user(null, { id: args.userId }));
          }
        });
      });
    },
  },
};

module.exports = resolvers;
