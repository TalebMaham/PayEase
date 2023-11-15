import React, { useEffect, useState } from 'react';

function Cart() {
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    // Utilisez une requête GraphQL pour récupérer la liste de tous les paniers
    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetAllCarts {
            allCarts {
              userId
              items {
                id
                quantity
              }
            }
          }
        `,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        const updatedCarts = await Promise.all(
          data.data.allCarts.map(async (cart) => {
            const updatedItems = await Promise.all(
              cart.items.map(async (item) => {
                const productInfo = await fetchProductInfo(item.id);
                return {
                  id: item.id,
                  quantity: item.quantity,
                  product: productInfo,
                };
              })
            );
            return { ...cart, items: updatedItems };
          })
        );
        setCarts(updatedCarts);
      })
      .catch((error) => console.error('Erreur lors de la récupération des paniers', error));
  }, []);

  const fetchProductInfo = async (productId) => {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetProductInfo($productId: Int!) {
            product(id: $productId) {
              name
              price
            }
          }
        `,
        variables: { productId },
      }),
    });
    const data = await response.json();
    return data.data.product;
  };

  const getTotalPrice = (items) => {
    let total = 0;
    items.forEach((item) => {
      total += item.product.price * item.quantity;
    });
    return total.toFixed(2); // Arrondir le total à deux décimales
  };

  const handlePurchase = (userId) => {
    // Utilisez une requête GraphQL pour effectuer l'achat
    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation PurchaseCart($userId: ID!) {
            purchaseCart(userId: $userId) {
              id
            }
          }
        `,
        variables: { userId },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Traitez la réponse ici, par exemple, affichez un message de confirmation
        console.log('Achat effectué avec succès!', data);
      })
      .catch((error) => console.error('Erreur lors de l\'achat', error));
  };

  return (
    <div>
      <h2>Liste de Paniers</h2>
      {carts.map((cart) => (
        <div key={cart.userId} className="card">
          <div className="card-body">
            <h3 className="card-title">Panier de l'utilisateur {cart.userId}</h3>
            <ul className="list-group">
              {cart.items.map((item) => (
                <li key={item.id} className="list-group-item">
                  {item.product.name} x {item.quantity} - {item.product.price * item.quantity} $
                </li>
              ))}
            </ul>
            <p style={{ color: 'red' }}>Totale à payer: {getTotalPrice(cart.items)} $</p>
            <button
              className="btn btn-primary"
              onClick={() => handlePurchase(cart.userId)}
            >
              Acheter
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Cart;
