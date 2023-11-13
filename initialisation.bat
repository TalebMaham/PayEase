@echo off
setlocal

rem Configuration de la connexion à la base de données MySQL
set DB_USER=root
set DB_HOST=localhost
set DB_PORT=3306
set DB_NAME=products

rem Chemin vers l'exécutable MySQL
set MYSQL_EXECUTABLE=mysql

rem Chemin vers le fichier base.sql
set SQL_FILE=base.sql

rem Commande pour exécuter les requêtes SQL depuis le fichier base.sql
%MYSQL_EXECUTABLE% -u%DB_USER% -h%DB_HOST% -P%DB_PORT% %DB_NAME% < %SQL_FILE%

rem Vérification des erreurs
if %errorlevel% neq 0 (
  echo Une erreur s'est produite lors de l'exécution des requêtes SQL.
  exit /b 1
)

echo Les requêtes SQL ont été exécutées avec succès.

endlocal
