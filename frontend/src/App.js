import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ProductList from './ProductList';
import UserList from './UserList';
import Login from './Login';
import Cart from './Cart';

// Définissez l'URL de votre backend
const backendURL = 'http://localhost:4000'; // Remplacez par l'URL de votre serveur backend

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Effectuez une requête vers le backend pour vérifier l'état d'authentification de l'utilisateur
    fetch(`${backendURL}/check-auth`, {
      method: 'GET',
      credentials: 'include', // Inclure les cookies si nécessaire
    })
      .then((response) => {
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoggedIn(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${backendURL}/logout`, {
        method: 'GET',
        credentials: 'include', // Inclure les cookies si nécessaire
      });

      if (response.ok) {
        setIsLoggedIn(false); // Définissez l'état isLoggedIn sur false après la déconnexion réussie
      } else {
        console.error('Échec de la déconnexion');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Router>
      <div>
        {/* Barre de navigation */}
        <nav>
          <ul>
            <li>
              <Link to="/">Accueil</Link>
            </li>
            <li>
              <Link to="/users">Utilisateurs</Link>
            </li>
            {isLoggedIn ? (
              <li>
                <button onClick={handleLogout}>Déconnexion</button>
              </li>
            ) : (
              <li>
                <Link to="/login">Connexion</Link>
              </li>
            )}
            {/* ... (autres liens de navigation) */}
          </ul>
        </nav>

        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <ProductList /> : <Navigate to="/login" />}
          />
          <Route path="/users" element={<UserList />} />
          <Route path="/login" element={<Login />} />
          {/* ... (autres routes) */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
