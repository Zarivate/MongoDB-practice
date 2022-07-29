import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

const RestaurantsList = (props) => {
  // States to hold all the possible search/data parameters needed
  const [restaurants, setRestaurants] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchZip, setSearchZip] = useState("");
  const [searchCuisine, setSearchCuisine] = useState("");
  const [cuisines, setCuisines] = useState(["All Cuisines"]);

  // Function to retrieve the restaurants and cuisines right at start
  useEffect(() => {
    retrieveRestaurants();
    retrieveCuisines();
  }, []);

  // Functions to change state search parameters
  const onChangeSearchName = (e) => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const onChangeSearchZip = (e) => {
    const searchZip = e.target.value;
    setSearchZip(searchZip);
  };

  const onChangeSearchCuisine = (e) => {
    const searchCuisine = e.target.value;
    setSearchCuisine(searchCuisine);
  };

  // Functions to make calls to api call function in RestaurantDataService, in this case would retrieve all the restaurants from database
  const retrieveRestaurants = () => {
    RestaurantDataService.getAll()
      .then((response) => {
        console.log(response.data);
        setRestaurants(response.data.restaurants);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const retrieveCuisines = () => {
    RestaurantDataService.getCuisines()
      .then((response) => {
        console.log(response.data);
        // Since a drop down menu for cuisines is used, data is instead added to the state until there is no more cuisine data to add
        setCuisines(["All Cuisines"].concat(response.data));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Function to refresh the list of restaurants displayed
  const refreshList = () => {
    retrieveRestaurants();
  };

  // Function called by other find functions below it,
  const find = (query, by) => {
    RestaurantDataService.find(query, by)
      .then((response) => {
        console.log(response.data);
        setRestaurants(response.data.restaurants);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Make call to find function, with the name parameter value from the state of "searchName".
  const findByName = () => {
    // Categorized as "name" so knows which api call to make in restaurant.js
    find(searchName, "name");
  };

  const findByZip = () => {
    find(searchZip, "zipcode");
  };

  const findByCuisine = () => {
    if (searchCuisine == "All Cuisines") {
      refreshList();
    } else {
      find(searchCuisine, "cuisine");
    }
  };

  return (
    <div>
      <div className="row pb-1">
        <div className="input-group col-lg-4">
          <input
            // Input box for name search
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchName}
            // Whenver the value is changed, the function to alter what's held in the name state is called
            onChange={onChangeSearchName}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              // Call to function that will make the call that'll retrieve data from api call
              onClick={findByName}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">
          <input
            // Same idea as above, just for zipcodes now
            type="text"
            className="form-control"
            placeholder="Search by zip"
            value={searchZip}
            onChange={onChangeSearchZip}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByZip}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">
          <select onChange={onChangeSearchCuisine}>
            {/* Every cuisine is mapped over and added to drop down menu */}
            {cuisines.map((cuisine) => {
              return (
                // So the drop down menu for cuisines isn't too long, some cuisine names are shortened
                <option value={cuisine}> {cuisine.substring(0, 20)} </option>
              );
            })}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByCuisine}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        {/* Restaurants array is mapped over */}
        {restaurants.map((restaurant) => {
          // Details from each restaurant is stored in "address"
          const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;
          return (
            // Card detailing details about restaurant is returned for each one
            <div className="col-lg-4 pb-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p className="card-text">
                    <strong>Cuisine: </strong>
                    {restaurant.cuisine}
                    <br />
                    <strong>Address: </strong>
                    {address}
                  </p>
                  <div className="row">
                    <Link
                      // Link that'll navigate to a restaurant's reviews page
                      to={"/restaurants/" + restaurant._id}
                      className="btn btn-primary col-lg-5 mx-1 mb-1"
                    >
                      View Reviews
                    </Link>
                    <a
                      target="_blank"
                      // Link to Google Maps address of restaurant is created using the variable "address"
                      href={"https://www.google.com/maps/place/" + address}
                      className="btn btn-primary col-lg-5 mx-1 mb-1"
                    >
                      View Map
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RestaurantsList;
