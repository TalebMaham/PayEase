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
    userCart: (parent, args) => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM CartItems WHERE userId = ?', [args.userId], async (error, results) => {
          if (error) {
            reject(error);
          } else {
            // Rassemblez les éléments du panier à partir des résultats de la requête
            const cartItems = [];

            for (const row of results) {
              // Récupérez les détails du produit associé à cet élément du panier
              const [productInfo] = await new Promise((resolve, reject) => {
                db.query('SELECT * FROM Products WHERE id = ?', [row.productId], (error, productResults) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(productResults);
                  }
                });
              });

              if (!productInfo) {
                // Le produit associé n'a pas été trouvé, vous pouvez gérer cette situation comme vous le souhaitez
                continue;
              }

              const cartItem = {
                id: row.id,
                quantity: row.quantity,
                product: {
                  id: productInfo.id,
                  name: productInfo.name,
                  price: productInfo.price,
                  inventory: productInfo.inventory,
                },
              };

              cartItems.push(cartItem);
            }

            // Créez un objet Cart avec les éléments du panier
            const cart = {
              userId: args.userId,
              items: cartItems,
            };

            resolve(cart);
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
          'INSERT INTO CartItems (userId, productId, quantity) VALUES (?, ?, ?)',
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
    purchaseCart: async (parent, args) => {
      const { userId } = args;

      // Étape 1: Récupérez le contenu du panier de l'utilisateur
      const cartItems = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM CartItems WHERE userId = ?', [userId], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      if (!cartItems || cartItems.length === 0) {
        throw new Error('Aucun panier trouvé');
      }

      // Étape 2: Vérifiez la disponibilité des produits dans le panier
      for (const cartItem of cartItems) {
        const productId = cartItem.productId;
        const quantityInCart = cartItem.quantity;

        const [product] = await new Promise((resolve, reject) => {
          db.query('SELECT inventory FROM Products WHERE id = ?', [productId], (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          });
        });

        if (!product || quantityInCart > product.inventory) {
          throw new Error(`Quantité insuffisante pour un produit dans le panier`);
        }
      }

      // Étape 3: Effectuez l'achat en mettant à jour le stock des produits
      for (const cartItem of cartItems) {
        const productId = cartItem.productId;
        const quantityInCart = cartItem.quantity;

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

      // Étape 4: Supprimez les éléments du panier après l'achat
      await new Promise((resolve, reject) => {
        db.query('DELETE FROM CartItems WHERE userId = ?', [userId], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      // Étape 5: Retournez l'utilisateur mis à jour
      const [updatedUser] = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM Users WHERE id = ?', [userId], (error, results) => {
          if (error) {
            reject(error);
          } else if (results.length === 0) {
            reject(new Error('Utilisateur introuvable'));
          } else {
            resolve(results);
          }
        });
      });

      return updatedUser;
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
