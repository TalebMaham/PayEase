import React from 'react';

function Product({ product }) {
  const handleAddToCart = () => {
    console.log('Produit ajouté au panier :', product);
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
