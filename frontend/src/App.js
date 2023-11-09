import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProductList from './ProductList';
import UserList from './UserList';

function App() {
  return (
    <Router>
      <div>
        <h1>Mon Application de Produits</h1>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/users" element={<UserList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
