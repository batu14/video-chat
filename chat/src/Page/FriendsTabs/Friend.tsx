import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { AiOutlineLoading3Quarters, AiOutlineUserAdd } from 'react-icons/ai';
import { MdBlock } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import Button from '../../Components/Button';

interface Friend {
  _id: string;
  friend: {
    _id: string;
    username: string;
    email: string;
    avatar: string;
  };
  me: {
    _id: string;
    username: string;
    email: string;
    avatar: string;
  };
  createdAt: string;
}

const Friend = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const currentUser = JSON.parse(localStorage.getItem('authState') || '{}');

  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_USER}/get-my-friends`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: currentUser.data._id
        })
      });

      const data = await response.json();

      if (data.status) {
        setFriends(data.friends);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast.error('Failed to load friends');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }



  const deleteFriend = async (id: string) => {

    try {
      const response = await fetch(`${import.meta.env.VITE_API_USER}/delete-friend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: currentUser.data._id,
          friendId: id
        })
      });

      const data = await response.json();

      if (data.status) {
        toast.success(data.message);
        fetchFriends();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting friend:', error);
      toast.error('Failed to delete friend');
    }
  }


  const blockUser = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_USER}/block-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: currentUser.data._id,
          friendId: id
        })
      });
  
      const data = await response.json();
  
      if (data.status) {
        toast.success(data.message);
        fetchFriends();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error('Failed to block user');
    }
  }


  return (
    <div className={
      friends && friends.length > 0 ? 'w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'w-full flex items-center justify-center'
    }>
      {friends && friends.length > 0 ? friends.map((f) => (
        <div
          key={f._id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full p-4 sm:p-6 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 group"
        >
          {/* Sol kısım - Avatar ve bilgiler */}
          <div className='flex items-center gap-4 min-w-0 flex-1'>
            <div className="relative">
              <img
                src={f.friend.avatar ? import.meta.env.VITE_API_UPLOAD + f.friend.avatar : '/assets/react.svg'}
                alt={f.friend.username}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gray-200 group-hover:border-gray-300 transition-colors duration-200"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
            </div>

            <div className="flex flex-col justify-center min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate group-hover:text-gray-700 transition-colors duration-200">
                {f.friend.username}
              </h3>
              <p className="text-sm text-gray-500 truncate">{f.friend.email}</p>
            </div>
          </div>

          {/* Sağ kısım - Butonlar */}
          <div className='flex items-center gap-2 sm:gap-3 w-full sm:w-auto'>
            <Button
              variant='ghost'
              onClick={() => deleteFriend(f.friend._id)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200"
            >
              <TiDelete className="w-6 h-6" />
              <span className="hidden xs:inline">Sil</span>
            </Button>

            <Button
              variant='ghost'
              onClick={() => blockUser(f.friend._id)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-orange-50 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-100 hover:border-orange-300 transition-all duration-200"
            >
              <MdBlock className="w-6 h-6" />
              <span className="hidden xs:inline">Engelle</span>
            </Button>
          </div>
        </div>
      )) : (
        <div className="w-full flex flex-col items-center justify-center h-96 z-0 gap-3">
          <div className="text-6xl animate-bounce">🤷‍♂️</div>
          <p className="text-center text-gray-600 text-lg font-medium">
            Henüz arkadaşın yok...
          </p>
          
        </div>


      )}
    </div>
  )
}

export default Friend;
