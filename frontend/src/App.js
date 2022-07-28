import React, { useState } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddReview from "./components/add-review";
import Login from "./components/login";
import Restaurant from "./components/restaurants";
import RestaurantsList from "./components/restaurants-list";

function App() {
  // State variable to hold whether the user is logged in or out
  const [user, setUser] = useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null);
  }

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        {/* Link for displaying all the restaurants */}
        <a href="/restaurants" className="navbar-brand">
          Restaurant Reviews
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            {/* Link for if a user wants to go to a specific restaurant */}
            <Link to={"/restaurants"} className="nav-link">
              Restaurants
            </Link>
          </li>
          <li className="nav-item">
            {/* Depending on whether the user is logged in or not, they'll either see the login or logout feature */}
            {user ? (
              <a
                onClick={logout}
                className="nav-link"
                style={{ cursor: "pointer" }}
              >
                Logout {user.name}
              </a>
            ) : (
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            )}
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Switch>
          {/* Either the default or restaurants route will load the RestaurantsList component for the user */}
          <Route
            exact
            path={["/", "/restaurants"]}
            component={RestaurantsList}
          />
          <Route
            // Route for a specific restaurants review page, so a review can be added by the user
            path="/restaurants/:id/review"
            // Render used over component so props can be passed to the components, in this case the "AddReview" component
            render={(props) => <AddReview {...props} user={user} />}
          />
          <Route
            // Route for a specific restaurant by id
            path="/restaurants/:id"
            render={(props) => <Restaurant {...props} user={user} />}
          />
          <Route
            // Route for user login
            path="/login"
            render={(props) => <Login {...props} login={login} />}
          />
        </Switch>
      </div>
    </div>
  );
}

export default App;
