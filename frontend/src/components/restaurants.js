import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

const Restaurant = (props) => {
  // Initialize the state of the restaurant
  const initialRestaurantState = {
    id: null,
    name: "",
    address: {},
    cuisine: "",
    reviews: [],
  };

  // State to be updated with retaurant details as go on
  const [restaurant, setRestaurant] = useState(initialRestaurantState);

  const getRestaurant = (id) => {
    RestaurantDataService.get(id)
      .then((response) => {
        setRestaurant(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Function will only get the restaurant again if the id is updated
  useEffect(() => {
    getRestaurant(props.match.params.id);
  }, [props.match.params.id]);

  // Function to delete a user review, requires the id of the review and the index of the review from review array
  const deleteReview = (reviewId, index) => {
    RestaurantDataService.deleteReview(reviewId, props.user.id)
      .then((response) => {
        setRestaurant((prevState) => {
          // Whatever review needs to be deleted will be removed from the reviews array
          prevState.reviews.splice(index, 1);
          return {
            ...prevState,
          };
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      {/* If the restaurant exists, then it's details are displayed */}
      {restaurant ? (
        <div>
          <h5>{restaurant.name}</h5>
          <p>
            <strong>Cuisine: </strong>
            {restaurant.cuisine}
            <br />
            <strong>Address: </strong>
            {restaurant.address.building} {restaurant.address.street},{" "}
            {restaurant.address.zipcode}
          </p>
          <Link
            to={"/restaurants/" + props.match.params.id + "/review"}
            className="btn btn-primary"
          >
            Add Review
          </Link>
          <h4> Reviews </h4>
          <div className="row">
            {restaurant.reviews.length > 0 ? (
              restaurant.reviews.map((review, index) => {
                return (
                  <div className="col-lg-4 pb-1" key={index}>
                    <div className="card">
                      <div className="card-body">
                        <p className="card-text">
                          {review.text}
                          <br />
                          <strong>User: </strong>
                          {review.name}
                          <br />
                          <strong>Date: </strong>
                          {review.date}
                        </p>
                        {/* If a user is logged in and has same id as one that posted review, then what is displayed differs from someone that is logged out */}
                        {props.user && props.user.id === review.user_id && (
                          <div className="row">
                            <a
                              onClick={() => deleteReview(review._id, index)}
                              className="btn btn-primary col-lg-5 mx-1 mb-1"
                            >
                              Delete
                            </a>
                            <Link
                              to={{
                                pathname:
                                  "/restaurants/" +
                                  props.match.params.id +
                                  "/review",
                                state: {
                                  currentReview: review,
                                },
                              }}
                              className="btn btn-primary col-lg-5 mx-1 mb-1"
                            >
                              Edit
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-sm-4">
                <p>No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <br />
          <p>No restaurant selected.</p>
        </div>
      )}
    </div>
  );
};

export default Restaurant;
