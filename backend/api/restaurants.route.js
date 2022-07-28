import express from "express";
import RestaurantsCtrl from "./restaurants.controller.js";
import ReviewsCtrl from "./reviews.controller.js";

const router = express.Router();

// Default route that returns a list of all the restaurants
router.route("/").get(RestaurantsCtrl.apiGetRestaurants);
// Route to get a specific restaurant by it's Id
router.route("/id/:id").get(RestaurantsCtrl.apiGetRestaurantById);
// Route to populate a dropdown menu the user will be able to use to select a cuisine
router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantCuisines);

// This single route will be able to handle multiple types of requests
router
  .route("/review")
  .post(ReviewsCtrl.apiPostReview)
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview);

export default router;
