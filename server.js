const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require("mongoose");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
require('dotenv').config();




//connexion à la db mongodb
mongoose.connect(process.env.URL_DB)
    .then(() => console.log('Connected to mango'))
    .catch((err) => console.log("Not connected to database", err));




//route de sur l'URL de base
app.get('/', (req, res) => {
    res.json({"message": "Server is running :D"});
});


require('./routes.js')(app);
//lancement du serveur sur le port 3000
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});