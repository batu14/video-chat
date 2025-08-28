import User from "../Models/User.js";
import Room from "../Models/Room.js";
import Friends from "../Models/Friends.js";
import bcrypt from "bcrypt";
import { validateEmailWithDNS, validatePassword } from "../Hepler/Validator.js";
import path from "path";
import fs from "fs";
import { onlineUsers, io } from "../server.js";

export const registerUser = async (req, res) => {
  const { username, password, email, confirmPassword } = req.body;

  if (!username || !password || !email || !confirmPassword) {
    return res
      .status(400)
      .json({ message: "Tüm alanları doldurunuz", status: false });
  }

  if (username.length < 3) {
    return res.status(400).json({
      message: "Kullanıcı adı en az 3 karakter olmalıdır",
      status: false,
    });
  }

  const emailValid = await validateEmailWithDNS(email);
  if (!emailValid) {
    return res.status(400).json({ message: "Geçersiz email", status: false });
  }

  const passwordValid = validatePassword(password);
  if (!passwordValid.isValid) {
    return res.status(400).json({
      message: "Geçersiz şifre",
      errors: passwordValid.errors,
      status: false,
    });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "Şifreler eşleşmiyor", status: false });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Bu email zaten kullanılıyor", status: false });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ username, password: hashedPassword, email });

  res
    .status(201)
    .json({ message: "Kullanıcı başarıyla oluşturuldu", user, status: true });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ message: "Bu email bulunamadı", status: false });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "Kullanıcı adı veya şifre yanlış", status: false });
  }
 
  res.status(200).json({ message: "Giriş başarılı", user, status: true });
};

export const getUser = async (req, res) => {
  const { id } = req.body;
  const user = await User.findById(id);
  if (!user) {
    return res
      .status(400)
      .json({ message: "Kullanıcı bulunamadı", status: false });
  }
  res
    .status(200)
    .json({ message: "Kullanıcı başarıyla getirildi", user, status: true });
};

export const updateUser = async (req, res) => {
  try {
    const { id, username, email, bio } = req.body;
    const avatar = req.file;

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Kullanıcı bulunamadı", status: false });
    }

    if (avatar) {
      if (user.avatar) {
        const oldAvatarPath = path.join(process.cwd(), user.avatar);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }
      user.avatar = `/uploads/${avatar.filename}`;
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (bio) user.bio = bio;

    await user.save();

    const rooms = await Room.find({ members: id });
    rooms.forEach(async (room) => {
      room.members = room.members.map((member) =>
        member.id === id ? user : member
      );
      await room.save();
    });

    res.json({
      message: "Kullanıcı güncellendi",
      status: true,
      user,
    });
  } catch (err) {
    console.error("updateUser hata:", err);
    res.status(500).json({ message: "Sunucu hatası", status: false });
  }
};

export const changePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
  const user = await User.findById(id);

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Eski ve yeni şifre gereklidir", status: false });
  }

  const passwordValid = validatePassword(newPassword);
  if (!passwordValid.isValid) {
    return res.status(400).json({
      message: "Yeni şifre geçersiz",
      errors: passwordValid,
      status: false,
    });
  }

  if (!user) {
    return res
      .status(400)
      .json({ message: "Kullanıcı bulunamadı", status: false });
  }
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "Eski şifre yanlış", status: false });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  res
    .status(200)
    .json({ message: "Şifre başarıyla değiştirildi", status: true });
};

export const searchUsers = async (req, res) => {
  const { search, current } = req.body;

  if (!search) {
    return res.status(400).json({
      message: "Lütfen geçerli bir kullanıcı adı veya email giriniz",
      status: false,
    });
  }

  let users = await User.find({
    $or: [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ],
  });

  // kullanıcı yoksa
  if (users.length === 0) {
    return res.status(400).json({
      message: "Bu kullanıcı adı veya email bulunamadı",
      status: false,
    });
  }

  // User id'lerini çıkar
  const userIds = users.map((u) => u._id);

  // Block kontrolü
  const blocked = await Friends.find({
    $or: [
      { current: current, target: { $in: userIds } },
      { current: { $in: userIds }, target: current },
    ],
    status: "block",
  });

  // Block'lanan kullanıcı id'lerini topla
  const blockedUserIds = blocked.map((b) =>
    String(b.current) === String(current) ? String(b.target) : String(b.current)
  );

  // Filtrele
  users = users.filter((u) => !blockedUserIds.includes(String(u._id)));

  res.status(200).json({
    message: "Kullanıcılar arandı",
    status: true,
    users,
    search,
  });
};

export const addFriend = async (req, res) => {
  const { target, current , username } = req.body;

  const user = await User.findById(target);
  if (!user) {
    return res
      .status(400)
      .json({ message: "Kullanıcı bulunamadı", status: false });
  }

  try {
    const isFriend = await Friends.findOne({
      $or: [
        { current: current, target: target },
        { current: target, target: current },
      ],
    });
    if (isFriend) {
      return res
        .status(400)
        .json({ message: "Bu kullanıcı zaten arkadaşınız", status: false });
    }
    const newFriend = await Friends.create({
      current: current,
      target: target,
      status: "pending",
    });

    // Yapalacak işlemler
    // 1. Kullanıcının socket id'sini al
    // 2. Socket id'yi kullanarak socket'e bağlan
    // 3. Socket'e friendRequest event'i gönder
    // 4. Socket'e friendRequest event'i gönderildiğinde, kullanıcının socket id'sini al
    // 5. Kullanıcının socket id'sini kullanarak socket'e bağlan
    // 6. Socket'e friendRequest event'i gönder
    // 7. Socket'e friendRequest event'i gönderildiğinde, kullanıcının socket id'sini al


    console.log(target, "target")
    console.log(current, "current")
    const socketTargetId = onlineUsers.get(target);
    console.log(socketTargetId)
    console.log('-------------------------------------')
    if (socketTargetId) {
      io.to(socketTargetId).emit("friendRequest", {
        from: current._id,
        requestId: newFriend._id,
        message: `${username} sana arkadaşlık isteği gönderdi!`,
      });
    }else{
      console.log(false , "target socket id bulunamadı")
      console.log(onlineUsers)
    }

    if (newFriend) {
      return res
        .status(200)
        .json({ message: "Kullanıcı isteği gönderildi", status: true });
    } else {
      return res
        .status(400)
        .json({ message: "Kullanıcı isteği gönderilemedi", status: false });
    }
  } catch (err) {
    console.error("addFriend hata:", err);
    res.status(500).json({ message: "Sunucu hatası", status: false });
  }
};

export const getFriends = async (req, res) => {
  try {
    const { id } = req.body; // target id (istek alan kullanıcı)

    const requests = await Friends.find({ target: id, status: "pending" })
      .populate("current", "username email avatar") // İstek atan kullanıcı bilgileri
      .populate("target", "username email"); // İstek alan kullanıcı bilgileri de gelebilir

    return res.status(200).json({
      message: "Arkadaşlık istekleri getirildi",
      requests: [requests],
      status: true,
    });
  } catch (error) {
    console.error("Hata:", error);
    return res.status(500).json({
      message: "Sunucu hatası",
      status: false,
    });
  }
};

export const get_send_requests = async (req, res) => {
  try {
    const { id } = req.body; // current id (istek atan kullanıcı)

    const requests = await Friends.find({
      current: id,
    }).populate("target", "username email avatar"); // İstek alan kullanıcı bilgileri

    return res.status(200).json({
      message: "Arkadaşlık istekleri getirildi",
      requests: [requests],
      status: true,
    });
  } catch (error) {
    console.error("Hata:", error);
    return res.status(500).json({
      message: "Sunucu hatası",
      status: false,
    });
  }
};

export const requestHandeler = async (req, res) => {
  const { id, target, status } = req.body;
  const user = await User.findById(id);
  if (!user) {
    return res
      .status(400)
      .json({ message: "Kullanıcı bulunamadı", status: false });
  }
  try {
    const request = await Friends.findOneAndUpdate(
      {
        $or: [
          { current: id, target: target },
          { current: target, target: id },
        ],
      },
      {
        $set: {
          status: status,
        },
      },
      { new: true }
    );

    if (!request) {
      return res
        .status(400)
        .json({ message: "İstek bulunamadı", status: false });
    }

    res
      .status(200)
      .json({ message: "İstek güncellendi", status: true, request });
  } catch (error) {
    console.error("Hata:", error);
    return res.status(500).json({
      message: "Sunucu hatası",
      status: false,
    });
  }
};

export const getMyFriends = async (req, res) => {
  const { id } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return res
      .status(400)
      .json({ message: "Kullanıcı bulunamadı", status: false });
  }

  const friends = await Friends.find({
    $or: [{ current: id }, { target: id }],
    status: "accept",
  })
    .populate("current", "username email avatar")
    .populate("target", "username email avatar");

  // current == id ise target'ı arkadaş olarak al
  const formattedFriends = friends.map((f) => {
    const isCurrentUser = String(f.current._id) === String(id);
    return {
      _id: f._id,
      friend: isCurrentUser ? f.target : f.current, // sadece arkadaş
      me: isCurrentUser ? f.current : f.target, // istersen kendini de tutabilirsin
      createdAt: f.createdAt,
    };
  });

  return res.status(200).json({
    message: "Arkadaşlar getirildi",
    friends: formattedFriends,
    status: true,
  });
};

export const deleteFriend = async (req, res) => {
  const { id, friendId } = req.body;
  try {
    const friend = await User.findById(friendId);
    if (!friend) {
      return res
        .status(400)
        .json({ message: "Kullanıcı bulunamadı", status: false });
    }

    const friendDelete = await Friends.findOneAndDelete({
      $or: [
        { current: id, target: friendId },
        { current: friendId, target: id },
      ],
    });

    if (!friendDelete) {
      return res.status(400).json({
        message: "Arkadaş silinemedi",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Arkadaş silindi",
      status: true,
    });
  } catch (error) {
    console.error("Hata:", error);
    return res.status(500).json({
      message: "Sunucu hatası",
      status: false,
    });
  }
};

export const blockUser = async (req, res) => {
  const { id, friendId } = req.body;
  const user = await User.findById(id);
  if (!user) {
    return res
      .status(400)
      .json({ message: "Kullanıcı bulunamadı", status: false });
  }

  try {
    const friend = await Friends.findOneAndUpdate(
      {
        $or: [
          { current: id, target: friendId },
          { current: friendId, target: id },
        ],
      },
      {
        $set: {
          status: "block",
        },
      }
    );

    if (!friend) {
      return res
        .status(400)
        .json({ message: "Engellenen kullanıcı bulunamadı", status: false });
    }

    return res.status(200).json({
      message: "Engellenen kullanıcı getirildi",
      friend,
      status: true,
    });
  } catch (error) {
    console.error("Hata:", error);
    return res.status(500).json({
      message: "Sunucu hatası",
      status: false,
    });
  }
};

export const getMyBlocked = async (req, res) => {
  const { myId } = req.body;
  const user = await User.findById(myId);
  if (!user) {
    return res
      .status(400)
      .json({ message: "Kullanıcı bulunamadı", status: false });
  }
  try {
    const blocked = await Friends.find({
      $or: [{ current: myId }, { target: myId }],
      status: "block",
    })
      .populate("current", "username email avatar")
      .populate("target", "username email avatar");

    if (!blocked) {
      return res
        .status(400)
        .json({ message: "Engellenen kullanıcı bulunamadı", status: false });
    }

    return res.status(200).json({
      message: "Engellenen kullanıcı getirildi",
      blocked,
      status: true,
    });
  } catch (error) {
    console.error("Hata:", error);
    return res.status(500).json({
      message: "Sunucu hatası",
      status: false,
    });
  }
};
