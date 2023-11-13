import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ProductList from './ProductList';
import UserList from './UserList';
import Login from './Login';

const backendURL = 'http://localhost:4000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const checkAuthentication = async () => {
    try {
      const response = await fetch(`${backendURL}/check-auth`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error(error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${backendURL}/logout`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(false);
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
        <nav>
          <ul>
            <li>
              <Link to="/">Accueil</Link>
            </li>
            <li>
              <Link to="/users">Utilisateurs</Link>
            </li>
            {isAuthenticated === null ? (
              <li>Loading...</li>
            ) : isAuthenticated ? (
              <li>
                <button onClick={handleLogout}>Déconnexion</button>
              </li>
            ) : (
              <li>
                <Link to="/login">Connexion</Link>
              </li>
            )}
          </ul>
        </nav>

        <Routes>
          <Route
            path="/"
            element={isAuthenticated === null ? null : isAuthenticated ? <ProductList /> : <Navigate to="/login" />}
          />
          <Route path="/users" element={<UserList />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
