import mongoose, { Schema } from "mongoose";

const RoomSchema = new Schema({
    name: {type: String, required: true},   
    createdAt: {type: Date, default: Date.now},
    participants: {type: [String], default: []},
    maxParticipants: {type: Number, default: 10},
    createdBy: {type: String, required: true},
    lastActive: {type: Date, default: Date.now},
    isPrivate: {type: Boolean, default: false},
    password: {type: String, default: ""},
    owner: {type: String, required: true},
})


const Room = mongoose.model("Room", RoomSchema);

export default Room;    






