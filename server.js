const express = require("express");
const { BlobServiceClient } = require("@azure/storage-blob");
 
const app = express();
app.use(express.static(__dirname));
app.use(express.json());
 
const PORT = process.env.PORT || 3000;
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
 
// Define your container name
const containerName = "my-container";
 
app.get("/", (req, res) => {
    res.send("Backend is running successfully!");
});
 
app.post("/upload", async (req, res) => {
    try {
        // Create BlobServiceClient
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
 
        // Get container client
        const containerClient = blobServiceClient.getContainerClient(containerName);
        await containerClient.createIfNotExists();
 
        // Create a unique blob name
        const blobName = `sample-${Date.now()}.txt`;
        const blobClient = containerClient.getBlockBlobClient(blobName);
 
        // Upload content
        const content = "Hello from Azure!";
        const contentBuffer = Buffer.from(content);
        await blobClient.uploadData(contentBuffer);
 
        res.send(`File '${blobName}' uploaded successfully!`);
    } catch (err) {
        console.error("Upload failed:", err.message);
        res.status(500).send("Upload failed");
    }
});
 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
