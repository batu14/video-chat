import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createURLFriendlyString } from '../Helper/URL';
import PasswordModal from './Modals/PasswordModal';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';


interface Room {
    _id: string;
    id: string;
    name: string;
    isPrivate: boolean;
    participants: number;
    maxParticipants: number;
    createdBy: string;
    lastActive: string;
    owner: string;
    password: string;
}

interface RoomCardProps {
    room: Room;
    isOwner: boolean;
    onDelete: (id: string) => void;
    onEdit: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, isOwner, onDelete, onEdit }) => {

    const navigate = useNavigate();
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [password, setPassword] = useState("");
    const user = useSelector((state: RootState) => state.auth.data);


   
    const handleJoinRoom = (room: Room) => {
        console.log(room.owner)
        if (room.isPrivate) {
            if (room.owner.toLowerCase().replaceAll(' ', '_') === user.username.toLowerCase().replaceAll(' ', '_')) {
                navigate(`/room/${createURLFriendlyString(room._id)}`);
            } else {
                setIsPasswordModalOpen(true);
            }
        }
        else {
            navigate(`/room/${createURLFriendlyString(room._id)}`);
        }
    };




    return (
        <div className='bg-white  rounded-xl p-6 shadow-sm hover:shadow-lg transition duration-300 border border-gray-200 '>
            <PasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                password={password}
                setPassword={setPassword}
                room={room}
            />
            <div className='flex justify-between items-start mb-4'>
                <h3 className='text-xl font-semibold text-gray-800 '>{room.name}</h3>
                <div className='flex items-center gap-2'>
                    {room.isPrivate && (
                        <span className='text-yellow-500'>
                            🔒
                        </span>
                    )}
                    {isOwner && (
                        <div className='flex gap-2'>
                            <button
                                onClick={() => onDelete(room._id)}
                                className='p-1.5 text-red-500 hover:bg-red-50  rounded-lg transition-colors'
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                            <button
                                onClick={() => onEdit(room)}
                                className='p-1.5 text-blue-500 hover:bg-blue-50  rounded-lg transition-colors'
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className='space-y-2'>
                <p className='text-gray-600 '>
                    👥 {room.participants}/{room.maxParticipants} participants
                </p>

                <p className='text-xs text-gray-400 '>
                    Last active: {room.lastActive}
                </p>
            </div>
            <button
                onClick={() => handleJoinRoom(room)}
                className='w-full mt-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition duration-300'
            >
                Join Room
            </button>
        </div>
    );
};

export default RoomCard;
