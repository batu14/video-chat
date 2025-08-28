import express from "express";
import {
  createRoom,
  getRooms,
  deleteRoom,
  joinRoom,
  getRoomDetails,
} from "../Controllers/roomcontroller.js";

const router = express.Router();

router.get('/info',(req,res)=>{
  res.json({
    message: "room api endpoint informations",
    status: "success",
    endpoints: [
      {
        endpoint: "/api/rooms",
        description: "Oda oluşturma", 
        method: "POST",
        fields: [
          {
            name: "name",
            type: "string",
            required: true,
          },
          {
            name: "isPrivate",
            type: "boolean",
            required: false,
          },
          {
            name: "password",
            type: "string",
            required: false,
          },
          {
            name: "maxParticipants",
            type: "number",
            required: false,
          },
          {
            name: "owner",
            type: "string",
            required: false,
          },
          {
            name: "createdBy",
            type: "string",
            required: false,
          },
         
        ],
      },
      {
        endpoint: "/api/rooms",
        description: "Oda listesi",
        method: "GET",
      },
      {
        endpoint: "/api/rooms/:id",
        description: "Oda detayları",
        method: "GET",
        fields: [
          {
            name: "id",
            type: "string",
            required: true,
          },
        ],
      }
    ],
  })
})
router.post("/", createRoom);
router.get("/", getRooms);
router.delete("/:id", deleteRoom);
router.post("/join/:id", joinRoom);
router.get("/:id", getRoomDetails);


export default router;
