import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
      // Retrieve information from the body to be used in post requests
      const restaurantId = req.body.restaurant_id;
      const review = req.body.text;
      // Retrieve user info from body
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id,
      };

      // Variable to hold timestamp that will be used on review posts
      const date = new Date();

      // Send call that has all the above information to addReview function in ReviewsDAO
      const ReviewResponse = await ReviewsDAO.addReview(
        restaurantId,
        userInfo,
        review,
        date
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // Function to update a user review
  static async apiUpdateReview(req, res, next) {
    try {
      // Variables to hold user information retrieved from request body
      const reviewId = req.body.review_id;
      const text = req.body.text;
      const date = new Date();

      // Send call that has all the above information, with exception being user id which is retrieved
      // from the user request body itself, to updateReview function in ReviewsDAO
      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        // Variable retrieved to help make sure one updating is same as user that made review
        req.body.user_id,
        text,
        date
      );

      var { error } = reviewResponse;
      if (error) {
        res.status(400).json({ error });
      }

      // Review failed to update, throw error if so
      if (reviewResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update review - user may not be original poster"
        );
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // Function to delte user review, utilizes query parameters instead
  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.query.id;
      // Normally wouldn't include anything in the body in a delete request but this is just to simplify things and make sure user
      // wanting to delete review is same as one that made original review
      const userId = req.body.user_id;
      console.log(reviewId);
      // Send over variables above to deleteReviews function in ReviewsDAO
      const reviewResponse = await ReviewsDAO.deleteReview(reviewId, userId);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
