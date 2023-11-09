// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ProductList from './ProductList';
import UserList from './UserList';
import Login from './Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div>
        <h1>Mon Application de Produits</h1>
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <ProductList /> : <Navigate to="/login" />}
          />
          <Route path="/users" element={<UserList />} />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
