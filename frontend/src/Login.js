import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Vérifiez les informations d'authentification ici (par exemple, avec une API)
    const isAuthenticated = true; // Remplacez par votre logique d'authentification

    if (isAuthenticated) {
      setIsLoggedIn(true); // Définir l'état d'authentification comme true
      navigate('/'); // Rediriger vers la page d'accueil
    } else {
      alert('Échec de l\'authentification. Veuillez réessayer.');
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <input
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Se connecter</button>
    </div>
  );
}

export default Login;
