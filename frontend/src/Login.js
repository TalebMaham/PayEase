import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation LoginUser($username: String!, $password: String!) {
              loginUser(username: $username, password: $password) {
                id
                username
                email
              }
            }
          `,
          variables: {
            username,
            password,
          },
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      const user = data.data.loginUser;
      setIsLoggedIn(true); // Mettre à jour l'état d'authentification
      // Rediriger l'utilisateur vers la page souhaitée ici
      navigate('/'); // Rediriger vers la page d'accueil

    } catch (error) {
      console.error(error);
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
