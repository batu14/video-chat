import {  FaPlus, FaUser } from "react-icons/fa";
import { useState } from "react";
import FriendsModal from "./Modals/FriendsModal";

interface ControlPanelProps {
  isMuted: boolean;
  isCameraOn: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onLeaveRoom: () => void;
  users: any[];
  owner: string;
}

const ControlPanel = ({ isMuted, isCameraOn, onToggleMute, onToggleCamera, onLeaveRoom, users, owner }: ControlPanelProps) => {
  const authState = JSON.parse(localStorage.getItem('authState') || '{}');
  const isOwner = owner === authState?.data?._id;
  const [isOpen, setIsOpen] = useState(false);


  return (
    <div className=" w-full relative flex items-center justify-start gap-6 backdrop-blur-sm p-2  z-50">
      {
        isOpen && (
         <div
         onClick={() => setIsOpen(false)}
         className="absolute top-0 left-0 flex items-center justify-center  text-white w-full h-screen bg-black/50 z-50">
          ara
         </div>
        )
      }
      <div className="flex items-start justify-start gap-6">
        {/* Mikrofon Kontrolü */}
        {
          isOwner && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-4 rounded-full bg-indigo-600 hover:bg-indigo-700  text-white transition-all duration-200`}
            >
              <FaPlus />
            </button>
          )
        }
        <button
          onClick={onToggleMute}
          className={`p-4 rounded-full ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} transition-all duration-200`}
        >
          {isMuted ? (
            <svg className="w-4 aspect-square  text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-4 aspect-square  text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>

        {/* Kamera Kontrolü */}
        <button
          onClick={onToggleCamera}
          className={`p-4 rounded-full ${!isCameraOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} transition-all duration-200`}
        >
          {!isCameraOn ? (
            <svg className="w-4 aspect-square  text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-4 aspect-square  text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>

        {/* Odadan Çıkış */}
        <button
          onClick={onLeaveRoom}
          className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200"
        >
          <svg className="w-4 aspect-square   text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>

      </div>
      {isOwner && (
        <div className="flex items-center justify-center gap-2 border-l border-black pl-4">
          <FaUser /> 
          <span className="text-base font-semibold text-gray-600">{users.length}</span>
        </div>
      )}
    </div>
  )
}

export default ControlPanel