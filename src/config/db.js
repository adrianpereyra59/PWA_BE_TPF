import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_DB_CONNECTION_STRING;

export default function connectDb() {
  if (!MONGO_URI) {
    console.error('MONGO_DB_CONNECTION_STRING no definido en .env');
    process.exit(1);
  }

  mongoose
    .connect(MONGO_URI, {
    })
    .then(() => {
      console.log('Conectado a MongoDB');
    })
    .catch((err) => {
      console.error('error de conexion de MongoDB:', err);
      process.exit(1);
    });
}