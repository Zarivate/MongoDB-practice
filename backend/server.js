import express from "express";
import cors from "cors";
import restaurants from "./api/restaurants.route.js";

// Initialize server
const app = express();

app.use(cors());
// Make server able to accept JSON in body of request
app.use(express.json());

// Main url/route, routes stored in restaurants file
app.use("/api/vi/restaurants", restaurants);

// If they try to go to any other page/url, an error message will be sent
app.use("*", (req, res) => res.status(404).json({ error: "Page not found" }));

export default app;
