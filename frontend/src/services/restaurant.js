import http from "../http-common";

// Holds every function that makes the api calls needed for application and returns the data
class RestaurantDataService {
  getAll(page = 0) {
    // Will be added to end of baseUrl in http-common
    return http.get(`/restaurants?page=${page}`);
  }

  get(id) {
    return http.get(`/restaurants/id/${id}`);
  }

  find(query, by = "name", page = 0) {
    return http.get(`restaurants?${by}=${query}&page=${page}`);
  }

  createReview(data) {
    return http.post("/restaurants/review", data);
  }

  updateReview(data) {
    return http.put("/restaurants/review", data);
  }
  // this was old way of doing it "/restaurants/review-delete?id=${id}""

  deleteReview(id, userId) {
    return http.delete(`/restaurants/review?id=${id}`, {
      // User Id passed in so correct review is deleted, normally not best practice but fine for now
      data: { user_id: userId },
    });
  }

  getCuisines(id) {
    return http.get(`/restaurants/cuisines`);
  }
}

export default new RestaurantDataService();
