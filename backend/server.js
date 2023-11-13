const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./resolvers/productResolvers');
const session = require('express-session');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

// Configurez express-session
app.use(
  session({
    secret: 'votre_secret_session',
    resave: false,
    saveUninitialized: true,
  })
);

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startServer().then(() => {
  const httpServer = require('http').createServer(app);

  httpServer.listen(port, () => {
    console.log(`Serveur HTTP prêt à l'écoute sur le port ${port}`);
  });
});

// Configurez votre connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'products',
});

app.use(express.json()); // Ajout de la prise en charge du JSON dans les requêtes

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Route pour gérer la soumission du formulaire de connexion
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(req.body); 
  // Exécutez une requête SQL pour vérifier les identifiants
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
   
      // Redirigez vers la page d'accueil du frontend (port 3000)
      res.status(200).send('Identifiants corrects');
    } else {
      res.status(401).send('Identifiants incorrects');
    }
  });
});

app.get('/check-auth', (req, res) => {
  if (req.session.authenticated) {
    // L'utilisateur est authentifié, renvoyez une réponse avec isAuthenticated: true
    res.json({ isAuthenticated: true });
  } else {
    // L'utilisateur n'est pas authentifié, renvoyez une réponse avec isAuthenticated: false
    res.json({ isAuthenticated: false });
  }
});

// Route pour la déconnexion
app.get('/logout', (req, res) => {
  req.session.authenticated = false;
  req.session.user = null;
  res.status(200).send('Deconnexion');
});
