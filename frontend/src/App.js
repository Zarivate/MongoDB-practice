import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddReview from "./components/add-review";
import Login from "./components/login";
import Restaurants from "./components/restaurants";
import RestaurantsList from "./components/restaurants-list";

function App() {
  return (
    <div className="App">
      Howdy
      <AddReview />
      <Login />
      <Restaurants />
      <RestaurantsList />
    </div>
  );
}

export default App;
