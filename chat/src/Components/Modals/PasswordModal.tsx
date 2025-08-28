import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { createURLFriendlyString } from '../../Helper/URL';
import { useNavigate } from 'react-router-dom';

interface Room {
  _id: string;
  name: string;
  password: string;
  owner: string;
}

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  password: string;
  setPassword: (password: string) => void;
  room: Room;
}
const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, password, setPassword, room }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  const handleJoinRoom = async (password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_END}/join/${room._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });
      const data = await response.json();

      if (response.status === 200) {
        navigate(`/room/${createURLFriendlyString(room._id)}`);
      } else {
        alert(data.message || "Şifre yanlış");
      }
    } catch (error) {
      console.error("Oda girişi sırasında bir hata oluştu:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");

    }

  }


  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <AiOutlineClose size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
          {
            room && room.name ? `🔒${room.name} - Şifre Gerekli` : 'Şifre Gerekli'
          }
        </h2>

        <div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Oda Şifresi
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Şifreyi giriniz"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              İptal
            </button>
            <button
              onClick={() => handleJoinRoom(password)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Giriş Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;