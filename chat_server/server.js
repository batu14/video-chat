import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import roomRoutes from "./Routes/roomRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

if (!fs.existsSync(path.join(__dirname, "uploads"))) {
  fs.mkdirSync(path.join(__dirname, "uploads"));
  console.log("Uploads klasörü oluşturuldu ✅ ");
} else {
  console.log("Uploads klasörü zaten var ✅ ");
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.send({ message: "Server is running", status: "success" });
});

// Odalara göre kullanıcı listesi
/** @type {{ [key: string]: Array<{ id: string, name: string }> }} */
const rooms = {};
let onlineUsers = new Map()

io.on("connection", (socket) => {
  // console.log("🔗 Yeni kullanıcı bağlandı:", socket.id);

  socket.on("register-user", (user_id) => {
    onlineUsers.set(user_id.toString(), socket.id);
    console.log(`User ${user_id} registered with socket ${socket.id}`);
  });

  socket.on("join-room", async (roomId, userName) => {
    socket.join(roomId);

    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push({ id: socket.id, name: userName });

    // Odaya katılanı diğer kullanıcılara bildir
    socket.to(roomId).emit("user-connected", { id: socket.id, name: userName });

    // Oda kullanıcı listesini güncelle
    io.to(roomId).emit("users", rooms[roomId]);

    socket.on("send-message", ({ roomId, message, userName }) => {
      console.log(userName + " sent a message   " + roomId + "---" + message);
      io.to(roomId).emit("receive-message", {
        id: socket.id,
        sender: userName,
        username: userName,
        message: message,
        time: new Date().toLocaleTimeString(),
      });
    });

    socket.on("typing", (roomId, userName) => {
      // Diğer kullanıcılara gönder
      socket.to(roomId).emit("typing-start", { name: userName });
    });

    // Kullanıcı yazmayı durdurduğunda
    socket.on("stop-typing", (roomId, userName) => {
      socket.to(roomId).emit("typing-stop", { name: userName });
    });

    // Offer gönder
    socket.on("offer", (data) => {
      socket.to(roomId).emit("offer", { ...data, from: socket.id });
    });

    // Answer gönder
    socket.on("answer", (data) => {
      socket.to(roomId).emit("answer", data);
    });

    // ICE candidate gönder
    socket.on("ice-candidate", (data) => {
      socket.to(roomId).emit("ice-candidate", data);
    });

    // Kullanıcı odadan çıkarsa
    socket.on("leaveRoom", (userName) => {
      io.to(roomId).emit("users", rooms[roomId]);
      socket.to(roomId).emit("user-disconnected", socket.id);
      rooms[roomId] = rooms[roomId].filter((u) => u.id !== socket.id);
      socket.leave(roomId);
    });

    // Bağlantı koptuğunda
    socket.on("disconnect", () => {
      if (rooms[roomId]) {
        rooms[roomId] = rooms[roomId].filter((u) => u.id !== socket.id);
        io.to(roomId).emit("users", rooms[roomId]);
        socket.to(roomId).emit("user-disconnected", socket.id);
      }
      console.log("❌ Kullanıcı ayrıldı:", socket.id);
    });
  });
});

export { io, onlineUsers };

server.listen(process.env.PORT, () => {
  console.log(`🚀 Server is running on port ${process.env.PORT}`);
});
