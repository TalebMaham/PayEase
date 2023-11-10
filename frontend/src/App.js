import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

import ProductList from './ProductList';
import UserList from './UserList';
import Login from './Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Ajoutez un état pour stocker les informations de l'utilisateur

  const handleLogin = (userData) => {
    setUser(userData); // Stockez les informations de l'utilisateur dans l'état
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null); // Supprimez les informations de l'utilisateur de l'état lors de la déconnexion
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        <h1>Mon Application de Produits</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Accueil</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <span>Bonjour, {user && user.username}</span>
                </li>
                <li>
                  <button onClick={handleLogout}>Déconnexion</button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Connexion</Link>
              </li>
            )}
            <li>
              <Link to="/users">Utilisateurs</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <ProductList /> : <Navigate to="/login" />}
          />
          <Route path="/users" element={<UserList />} />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={handleLogin} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
