import "dotenv/config";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import {
  getBlockTransactions,
  getLatestBlockNumber,
} from "./services/EthereumService";

const createSocketServer = (serverPort: number) => {
  const io = new Server(serverPort, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (token) {
      jwt.verify(
        token,
        process.env.JWT_SECRET || "some-secret",
        (err: any, decoded: any) => {
          if (err) {
            return next(new Error("Authentication error"));
          }
          socket.data.user = decoded;
          next();
        }
      );
    } else {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("subscribe", async (type, address) => {
      if (type === "all") {
        socket.join("all");
      } else if (type === "senderOrReceiver") {
        socket.join(`address:${address}`);
      } else if (type === "sender") {
        socket.join(`sender:${address}`);
      } else if (type === "receiver") {
        socket.join(`receiver:${address}`);
      }

      // Logic for different subscription types
      setInterval(async () => {
        console.log("here");
        const blockNumber = await getLatestBlockNumber();
        const transactions = await getBlockTransactions(blockNumber);

        io.to("all").emit("newEvent", filterTransactions(transactions, `all`));
        io.to(`sender:${address}`).emit(
          "newEvent",
          filterTransactions(transactions, `sender`, address)
        );
        io.to(`receiver:${address}`).emit(
          "newEvent",
          filterTransactions(transactions, `receiver`, address)
        );
        io.to(`address:${address}`).emit(
          "newEvent",
          filterTransactions(transactions, `both`, address)
        );
      }, 12000);

      socket.on("unSubscribe", (type, address) => {
        if (type === "all") {
          socket.leave("all");
        } else if (type === "senderOrReceiver") {
          socket.leave(`address:${address}`);
        } else if (type === "sender") {
          socket.leave(`sender:${address}`);
        } else if (type === "receiver") {
          socket.leave(`receiver:${address}`);
        }
      });
    });
  });

  return io;
};

const filterTransactions = (
  transactions: any[],
  type: string,
  address?: string
): any => {
  return transactions.filter((tx) => {
    switch (type) {
      case "all":
        return true;
      case "sender":
        return tx.from === address;
      case "receiver":
        return tx.to === address;
      case "both":
        return tx.from === address || tx.to === address;
      default:
        return false;
    }
  });
};

export { createSocketServer };
