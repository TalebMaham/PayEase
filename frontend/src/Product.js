import React from 'react';

function Product({ product }) {
  const handleAddToCart = () => {
    const userId = 2 ; // Remplacez par l'ID de l'utilisateur actuel
    const productId = product.id;
    const quantity = 45; // Vous pouvez ajuster la quantité ici

    // Créez une requête GraphQL au format JSON
    const graphqlUrl = 'http://localhost:4000/graphql'; // Remplacez par l'URL de votre serveur GraphQL
    const graphqlQuery = {
      query: `
        mutation {
          addToCart(userId: "${userId}", productId: ${productId}, quantity: ${quantity}) {
            id
            username
            email
            cart {
              id
              product {
                id
                name
                price
                inventory
              }
              quantity
            }
          }
        }
      `,
    };

    // Effectuez une requête HTTP POST vers le serveur GraphQL
    fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Produit ajouté au panier :', data.data.addToCart);
      })
      .catch((error) => {
        console.error('Erreur lors de l\'ajout au panier :', error);
      });
  };

  return (
    <div className="card">
      <img src="..." className="card-img-top" alt={product.name} />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">Prix : {product.price}</p>
        <p className="card-text">En stock : {product.inventory}</p>
        <button className="btn btn-warning" onClick={handleAddToCart}>
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}

export default Product;
