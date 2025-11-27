import dotenv from 'dotenv'
dotenv.config()

const ENVIRONMENT = {
  MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING || '',
  GMAIL_USERNAME: process.env.GMAIL_USER || process.env.GMAIL_USERNAME || '',
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD || '',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'CHANGE_ME',
  URL_API_BACKEND: (process.env.URL_API_BACKEND || '').replace(/\/$/, ''),
  URL_FRONTEND: (process.env.FRONTEND_URL || process.env.URL_FRONTEND || '').replace(/\/$/, ''),
  PORT: process.env.PORT || 8080
}

export default ENVIRONMENT