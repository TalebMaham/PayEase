import React, { useState, useEffect } from 'react';

import User from './User';

function UserList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const graphqlUrl = 'http://localhost:4000/graphql'; 

    // Créer une requête GraphQL au format JSON
    const graphqlQuery = {
      query: `
        query {
          users {
            id
            username
            email
          }
        }
      `,
    };

    // Effectuer une requête HTTP POST vers le serveur GraphQL
    fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.errors) {
          setError(data.errors[0]);
        } else {
          setUsers(data.data.users);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  }, []);

  if (loading) {
    return <p>Chargement en cours...</p>;
  }

  if (error) {
    return <p>Une erreur s'est produite : {error.message}</p>;
  }

  return (
    <div>
      <h2>Liste des utilisateurs :</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <User user={user} /> {/* Utiliser le composant User pour afficher chaque utilisateur */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
