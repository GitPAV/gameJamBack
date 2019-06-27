const  mysql = require('mysql');
const  connexion = mysql.createConnection({
host :  'localhost', // adresse du serveur
user :  'root', // le nom d'utilisateur
password :  'Volderokh922*Zenta!3', // le mot de passe
database :  'gameJam', // le nom de la base de données
});
module.exports = connexion;