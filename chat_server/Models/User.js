import mongoose, { Schema } from "mongoose";


const UserSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    bio: {type: String, default: ""},
    email: {type: String, required: true, unique: true},
    createdAt: {type: Date, default: Date.now},
    lastActive: {type: Date, default: Date.now},
    isOnline: {type: Boolean, default: false},
    avatar: {type: String, default: ""},
})


const User = mongoose.model("User", UserSchema);

export default User;







