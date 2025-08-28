import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatComponent from "../Components/ChatComponent";
import ControlPanel from "../Components/ControlPanel";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Toaster, toast } from "react-hot-toast";
import Users from "../Components/Users";
// import Sidebar from "../Components/Sidebar";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  photoURL: string;
  status: "online" | "offline" | "away";
}

interface Room {
  _id: string;
  name: string;
  owner: string;
}

const RoomPage = () => {
  const user = useSelector((state: RootState) => state.auth.data);
  console.log(user)
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [localVideoPos, setLocalVideoPos] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const socket = useRef<Socket | null>(null);

  const [roomData, setRoomData] = useState<Array<Room>>([]);
  const [owner, setOwner] = useState<string>("");

  const fetchRoomDetails = async () => {
    console.log(roomData)
    const response = await fetch(`${import.meta.env.VITE_API_END}/${roomId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    setRoomData(data);
    setOwner(data.owner);
  };

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  useEffect(() => {
    socket.current = io(`${import.meta.env.VITE_API_SOCKET}`);
    socket.current.emit("join-room", roomId, user.data?.username);

    socket.current.on("user-disconnected", (user: User) => {
      toast.error(`${user.name} odadan çıktı`);
    });

    socket.current.on("users", (users: User[]) => setUsers(users));

    socket.current.on(
      "offer",
      async (data: { offer: RTCSessionDescriptionInit; from: string }) => {
        if (!pc.current) await startPeerConnection();
        await pc.current!.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.current!.createAnswer();
        await pc.current!.setLocalDescription(answer);
        socket.current?.emit("answer", { answer, to: data.from });
      }
    );

    socket.current.on("answer", async (data: { answer: RTCSessionDescriptionInit }) => {
      if (!pc.current) return;
      await pc.current!.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    socket.current.on("ice-candidate", async (data: RTCIceCandidateInit) => {
      if (!pc.current) return;
      try {
        await pc.current.addIceCandidate(new RTCIceCandidate(data));
      } catch (err) {
        console.error(err);
      }
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [roomId, user.data?.username]);

  const startPeerConnection = async () => {
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    localStream.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream.current;

    localStream.current.getTracks().forEach((track) => pc.current!.addTrack(track, localStream.current!));

    pc.current.ontrack = (event) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.current.onicecandidate = (event) => {
      if (event.candidate) socket.current?.emit("ice-candidate", event.candidate);
    };
  };

  const startCall = async () => {
    if (!pc.current) await startPeerConnection();
    const offer = await pc.current!.createOffer();
    await pc.current!.setLocalDescription(offer);
    socket.current?.emit("offer", { offer, from: user.data?.username, roomId });
  };

  const handleToggleMute = () => {
    if (localStream.current) {
      const newMute = !isMuted;
      localStream.current.getAudioTracks().forEach((track) => (track.enabled = !newMute));
      setIsMuted(newMute);
    }
  };

  const handleToggleCamera = () => {
    if (localStream.current) {
      const newCamera = !isCameraOn;
      localStream.current.getVideoTracks().forEach((track) => (track.enabled = !newCamera));
      setIsCameraOn(newCamera);
    }
  };

  const handleLeaveRoom = () => {
    navigate("/rooms");
  };

  // --- Draggable Handlers ---
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    setDragOffset({ x: e.clientX - localVideoPos.x, y: e.clientY - localVideoPos.y });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    setDragging(true);
    setDragOffset({ x: touch.clientX - localVideoPos.x, y: touch.clientY - localVideoPos.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) {
      setLocalVideoPos({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (dragging) {
      const touch = e.touches[0];
      setLocalVideoPos({ x: touch.clientX - dragOffset.x, y: touch.clientY - dragOffset.y });
    }
  };

  const handleMouseUp = () => setDragging(false);
  const handleTouchEnd = () => setDragging(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50 ">
      <Toaster />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <div className="bg-white hidden md:block  shadow-sm border-b border-gray-200 ">
          <div className="p-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800 ">{user.data?.username || ''}</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 ">👥 Participants: {users.length}</span>
              <button
                onClick={handleLeaveRoom}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
              >
                Leave Room
              </button>
            </div>
          </div>
        </div> */}

        <div className="w-full relative flex items-start flex-col  justify-start bg-white h-full">
            <div className="flex-1 w-full flex flex-col h-full bg-black border-r border-gray-200  relative">
            {users.find((u) => u.name !== user.data?.username) ? (
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-[calc(100vh-4.5rem)] md:h-[calc(100vh-9rem)] object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                Bağlı kullanıcı bekleniyor...
              </div>
            )}

            {/* Draggable Local Video */}
            <div
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onMouseUp={handleMouseUp}
              onTouchEnd={handleTouchEnd}
              style={{
                position: "absolute",
                top: localVideoPos.y,
                left: localVideoPos.x,
                width: "200px",
                height: "150px",
                cursor: "grab",
                border: "2px solid white",
                borderRadius: "8px",
                overflow: "hidden",
                touchAction: "none",
              }}
            >
              <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            </div>

            <button
              onClick={startCall}
              className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Start Call
            </button>

            
          </div>

          {owner === user.data?._id ? <Users data={users} isOpen={isOpen} setIsOpen={setIsOpen} /> : null}
          <ControlPanel

              owner={owner}
              users={users}
              isMuted={isMuted}
              isCameraOn={isCameraOn}
              onToggleMute={handleToggleMute}
              onToggleCamera={handleToggleCamera}
              onLeaveRoom={handleLeaveRoom}
            />
          <ChatComponent isOpen={isChatOpen} setIsOpen={setIsChatOpen} socket={socket.current} roomId={roomId || ""} />
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
