import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  changePassword,
  searchUsers,
  addFriend,
  getFriends,
  get_send_requests,
  requestHandeler,
  getMyFriends,
  deleteFriend,
  blockUser,
  getMyBlocked,
} from "../Controllers/usercontroller.js";
import { upload } from "../Middlewares/upload.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "User routes" });
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/me", getUser);
router.post("/update", upload.single("avatar"), updateUser);
router.post("/change-password", changePassword);


// Friends
router.post("/search", searchUsers);
router.post("/add-friend", addFriend);
router.post("/get-friends", getFriends);
router.post("/get-send-requests", get_send_requests);
router.post("/request-handeler", requestHandeler);
router.post("/get-my-friends", getMyFriends);
router.post("/delete-friend", deleteFriend);
router.post("/block-user", blockUser);
router.post("/get-my-blocked", getMyBlocked);

export default router;
