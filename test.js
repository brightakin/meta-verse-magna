const ioClient = require("socket.io-client");
const jwt = require("jsonwebtoken");

const serverUrl = "http://localhost:4001";

const client = ioClient(serverUrl, {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJicmlnaHRha2luIiwiaWF0IjoxNzE2ODAyNzI5LCJleHAiOjE3MTY4MDYzMjl9.RjvV8LpCmki5ORaKsJKNcS_0-o8zoAuka46EtPTKmZQ",
  },
  transports: ["websocket"],
});

client.on("connect", () => {
  console.log("Connected to server");

  // Subscribe to 'all' events
  client.emit("subscribe", "all");
  console.log("Subscribed to all events");

  // Subscribe to 'sender' events
  const testAddress = "0xTestAddress";
  client.emit("subscribe", "sender", testAddress);
  console.log(`Subscribed to sender events for address: ${testAddress}`);

  // Subscribe to 'receiver' events
  client.emit("subscribe", "receiver", testAddress);
  console.log(`Subscribed to receiver events for address: ${testAddress}`);
});

client.on("newEvent", (data) => {
  console.log("Received newEvent:", data);
});

client.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});
