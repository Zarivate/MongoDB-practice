import React, { useState } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

const AddReview = (props) => {
  let initialReviewState = "";

  // Value to keep track of whether review is going to be edited or not
  let editing = false;

  // If the "edit review" button was clicked from the restaurants.js file, then a state is passed in, which is what's being checked here
  if (props.location.state && props.location.state.currentReview) {
    editing = true;
    // Set the review state to be equal to the text already there if it's being edited
    initialReviewState = props.location.state.currentReview.text;
  }

  // Variable to hold the state of the review
  const [review, setReview] = useState(initialReviewState);
  // Variable to hold whether review was already submitted or not
  const [submitted, setSubmitted] = useState(false);

  // Keeps track of any changes in the review text box while the user types
  const handleInputChange = (event) => {
    setReview(event.target.value);
  };

  // Function that holds data retreived from user that'll be used to post review to database
  const saveReview = () => {
    var data = {
      text: review,
      name: props.user.name,
      user_id: props.user.id,
      restaurant_id: props.match.params.id,
    };

    // If editing a review, then will retrieve extra information that'll be used to call updateReview function and change review
    if (editing) {
      data.review_id = props.location.state.currentReview._id;
      RestaurantDataService.updateReview(data)
        .then((response) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      // If not then that means a review is being created and will need to call appropriate function from RestaurantDataService
      RestaurantDataService.createReview(data)
        .then((response) => {
          setSubmitted(true);
          console.log(data);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div>
      {/* Check for a user, if none then unable to add review. Else will ask for user to log in. */}
      {props.user ? (
        <div className="submit-form">
          {submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <Link
                to={"/restaurants/" + props.match.params.id}
                className="btn btn-success"
              >
                Back to Restaurant
              </Link>
            </div>
          ) : (
            <div>
              <div className="form-group">
                <label htmlFor="description">
                  {editing ? "Edit" : "Create"} Review
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="text"
                  required
                  value={review}
                  onChange={handleInputChange}
                  name="text"
                />
              </div>
              <button onClick={saveReview} className="btn btn-success">
                Submit
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>Please log in.</div>
      )}
    </div>
  );
};

export default AddReview;
