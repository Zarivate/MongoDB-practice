import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
let restaurants;

export default class RestaurantsDAO {
  // Initially connect to the database, method is called just as server is started, gets a reference to restaurants database
  static async injectDB(conn) {
    // If restaurants already has something in it then return
    if (restaurants) {
      return;
    }
    // Else fill variable with reference to the restaurants database
    try {
      // Try to connect
      restaurants = await conn
        .db(process.env.RESTREVIEWS_NS)
        .collection("restaurants");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in restaurantsDAO: ${e}`
      );
    }
  }

  // Function that returns list of all restaurants in database
  static async getRestaurants({
    filters = null,
    page = 0,
    restaurantsPerPage = 20,
  } = {}) {
    // Value that remains empty unless function is called and a filter is passed in
    let query;
    if (filters) {
      if ("name" in filters) {
        // Searches the db for any matching text passed in, which fields are searched for the specific string are manually set in mongodb Atlas
        query = { $text: { $search: filters["name"] } };
      } else if ("cuisine" in filters) {
        // If the cuisine in the db (left "cuisine" variable) matches the cuisine passed into filter, then return that in the query variable
        query = { cuisine: { $eq: filters["cuisine"] } };
      } else if ("zipcode" in filters) {
        // Same idea as above for the zipcode
        query = { "address.zipcode": { $eq: filters["zipcode"] } };
      }
    }

    let cursor;

    try {
      // Returns any restaurants in db that match query passed in. If query field is empty, just returns all resturants
      cursor = await restaurants.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }

    // Limit the results if there are any
    const displayCursor = cursor
      .limit(restaurantsPerPage)
      .skip(restaurantsPerPage * page);

    try {
      // Sets returned results to an array
      const restaurantsList = await displayCursor.toArray();
      // Holds the total number of restaurant results retrieved
      const totalNumRestaurants = await restaurants.countDocuments(query);

      // Return array
      return { restaurantsList, totalNumRestaurants };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }
  }
  // Function to get restuarants by their id
  static async getRestaurantByID(id) {
    try {
      // Pipeline to help match separate collections together, in this case "reviews" collection and
      const pipeline = [
        {
          $match: {
            // Try to match the id of one passed in
            _id: new ObjectId(id),
          },
        },
        {
          // Lookup item in reviews to add to return result
          $lookup: {
            from: "reviews",
            let: {
              id: "$_id",
            },
            // Another pipeline created, this time from "reviews" collection that will match restaurant id and find all the reviews that match the restaurant id
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$restaurant_id", "$$id"],
                  },
                },
              },
              {
                $sort: {
                  date: -1,
                },
              },
            ],
            // Set found matching restaurant id reviews as "reviews", will be listed in result as such
            as: "reviews",
          },
        },
        {
          $addFields: {
            reviews: "$reviews",
          },
        },
      ];
      // Collect everything together and return the next item, should be the restaurant with reviews collected
      return await restaurants.aggregate(pipeline).next();
    } catch (e) {
      console.error(`Something went wrong in getRestaurantByID: ${e}`);
      throw e;
    }
  }

  // Function to get all the cuisines
  static async getCuisines() {
    let cuisines = [];
    try {
      // Get every unique cusines once and return it
      cuisines = await restaurants.distinct("cuisine");
      return cuisines;
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`);
      return cuisines;
    }
  }
}
