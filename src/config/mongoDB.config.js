import mongoose from 'mongoose'
import ENVIRONMENT from './environment.config.js'

async function connectMongoDB() {
  const uri = ENVIRONMENT.MONGO_DB_CONNECTION_STRING
  if (!uri) {
    console.error('MONGO_DB_CONNECTION_STRING no definido en .env / environment')
    process.exit(1)
  }
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000
    })
    console.log('Conectado a MongoDB')
  } catch (err) {
    console.error('error de conexion de MongoDB:', err)
    process.exit(1)
  }
}

export default connectMongoDB