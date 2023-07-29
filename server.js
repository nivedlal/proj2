const express = require("express");
const cors = require("cors");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Create a new database in memory (can also use a file-based database)
const db = new sqlite3.Database("database");

// Create a table to store event logs
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS event_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, event TEXT)"
  );
});

// Function to log events into a text file
function logEvent(event) {
  const logMessage = `[${new Date().toISOString()}] ${event}\n`;
  fs.appendFile("event_log.txt", logMessage, (err) => {
    if (err) {
      console.error("Error writing to the log file:", err);
    }
  });
}

app.get("/message", (req, res) => {
  // Log the event when the /message endpoint is accessed
  logEvent("GET request to /message endpoint");

  // Respond with a JSON object containing the message
  res.json({ message: "Hello from server!" });
});
app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
