import RestaurantsDAO from "../dao/restaurantsDAO.js";

export default class RestaurantsController {
  static async apiGetRestaurants(req, res, next) {
    // Variable that holds the passed in value of restaurants per page from the query and transforms it into an Int, else set it to 20
    const restaurantsPerPage = req.query.restaurantsPerPage
      ? parseInt(req.query.restaurantsPerPage, 10)
      : 20;
    // Same idea for page, equal to whatever was passed into the query parameter in the URL, convert it into an int else set to 0
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    // Filter object set to empty
    let filters = {};
    // If any passed parameter in the URL is filled, is added to the filters object
    if (req.query.cuisine) {
      filters.cuisine = req.query.cuisine;
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode;
    } else if (req.query.name) {
      filters.name = req.query.name;
    }

    // Function call to getRestaurants utilizing retrieved filters. Will return a list of restaurants and the total number of restaurants retrieved
    const { restaurantsList, totalNumRestaurants } =
      await RestaurantsDAO.getRestaurants({
        filters,
        page,
        restaurantsPerPage,
      });

    // Response object to be sent to the user
    let response = {
      restaurants: restaurantsList,
      page: page,
      filters: filters,
      entries_per_page: restaurantsPerPage,
      total_results: totalNumRestaurants,
    };
    // Returns JSON response to person that made request
    res.json(response);
  }

  // Function to get a restaurant by their id
  static async apiGetRestaurantById(req, res, next) {
    try {
      // Retrieve the id from the url parameter and store it in "id", else keep it as an empty object
      let id = req.params.id || {};
      // Make call to function in RestaurantsDAO that should return the restaurant
      let restaurant = await RestaurantsDAO.getRestaurantByID(id);
      // If restaurant varaible is empty, return an error
      if (!restaurant) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      // Else return the restaurant
      res.json(restaurant);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  // Function that retrievs all the possible cusines of restaurants
  static async apiGetRestaurantCuisines(req, res, next) {
    try {
      // Function call to get the cuisines
      let cuisines = await RestaurantsDAO.getCuisines();
      // Return the cuisines
      res.json(cuisines);
      // Catch and throw any possible erros that occur
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}
