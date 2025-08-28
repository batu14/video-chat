import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Sidebar from '../Components/Sidebar'
import CreateRoomModal from '../Components/Modals/CreateRoomModal'
import EditRoomModal from '../Components/Modals/EditRoomModal'
import { openCreateRoomModal, openEditRoomModal } from '../store/features/modalSlice'
import RoomCard from '../Components/RoomCard';
import { uid } from 'react-uid';



// icons
import { FaPlusCircle, FaUserFriends } from "react-icons/fa";
import FriendsModal from '../Components/Modals/FriendsModal'



interface Room {
    _id: string;
    id: string;
    name: string;
    participants: number;
    maxParticipants: number;
    isPrivate: boolean;
    createdBy: string;
    lastActive: string;
    password: string;
    owner: string;
}

const Rooms = () => {
    const dispatch = useDispatch()
    const [searchQuery, setSearchQuery] = useState('')
    const currentUserId = JSON.parse(window.localStorage.getItem('authState') || '{}').data
    const [rooms, setRooms] = useState<Room[]>([]);

    const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);


    const getRooms = async () => {

        const response = await fetch(`${import.meta.env.VITE_API_END}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();

        setRooms(data);
    };


    const getFriends = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_USER}/get-friends`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": currentUserId._id
            })
        });
        const data = await response.json();
        console.log(data);
    };


    useEffect(() => {
        getRooms();
        // getFriends();
    }, []);


    const myRooms = rooms.filter((room: Room) => room.owner === currentUserId);
    const otherRooms = rooms.filter((room: Room) => room.owner !== currentUserId);

    const handleCreateRoom = async (roomData: {
        name: string;
        password: string;
        isPrivate: boolean;
        maxParticipants: number;
    }) => {
        const response = await fetch(`${import.meta.env.VITE_API_END}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": roomData.name,
                "participants": [],
                "maxParticipants": roomData.maxParticipants,
                "createdBy": currentUserId,
                "isPrivate": roomData.isPrivate,
                "password": roomData.password,
                "owner": currentUserId._id,
                "createdAt": new Date().toISOString(),
                "lastActive": new Date().toISOString(),
                "__v": 0
            })
        });
        const data = await response.json();
        console.log(data);
    };

    const handleDeleteRoom = async (roomId: string) => {
        const response = await fetch(`${import.meta.env.VITE_API_END}/${roomId}`, {
            method: "DELETE"
        });
        const data = await response.json();
        if (data.status === 200) {
            getRooms();
        } else {
            alert("Oda silinemedi");
        }

    };

    const handleEditRoom = (roomData: {
        id: string;
        name: string;
        password: string;
        isPrivate: boolean;
        maxParticipants: number;
    }) => {
        setRooms(rooms.map(room =>
            room.id === roomData.id
                ? {
                    ...room,
                    name: roomData.name,
                    isPrivate: roomData.isPrivate,
                    password: roomData.password,
                    maxParticipants: roomData.maxParticipants
                }
                : room
        ));
    };

    const handleOpenEditModal = (room: Room) => {
        dispatch(openEditRoomModal({
            id: room.id,
            name: room.name,
            isPrivate: room.isPrivate,
            password: room.password,
            maxParticipants: room.maxParticipants
        }));
    };


    return (
        <div className='flex h-screen bg-gray-50 '>
            <Sidebar username={currentUserId.username} />

            <div className='flex-1 overflow-hidden'>
                <div className='bg-white  shadow-sm border-b border-gray-200 '>
                    <div className='p-4 flex items-center justify-between'>
                        <h1 className='text-xl font-semibold text-gray-800 '>Video Chat Rooms</h1>
                        <span className='flex items-center gap-2'>
                            <button
                                onClick={() => dispatch(openCreateRoomModal())}
                                className='px-4 flex items-center justify-center gap-4 py-2 bg-indigo-500 text-white rounded-lg hover:shadow-lg transition duration-300'
                            >
                                <FaPlusCircle className='w-5 h-5' />
                                <p className='hidden md:block'>Create Room</p>
                            </button>
                            <button
                                onClick={() => setIsAddFriendModalOpen(true)}
                                className='px-4 flex items-center justify-center gap-4 py-2 bg-indigo-500 text-white rounded-lg hover:shadow-lg transition duration-300'
                            >
                                <FaUserFriends className='w-5 h-5' />
                                <p className='hidden md:block'>Add Friend</p>
                            </button>
                        </span>
                    </div>

                    <div className='p-4 border-t border-gray-200 '>
                        <div className='relative'>
                            <input
                                type="text"
                                placeholder="Search rooms..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='w-full pl-10 pr-4 py-2 border border-gray-200  rounded-lg '
                            />
                            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className='p-6 overflow-auto h-[calc(100vh-132px)]'>
                    {myRooms.length > 0 && (
                        <div className='mb-8'>
                            <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-4'>
                                My Rooms
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {myRooms.map(room => (
                                    <RoomCard
                                        key={uid(room)}
                                        room={room}
                                        isOwner={true}
                                        onDelete={handleDeleteRoom}
                                        onEdit={handleOpenEditModal}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-4'>
                            Available Rooms
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {otherRooms.map(room => (
                                <RoomCard
                                    key={uid(room)}
                                    room={room}
                                    isOwner={false}
                                    onDelete={handleDeleteRoom}
                                    onEdit={handleOpenEditModal}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <CreateRoomModal onCreateRoom={handleCreateRoom} />
            <EditRoomModal onEditRoom={handleEditRoom} />
            { isAddFriendModalOpen && <FriendsModal onClose={() => setIsAddFriendModalOpen(false)} />}
        </div>
    )
}

export default Rooms
