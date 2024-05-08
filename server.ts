const express = require("express");
const app = express();
app.use(express.json());
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});

// ##############################################################################

const { exec } = require("node:child_process");
const fs = require("fs");
const path = require("path");

// Get the current directory path
const currentDirectory = __dirname;

app.post("/fit", (req, res) => {
  // Extract the data and params from the request
  const dataJson = req.body;
  console.log("Data received: ", dataJson);

  const dataString = JSON.stringify(dataJson, null, 2);

  // To Do: How to deal with multiple users and fits?
  // Construct the file path to the data.json where the data will be stored
  const fileName = "data.json";
  const filePath = path.join(currentDirectory, fileName);

  // Write the data string to the file
  fs.writeFile(filePath, dataString, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      res.status(500).send("Error writing file");
      return;
    }
    console.log(
      "JSON data saved successfully in the same directory as the script."
    );
  });

  // Execute the "onefite fit <input-file>" command
  exec("dir", (err, output) => {
    if (err) {
      console.error(
        "Could not execute command 'onefite fit <input-file>': ",
        err
      );
      
      return;
    }
    // log the output received from the command
    console.log("Output: \n", output);
  });

  // Path to the generated output file
  const generatedFilePath = path.join(currentDirectory, "output.json");

  // To Do: Extract the necessary parameters from the output files

  fs.readFile(generatedFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Error reading file");
      return;
    }

    // Process the file data and build a JSON with it
    const outputJson = JSON.stringify(data);

    // Send a response to the client in JSON format
    res.json(outputJson);
  });
  
});
