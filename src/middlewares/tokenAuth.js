const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserModel = require("../models/users");

const userVerify = async (req, res, next) => {
  try {
    const bearerToken = req.header("authorization"); // trae el bearer token que pasamos en la autorizacion
    if (!bearerToken) return res.status(401).json({ message: "invalid token" });
    const token = bearerToken.split(" ")[1]; //dividir el array, y tomar la posicion uno que es la del token
    const user = await dataFromToken(token);
    if (!user.id) return res.status(401).json({ message: "sesion expired" });
    req.user = user; //devolvemos la credencial del usuario loggeado
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//funcion que creamos para validar el token
const dataFromToken = async (token) => {
  try {
    return jwt.verify(token, process.env.TOKEN_SIGNATURE, (err, data) => {
      if (err) return err;
      return data;
    });
  } catch (error) {
    throw error;
  }
};



module.exports = { userVerify };
