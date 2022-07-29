import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import RestaurantsDAO from "./dao/restaurantsDAO.js";
import ReviewsDAO from "./dao/reviewsDAO.js";
dotenv.config();

// Gain access to mongo client from mongodb
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;

MongoClient.connect(process.env.RESTREVIEWS_DB_URI, {
  // Makes it so only 50 people can connect at a time
  maxPoolSize: 50,
  wtimeoutMS: 2500,
  useNewUrlParser: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client, conn) => {
    // Initial reference to restaurants collection in DB
    await RestaurantsDAO.injectDB(client);
    await ReviewsDAO.injectDB(client);
    // Start web server
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });
