import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const requestBody = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch(`http://localhost:4000/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (response.status === 200) {
        // L'authentification a réussi, mettez à jour isAuthenticated dans App.js
        setIsAuthenticated(true);
        // Redirigez l'utilisateur vers la page d'accueil
        navigate('/');
      } else {
        alert('Échec de l\'authentification. Veuillez réessayer.');
      }
    } catch (error) {
      console.error(error);
      alert('Une erreur s\'est produite. Veuillez réessayer.');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center">Connexion</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Nom d'utilisateur"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Mot de passe"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Se connecter</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
