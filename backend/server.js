const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./resolvers/productResolvers');
const db = require('./db/db');

const app = express();
const port = process.env.PORT || 4000;

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startServer().then(() => {
  app.listen(port, () => {
    console.log(`Serveur GraphQL prêt à l'écoute sur http://localhost:${port}/graphql`);
  });
});


// Route pour gérer la soumission du formulaire de connexion
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = {
    text: 'SELECT * FROM users WHERE email = $1 AND password = $2',
    values: [email, password],
  };

  pool.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    if (result.rows.length > 0) {
      console.log("Identifiants corrects");
      req.session.authenticated = true; // Définissez la session comme authentifiée
      req.session.user = result.rows[0];
      res.redirect('/');
    } else {
      res.status(401).send('Identifiants incorrects');
    }
  });
});
