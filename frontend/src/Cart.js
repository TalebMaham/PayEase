import React, { useEffect, useState } from 'react';

function Cart({ user }) {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (user && user.cart) {
      const cartId = user.cart.id;
      // Utilisez une requête GraphQL pour récupérer les données du panier de l'utilisateur
      fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query GetCart($cartId: ID!) {
              user(id: $cartId) {
                cart {
                  items {
                    id
                    product {
                      name
                      price
                    }
                    quantity
                  }
                }
              }
            }
          `,
          variables: {
            cartId,
          },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setCart(data.data.user.cart.items);
          calculateTotalPrice(data.data.user.cart.items);
        })
        .catch((error) => console.error('Erreur lors de la récupération du panier', error));
    }
  }, [user]);

  const calculateTotalPrice = (cartItems) => {
    const totalPrice = cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
    setTotalPrice(totalPrice);
  };

  const handlePurchase = () => {
    if (user && user.cart) {
      const cartId = user.cart.id;
      // Utilisez une requête GraphQL pour effectuer l'achat du panier
      fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation PurchaseCart($cartId: ID!) {
              purchaseCart(userId: $cartId) {
                id
                cart {
                  items {
                    id
                  }
                }
              }
            }
          `,
          variables: {
            cartId,
          },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Traitez la réponse du serveur après l'achat du panier
          // Mettez à jour l'état local de l'utilisateur si nécessaire
          setCart([]);
          setTotalPrice(0);
        })
        .catch((error) => console.error('Erreur lors de l\'achat du panier', error));
    }
  };

  return (
    <div>
      <h2>Panier</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.product.name} x {item.quantity} - {item.product.price * item.quantity} $
          </li>
        ))}
      </ul>
      <p>Total à payer : {totalPrice} $</p>
      <button onClick={handlePurchase}>Acheter</button>
    </div>
  );
}

export default Cart;
