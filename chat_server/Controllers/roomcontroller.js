import Room from "../Models/Room.js";

export const createRoom = async (req, res) => {
    const { name, createdBy, owner, maxParticipants, isPrivate, password } = req.body;
    const room = new Room({ name, createdBy, owner, maxParticipants, isPrivate, password     });
    await room.save();
    res.json(room);
};

export const getRooms = async (_req, res) => {
    const rooms = await Room.find({});
    res.json(rooms);
};


export const deleteRoom = async (req, res) => {
    const { id } = req.params;
    const room = await Room.findByIdAndDelete(id);
    if(room){
        res.json({ message: "Oda başarıyla silindi" },{status: 200});
    }else{
        res.status(404).json({ message: "Oda bulunamadı" });
    }
};

export const joinRoom = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    const room = await Room.findById(id);
    if(room.password === password){
        res.status(200).json({ message: "Oda başarıyla girildi" });
    }else{
        res.status(401).json({ message: "Şifre yanlış" });
    }
}


export const getRoomDetails = async (req, res) => {
    const { id } = req.params;
    const room = await Room.findById(id);
    if(room){
        res.status(200).json(room);
    }else{
        res.status(404).json({ message: "Oda bulunamadı" });
    }
}



