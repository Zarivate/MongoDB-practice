// Helper file for retrieving data from MognoDB
import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000/api/vi",
  headers: {
    "Content-type": "application/json",
  },
});
