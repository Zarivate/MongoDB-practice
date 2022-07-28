import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {
  static async injectDB(conn) {
    // If the reviews variable already has something in it, just return
    if (reviews) {
      return;
    }
    // Else try to connect to the reviews collection in the database
    try {
      reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews");
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  // Function to create a user review
  static async addReview(restaurantId, user, review, date) {
    try {
      // Object to hold review contents
      const reviewDoc = {
        name: user.name,
        user_id: user._id,
        date: date,
        text: review,
        // MongoDB objectId is created using the restaurant's id
        restaurant_id: ObjectId(restaurantId),
      };

      // Insert created document into reviews collection
      return await reviews.insertOne(reviewDoc);
    } catch (e) {
      console.error(`Unable to post review: ${e}`);
      return { error: e };
    }
  }

  // Function to update user review
  static async updateReview(reviewId, userId, text, date) {
    try {
      const updateResponse = await reviews.updateOne(
        // Looking for review with correct reviewId and userId
        { user_id: userId, _id: ObjectId(reviewId) },
        // New text and date are set
        { $set: { text: text, date: date } }
      );

      return updateResponse;
    } catch (e) {
      console.error(`Unable to update review: ${e}`);
      return { error: e };
    }
  }

  // Function to delete user review
  static async deleteReview(reviewId, userId) {
    try {
      // Look for review with correct ids before deleting to make sure
      const deleteResponse = await reviews.deleteOne({
        _id: ObjectId(reviewId),
        user_id: userId,
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete review: ${e}`);
      return { error: e };
    }
  }
}
