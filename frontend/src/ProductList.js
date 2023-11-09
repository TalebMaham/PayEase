import React, { useState, useEffect } from 'react';
import Product from './Product';

function ProductList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Définissez votre URL de serveur GraphQL
    const graphqlUrl = 'http://localhost:4000/graphql'; // Remplacez par l'URL de votre serveur GraphQL

    // Créez une requête GraphQL au format JSON
    const graphqlQuery = {
      query: `
        query {
          products {
            id
            name
            price
            inventory
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
        setLoading(false);
        if (data.errors) {
          setError(data.errors[0]);
        } else {
          setProducts(data.data.products);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  }, []);

  if (loading) {
    return <p>Chargement en cours...</p>;
  }

  if (error) {
    return <p>Une erreur s'est produite : {error.message}</p>;
  }

  return (
    <div className="container">
      <h2>Liste des produits :</h2>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-3 mb-4">
            <Product product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
