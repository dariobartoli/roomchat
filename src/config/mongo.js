const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI
// Establecemos la conexión con MongoDB
mongoose.connect(MONGO_URI)

// Manejamos eventos de conexión y error
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión:'));
db.once('open', () => {
  console.log('Conexión exitosa con la base de datos.');
});

module.exports = mongoose