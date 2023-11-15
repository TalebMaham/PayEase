import React, { useState } from 'react';

function Product({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [alertVisible, setAlertVisible] = useState(false);

  const handleAddToCart = () => {
    const userId = 1; // pour le teste actuellement 
    const productId = product.id;

    // Créer une requête GraphQL au format JSON
    const graphqlUrl = 'http://localhost:4000/graphql'; 
    const graphqlQuery = {
      query: `
        mutation {
          addToCart(userId: "${userId}", productId: ${productId}, quantity: ${quantity}) {
            id
            username
            email
          }
        }
      `,
    };

    // Effectuer une requête HTTP POST vers le serveur GraphQL
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
        setAlertVisible(true); // Afficher l'alerte
        setTimeout(() => {
          setAlertVisible(false); // Masquer l'alerte après quelques secondes (facultatif)
        }, 3000); 
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
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Quantité"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <div className="input-group-append">
            <button className="btn btn-warning" onClick={handleAddToCart}>
              Ajouter au panier
            </button>
          </div>
        </div>
        {alertVisible && (
          <div className="alert alert-success" role="alert">
            <span style={{ color: 'green' }}>Produit ajouté au panier</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Product;
