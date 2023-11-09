import React from 'react';

function User({ user }) {
  return (
    <div>
      <p>Utilisateur ID : {user.id}</p>
      <p>Nom d'utilisateur : {user.username}</p>
      <p>Email : {user.email}</p>
    </div>
  );
}

export default User;
