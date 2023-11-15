const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./resolvers/productResolvers');
const session = require('express-session');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

// Configurer express-session
app.use(
  session({
    secret: 'votre_secret_session',
    resave: false,
    saveUninitialized: true,
  })
);

// Configurer votre connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'products',
});

// Middleware pour la gestion des requêtes JSON
app.use(express.json());

// Middleware CORS
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Apollo Server
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
  const { username, password } = req.body;
  // Exécuter une requête SQL pour vérifier les identifiants
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    if (results.length > 0) {
      const user = results[0];
      req.session.authenticated = true;
      req.session.user = user;
      // Rediriger vers la page d'accueil du frontend (port 3000)
      res.status(200).send('Identifiants corrects');
    } else {
      res.status(401).send('Identifiants incorrects');
    }
  });
});

// Route pour la vérification de l'authentification
app.get('/check-auth', (req, res) => {
  if (req.session.authenticated) {
    // L'utilisateur est authentifié, renvoyer une réponse avec isAuthenticated: true
    res.json({ isAuthenticated: true });
  } else {
    // L'utilisateur n'est pas authentifié, renvoyer une réponse avec isAuthenticated: false
    res.json({ isAuthenticated: false });
  }
});

// Route pour la déconnexion
app.get('/logout', (req, res) => {
  req.session.authenticated = false;
  req.session.user = null;
  res.status(200).send('Déconnexion');
});
