// Import the required modules
const readFile = require("fs").promises.readFile;
const writeFile = require("fs").promises.writeFile;
const JSZip = require("jszip");
const fs = require("fs-extra");
const path = require("path");

const body = new FormData();
const zip = new JSZip();

const sendRequest = async () => {
  try {
    // Read the content of the file
    const fileContents = await readFile("./margaridaData.json");

    // Create a blob from the file content
    const blob = new Blob([fileContents]);

    // Specify which file to download:
    // "zip" - downloads all output files as a ZIP file
    // "filename" - downloads the specified file
    // "outputFilename.json" - downloads the output JSON file
    // "" - does not download any file, returns a text response with the fitting parameters
    body.set("download", "json");
    body.set("username", "mboliveira");

    // Attach the file to the body
    // Allowed files include .json and .sav
    body.set("file", blob, "margaridaData.json");

    // Send the request to the server
    const res = await fetch(
      "http://localhost:8142/fit",
      {
        method: "POST",
        body,
      }
    );

    // If no download files are specified, you can fetch a text response containing the fitting parameters
    // const textRes = await res.text();
    // console.log("Response received:", textRes);

    // If the response is a JSON file, you can fetch it as follows
    // It is then stored in an object you can access with simple dot notation
    const jsonRes = await res.json();
    console.log("Response received:", jsonRes);

    // Fetch the raw data of the response, which is a ZIP file
    /*const rawFileData = await res.arrayBuffer();

    // Extract the files from the ZIP
    const zipFile = await zip.loadAsync(rawFileData);
    const files = zipFile.files;

    // Log the files in the ZIP
    console.log("Files in the ZIP:", files);

    // Save the files to the disk
    for (const file in files) {
      // Ignore directories
      if (!files[file].dir) {
        const fileContent = await files[file].async("nodebuffer");
        const filePath = "./" + file;
        // Ensure the directory to store the file exists
        await fs.ensureDir(path.dirname(filePath));
        await writeFile(filePath, fileContent);
      }
    }*/
  } catch (err) {
    // Log any errors that occur
    console.error("Error sending request:", err);
  }
};

// Call the function to send the request
sendRequest();
