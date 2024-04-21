import cron from "cron"; // Importing the cron library for scheduling tasks
import http from "http"; // Importing the HTTP module for making HTTP requests

const URL = "https://threads-clone-a26d.onrender.com"; // Target URL for HTTP requests

// Creating a new cron job that runs every 14 minutes
const job = new cron.CronJob("*/14 * * * *", function () {
  // Making an HTTP GET request to the specified URL
  http.get(URL, (res) => {
    // Checking if the response status code is 200 (OK)
    if (res.statusCode === 200) {
      console.log("get req sent successfully"); // Logging success message if response status is 200
    } else {
      console.log("get req failed"); // Logging failure message if response status is not 200
    }
  });
});

export default job;
