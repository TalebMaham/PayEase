# Rapport sur le Test Technique - Création d'une Application de Paiement

Je tiens à vous remercier pour l'opportunité que vous m'avez donnée de participer au test technique pour le poste de Fullstack Developer en alternance chez The Bradery. Je suis ravi de partager avec vous le travail que j'ai accompli dans le cadre de ce test.

## Objectif
L'objectif du test était de créer une petite application de paiement en utilisant les technologies suivantes :

- **Frontend** : J'ai choisi d'utiliser React pour développer l'interface utilisateur. J'ai créé une interface conviviale et intuitive qui permet aux utilisateurs de naviguer facilement dans l'application.

- **Backend** : J'ai développé une API en utilisant GraphQL avec Node.js et Express.js. Cette API gère toutes les fonctionnalités nécessaires pour le processus de paiement, y compris la gestion du panier et des commandes.

- **Base de données** : J'ai reçu un script MySQL pour créer une table de produits. En plus de cela, j'ai créé toutes les autres tables nécessaires pour stocker les informations sur les utilisateurs, les commandes et les détails des produits.

## Fonctionnalités
J'ai implémenté les fonctionnalités suivantes dans l'application :

1. **Panier** : Les utilisateurs peuvent ajouter des produits à leur panier en respectant la limite de stock disponible. J'ai mis en place des vérifications pour s'assurer que les utilisateurs ne peuvent pas ajouter plus de produits qu'il n'y en a en stock.

2. **Page de Paiement** : Une fois les produits ajoutés au panier, les utilisateurs peuvent se diriger vers une page de paiement où ils peuvent finaliser la commande.

3. **Commandes** : Après avoir passé une commande, une entrée est automatiquement créée dans la base de données, enregistrant le prix total de la commande ainsi que les détails de chaque article de la commande. De plus, le stock de produits est mis à jour pour refléter les produits achetés.


# Documentation du Code - Frontend (App.js)

## Introduction
Le fichier `App.js` représente le point d'entrée de l'application frontend de notre système de paiement. Cette section de la documentation explique les principales fonctionnalités de `App.js` sans inclure le code source détaillé.

## Fonctionnalités Principales

1. **Authentification** : `App.js` gère l'authentification des utilisateurs en vérifiant leur statut d'authentification au chargement de la page. Il fait appel à une API backend pour cette vérification et met à jour l'état d'authentification en conséquence.

2. **Navigation** : L'application utilise React Router pour gérer la navigation entre les différentes pages. Les utilisateurs peuvent accéder à la liste des produits, à la liste des utilisateurs, au panier et à la page de connexion à partir de la barre de navigation.

3. **Gestion du Panier** : Lorsqu'un utilisateur est authentifié, il peut accéder à la page du panier où il peut visualiser les produits ajoutés au panier. Les produits sont gérés et stockés dans le panier jusqu'à ce que l'utilisateur finalise sa commande.

4. **Déconnexion** : L'application permet aux utilisateurs authentifiés de se déconnecter en cliquant sur le bouton de déconnexion. Cela révoque leur authentification et les ramène à la page de connexion.

5. **Page d'Accueil Dynamique** : En fonction de l'état d'authentification de l'utilisateur, la page d'accueil affiche soit la liste des produits, soit redirige l'utilisateur vers la page de connexion s'il n'est pas authentifié.

Ces fonctionnalités principales font de `App.js` un élément crucial de l'application frontend, en assurant la gestion de l'authentification et la navigation fluide entre les différentes parties de l'application.


# Documentation du Code - Frontend (Login.js)

## Introduction
Le fichier `Login.js` est un composant essentiel de l'application frontend qui gère le processus d'authentification des utilisateurs. Cette section de la documentation explique les principales fonctionnalités de `Login.js` sans inclure le code source détaillé.

## Fonctionnalités Principales

1. **Formulaire de Connexion** : Le composant `Login.js` affiche un formulaire de connexion qui permet aux utilisateurs de saisir leur nom d'utilisateur et leur mot de passe.

2. **Gestion de l'Authentification** : Lorsque l'utilisateur soumet le formulaire, le composant envoie une requête POST à l'API backend avec les informations d'authentification. Si l'authentification est réussie (statut 200), il met à jour l'état d'authentification dans le composant parent (généralement `App.js`) en utilisant la fonction `setIsAuthenticated` passée en tant que prop.

3. **Redirection après l'Authentification** : Après une authentification réussie, l'utilisateur est redirigé vers la page d'accueil de l'application en utilisant le routeur de navigation.

4. **Gestion des Erreurs** : Le composant `Login.js` gère également les erreurs potentielles en cas d'échec de l'authentification ou en cas d'erreur lors de la requête vers l'API backend. Il affiche des messages d'erreur appropriés à l'utilisateur en cas de problème.

5. **Saisie Contrôlée** : Les champs de saisie du nom d'utilisateur et du mot de passe sont des champs de saisie contrôlée, ce qui signifie que leur valeur est gérée par l'état du composant et mise à jour en fonction des modifications de l'utilisateur.

Le composant `Login.js` est un élément essentiel de l'application qui permet aux utilisateurs de se connecter de manière sécurisée et d'accéder aux fonctionnalités réservées aux utilisateurs authentifiés.


Cordialement,

Sidi TALEB
