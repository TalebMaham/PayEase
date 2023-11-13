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
        db.query('SELECT * FROM Users', (error, results) => {
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
        db.query(
          'INSERT INTO CartItem (userId, productId, quantity) VALUES (?, ?, ?)',
          [args.userId, args.productId, args.quantity],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              // Vous pouvez retourner l'utilisateur mis à jour après l'ajout au panier
              resolve(resolvers.Query.user(null, { id: args.userId }));
            }
          }
        );
      });
    },
    removeFromCart: (parent, args) => {
      return new Promise((resolve, reject) => {
        // Supposons que vous ayez une table CartItems pour gérer les éléments du panier
        db.query(
          'DELETE FROM CartItems WHERE userId = ? AND productId = ?',
          [args.userId, args.productId],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              // Vous pouvez retourner l'utilisateur mis à jour après le retrait du produit du panier
              resolve(resolvers.Query.user(null, { id: args.userId }));
            }
          }
        );
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
    purchaseCart: (parent, args) => {
      return new Promise(async (resolve, reject) => {
        const { userId } = args;
        try {
          // Récupérez le contenu du panier de l'utilisateur
          const [cart] = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM CartItems WHERE userId = ?', [userId], (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            });
          });
    
          if (!cart) {
            throw new Error('Aucun panier trouvé');
          }
    
          // Parcourez les éléments du panier pour vérifier la disponibilité des produits
          for (const item of cart) {
            const productId = item.productId;
            const quantityInCart = item.quantity;
    
            // Récupérez la quantité disponible du produit dans la base de données
            const [product] = await new Promise((resolve, reject) => {
              db.query('SELECT inventory FROM Products WHERE id = ?', [productId], (error, results) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              });
            });
    
            if (!product) {
              throw new Error(`Produit avec l'ID ${productId} introuvable`);
            }
    
            const availableQuantity = product.inventory;
    
            // Vérifiez si la quantité dans le panier est disponible en stock
            if (quantityInCart > availableQuantity) {
              throw new Error(`Quantité insuffisante pour le produit avec l'ID ${productId}`);
            }
          }
    
          // Si toutes les vérifications passent, effectuez l'achat en mettant à jour le stock des produits
          for (const item of cart) {
            const productId = item.productId;
            const quantityInCart = item.quantity;
    
            // Mettez à jour la quantité disponible du produit dans la base de données
            await new Promise((resolve, reject) => {
              db.query(
                'UPDATE Products SET inventory = inventory - ? WHERE id = ?',
                [quantityInCart, productId],
                (error, results) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(results);
                  }
                }
              );
            });
          }
    
          // Supprimez les éléments du panier après l'achat
          await new Promise((resolve, reject) => {
            db.query('DELETE FROM CartItem WHERE userId = ?', [userId], (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            });
          });
    
          // Retournez l'utilisateur mis à jour
          const updatedUser = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM Users WHERE id = ?', [userId], (error, results) => {
              if (error) {
                reject(error);
              } else if (results.length === 0) {
                reject(new Error('Utilisateur introuvable'));
              } else {
                resolve(results[0]);
              }
            });
          });
    
          resolve(updatedUser);
        } catch (error) {
          reject(error);
        }
      });
    },
    
    loginUser: async (parent, args) => {
      const { username, password } = args;
      try {
        // Recherchez l'utilisateur dans la base de données par nom d'utilisateur et mot de passe
        const [user] = await new Promise((resolve, reject) => {
          db.query(
            'SELECT * FROM Users WHERE username = ? AND password = ?',
            [username, password],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
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
