import ENVIRONMENT from './config/environment.config.js';
import connectMongoDB from './config/mongoDB.config.js';
import app from './app.js';

(async () => {
  await connectMongoDB();
  const PORT = ENVIRONMENT.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
})();