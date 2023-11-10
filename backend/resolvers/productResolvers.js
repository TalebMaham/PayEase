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
    users: () => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM User', (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    },
  },
  Mutation: {
    addToCart: (parent, args) => {
      return new Promise((resolve, reject) => {
        // Supposons que vous ayez une table CartItems pour gérer les éléments du panier
        db.query('INSERT INTO CartItem (userId, productId, quantity) VALUES (?, ?, ?)', [args.userId, args.productId, args.quantity], (error, results) => {
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

    loginUser: async (parent, args) => {
      const { username, password } = args;
      try {
        // Recherchez l'utilisateur dans la base de données par nom d'utilisateur et mot de passe
        const [user] = await new Promise((resolve, reject) => {
          db.query('SELECT * FROM User WHERE username = ? AND password = ?', [username, password], (error, results) => {
            if (error) {
              console.log("erreur apres la requette ..."); 
              reject(error);
            } else {
              resolve(results);
            }
          });
        });

        if (!user) {
          throw new Error('Échec de l\'authentification');
        }

        // Ici, vous pouvez gérer l'état d'authentification, par exemple en stockant l'ID de l'utilisateur dans une session
        // Vous devrez mettre en œuvre la gestion de session côté serveur (par exemple, avec Express.js) pour cela

        return { ...user };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    
  },
};

module.exports = resolvers;
