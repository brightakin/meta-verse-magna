import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { Container } from "typedi";
import { AppDataSource } from "./config/database";
import routes from "./routes/auth";
import { createServer } from "http";
import { createSocketServer } from "./socket";

// Ensure dependency injection container is used by TypeORM
import { useContainer } from "typeorm";
useContainer(Container);

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    const app = express();
    app.use(express.json());
    app.use("/api", routes);

    const httpServer = createServer(app);
    const PORT = process.env.PORT || 4000;

    httpServer.listen(PORT, () => {
      console.log(`HTTP Server started on http://localhost:${PORT}`);
    });

    let SOCKET_PORT = 4001;

    const startSocketServer = (port: number) => {
      const io = createSocketServer(port);
      io.on("error", (error) => {
        if (error.code === "EADDRINUSE") {
          console.log(`Port ${port} is in use, trying another port...`);
          startSocketServer(port + 1);
        } else {
          console.error("Socket.IO error:", error);
        }
      });
    };

    startSocketServer(SOCKET_PORT);
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    process.exit(1); // Exit process with failure
  }
};

startServer();
