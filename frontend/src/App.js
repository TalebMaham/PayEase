import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ProductList from './ProductList';
import UserList from './UserList';
import Login from './Login';
import Cart from './Cart';

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
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <Link className="navbar-brand" to="/">
              Accueil
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/users">
                    Utilisateurs
                  </Link>
                </li>
                {isAuthenticated === null ? (
                  <li className="nav-item">Loading...</li>
                ) : isAuthenticated ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/cart">
                        Panier
                      </Link>
                    </li>
                    <li className="nav-item">
                      <button className="btn btn-link nav-link" onClick={handleLogout}>
                        Déconnexion
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Connexion
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated === null ? null : isAuthenticated ? <ProductList /> : <Navigate to="/login" />
            }
          />
          <Route path="/users" element={<UserList />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
