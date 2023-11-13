import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Nouvel état pour vérifier l'authentification

  const handleLogin = async (e) => {
    e.preventDefault(); // Empêchez le comportement par défaut du formulaire

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
        console.log(response.status); 
        // Définir l'état isAuthenticated sur true
        setIsAuthenticated(true);
      } else {
        // Gérez les erreurs ici
        alert('Échec de l\'authentification. Veuillez réessayer.');
      }
    } catch (error) {
      console.error(error);
      alert('Une erreur s\'est produite. Veuillez réessayer.');
    }
  };

  // Si l'authentification est réussie, redirigez l'utilisateur vers la page d'accueil
  if (isAuthenticated) {
    console.log(isAuthenticated); 
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Login;
