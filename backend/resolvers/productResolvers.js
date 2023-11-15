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
            // Rassembler les éléments du panier à partir des résultats de la requête
            const cartItems = [];

            for (const row of results) {
              // Récupérer les détails du produit associé à cet élément du panier
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
                // Le produit associé n'a pas été trouvé . 
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

            // Créer un objet Cart avec les éléments du panier
            const cart = {
              userId: args.userId,
              items: cartItems,
            };

            resolve(cart);
          }
        });
      });
    },
    product: (parent, args) => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Products WHERE id = ?', [args.id], (error, results) => {
          if (error) {
            reject(error);
          } else if (results.length === 0) {
            resolve(null); // Aucun produit trouvé
          } else {
            const product = results[0];
            resolve(product);
          }
        });
      });
    },
    
    allCarts: () => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Users', (error, userResults) => {
          if (error) {
            reject(error);
          } else {
            const allCarts = userResults.map((user) => {
              return {
                userId: user.id,
                items: [],
              };
            });

            // Fetch cart items for each user
            Promise.all(
              userResults.map((user) => {
                return new Promise((resolve, reject) => {
                  db.query('SELECT * FROM CartItems WHERE userId = ?', [user.id], (error, results) => {
                    if (error) {
                      reject(error);
                    } else {
                      resolve({ userId: user.id, items: results });
                    }
                  });
                });
              })
            )
              .then((cartItems) => {
                cartItems.forEach((cartItem) => {
                  const cart = allCarts.find((cart) => cart.userId === cartItem.userId);
                  if (cart) {
                    cart.items = cartItem.items;
                  }
                });
                resolve(allCarts);
              })
              .catch((error) => {
                reject(error);
              });
          }
        });
      });
    },
  },
  Mutation: {
    addToCart: (parent, args) => {
      return new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO CartItems (userId, productId, quantity) VALUES (?, ?, ?)',
          [args.userId, args.productId, args.quantity],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
             
              resolve(resolvers.Query.user(null, { id: args.userId }));
            }
          }
        );
      });
    },
    removeFromCart: (parent, args) => {
      return new Promise((resolve, reject) => {
        db.query(
          'DELETE FROM CartItems WHERE userId = ? AND productId = ?',
          [args.userId, args.productId],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
           
              resolve(resolvers.Query.user(null, { id: args.userId }));
            }
          }
        );
      });
    },
    clearCart: (parent, args) => {
      return new Promise((resolve, reject) => {
        db.query('DELETE FROM CartItems WHERE userId = ?', [args.userId], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(resolvers.Query.user(null, { id: args.userId }));
          }
        });
      });
    },
    purchaseCart: async (parent, args) => {
      const { userId } = args;

      // Étape 1: Récupérer le contenu du panier de l'utilisateur
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

      // Étape 2: Vérifier la disponibilité des produits dans le panier
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

      // Étape 3: Effectuer l'achat en mettant à jour le stock des produits
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

      // Étape 4: Supprimer les éléments du panier après l'achat
      await new Promise((resolve, reject) => {
        db.query('DELETE FROM CartItems WHERE userId = ?', [userId], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      // Étape 5: Retourner l'utilisateur mis à jour
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
        // Rechercher l'utilisateur dans la base de données par nom d'utilisateur et mot de passe
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
        return { ...user };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
};

module.exports = resolvers;
