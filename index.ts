import express from "express";
import { codeRouter } from "./routes/codeRoute";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { ACTION } from "./Actions";
import dbConnect from "./configuration/connectDatabase";
import Job from "./models/Job";
import { userRouter } from "./routes/userRouter";
import { authenticationRouter } from "./routes/authenticationRoute";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

const userSocketMap = new Map();
const roomId_Code_Map = new Map();

function getAllConnectedUsers(roomId: string) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap.get(socketId),
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on(ACTION.JOIN, ({ roomId, username }) => {
    userSocketMap.set(socket.id, username);
    socket.join(roomId);

    const clients = getAllConnectedUsers(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTION.JOINED, {
        clients,
        username: username,
        socketId: socket.id,
      });

      if (roomId_Code_Map.has(roomId)) {
        io.to(socketId).emit(ACTION.ON_LANGUAGE_CHANGE, {
          languageUsed: roomId_Code_Map.get(roomId).languageUsed,
        });
        io.to(socketId).emit(ACTION.ON_CODE_CHANGE, {
          code: roomId_Code_Map.get(roomId).code,
        });
      }
    });
  });

  socket.on(ACTION.UPDATE_CODE, ({ roomId, code }) => {
    if (roomId_Code_Map.has(roomId)) {
      roomId_Code_Map.set(roomId, {
        code: code,
      });
    } else {
      roomId_Code_Map.set(roomId, {
        code: code,
      });
    }
  });

  socket.on(ACTION.UPDATE_LANGUAGE, ({ roomId, languageUsed }) => {
    if (roomId_Code_Map.has(roomId)) {
      roomId_Code_Map.set(roomId, {
        languageUsed: languageUsed,
      });
    } else {
      roomId_Code_Map.set(roomId, {
        languageUsed: languageUsed,
      });
    }
  });

  socket.on(ACTION.SYNC_CODE, ({ roomId }) => {
    if (roomId_Code_Map.has(roomId)) {
      socket.in(roomId).emit("on_code_change", {
        code: roomId_Code_Map.get(roomId).code,
      });
    }
  });

  socket.on(ACTION.SYNC_LANGUAGE, ({ roomId }) => {
    if (roomId_Code_Map.has(roomId)) {
      socket.in(roomId).emit("on_language_change", {
        languageUsed: roomId_Code_Map.get(roomId).languageUsed,
      });
    }
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      const clients = getAllConnectedUsers(roomId);
      if (clients.length === 1 && clients[0].socketId === socket.id) {
        // This is the last user in the room, so delete the room entry
        roomId_Code_Map.delete(roomId);
      }
      socket.in(roomId).emit(ACTION.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap.get(socket.id),
      });
      socket.leave(roomId);
    });
    userSocketMap.delete(socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

dbConnect();

app.use(cors());
app.use(express.json());


app.use(codeRouter);
app.use(authenticationRouter);
app.use(userRouter);

app.get("/status", async (req: any, res: any) => {
  const jobId = req.query.id;
  console.log("Status requested for jobID:", jobId);
  if (jobId == undefined) {
    res.status(400).json({ success: false, error: "jobID is required" });
  }

  try {
    const job = await Job.findById(jobId);
    if (job == undefined) {
      res.status(404).json({ success: false, error: "Job not found" });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(404).json({ success: false, error: JSON.stringify(error) });
  }
});

app.get("/", (req: any, res: any) => {
  res.send("Server is up and running...");
});
