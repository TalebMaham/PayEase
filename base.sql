-- Création de la table "Users"
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

INSERT INTO Users (id, username, email, password)
VALUES
  (1, 'utilisateur1', 'utilisateur1@gmail.com', 'motdepasse1'),
  (2, 'utilisateur2', 'utilisateur2@gmail.com', 'motdepasse2'),
  (3, 'utilisateur3', 'utilisateur3@gmail.com', 'motdepasse3'),
  (4, 'utilisateur4', 'utilisateur4@gmail.com', 'motdepasse4'),
  (5, 'utilisateur5', 'utilisateur5@gmail.com', 'motdepasse5'),
  (6, 'utilisateur6', 'utilisateur6@gmail.com', 'motdepasse6');

-- Création de la table "Carts"
CREATE TABLE Carts (
  userId INT PRIMARY KEY,
  FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Création de la table "Products"
CREATE TABLE Products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  inventory INT NOT NULL
);

-- Insertion de 20 exemples d'articles de mode dans la table "Products"
INSERT INTO Products (name, price, inventory) VALUES 
  ('T-shirt Blanc', 19.99, 100),
  ('Jean Slim Noir', 49.99, 75),
  ('Chaussures de Sport', 89.99, 50),
  ('Veste en Cuir', 199.99, 25),
  ("Robe d'Été", 29.99, 60),
  ('Cravate en Soie', 24.99, 40),
  ('Sac à Main', 59.99, 30),
  ('Chapeau Panama', 34.99, 20),
  ('Écharpe en Laine', 29.99, 45),
  ('Ceinture en Cuir', 39.99, 70),
  ('Montre Classique', 149.99, 15),
  ('Bottes en Cuir', 99.99, 40),
  ('Lunettes de Soleil', 79.99, 50),
  ('Chemise à Carreaux', 44.99, 55),
  ('Pull-over Gris', 64.99, 35),
  ('Short en Jean', 39.99, 60),
  ("Sandales d'Été", 49.99, 40),
  ('Bijoux Fantaisie', 14.99, 85),
  ('Pantalon Chino', 54.99, 50),
  ('Blouse Florale', 39.99, 40);

-- Création de la table "CartItems"
CREATE TABLE CartItems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id),
  FOREIGN KEY (productId) REFERENCES Products(id)
);
