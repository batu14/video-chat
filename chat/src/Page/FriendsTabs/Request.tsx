import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import Button from '../../Components/Button';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { MdBlock } from 'react-icons/md';
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { io } from 'socket.io-client';


interface Requestİ {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  status?: 'pending' | 'accepted' | 'declined' | 'blocked';
  requests: Requestİ[];
}

const Request = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<Requestİ[]>([]);
  const currentUser = JSON.parse(localStorage.getItem('authState') || '{}');



  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_USER}/get-friends`, {
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
        setIsLoading(false);
        setRequests(data.requests);
      } else {
        setIsLoading(false);
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);






  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }



  const requestHandle = async (current: string, status: string) => {


    try {
      const response = await fetch(`${import.meta.env.VITE_API_USER}/request-handeler`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: currentUser.data._id,
          target: current,
          current: currentUser.data._id,
          status: status
        })
      });

      const data = await response.json();

      if (data.status) {
        toast.success(data.message);
        fetchRequests();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error handling request:', error);
      toast.error('Failed to handle request');
    }
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
        fetchRequests();

      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting friend:', error);
      toast.error('Failed to delete friend');
    }
  }



  return (
    <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {requests && requests.length > 0 ? (
        requests.map((request: any) => (
          request.length > 0 &&
          <div
            key={request[0]?._id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full p-4 sm:p-6 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 group"
          >
            {/* Sol kısım - Avatar ve bilgiler */}
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="relative">
                <img
                  src={
                    request[0]?.current.avatar
                      ? `${import.meta.env.VITE_API_UPLOAD}${request[0].current.avatar}`
                      : "/assets/default-avatar.png"
                  }
                  alt={request[0]?.current.username}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gray-200 group-hover:border-gray-300 transition-colors duration-200"
                />
                {request[0]?.status && (
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white 
            ${request[0].status === "accepted" ? "bg-green-400" : "bg-gray-400"}`}
                  />
                )}
              </div>

              <div className="flex flex-col justify-center min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate group-hover:text-gray-700 transition-colors duration-200">
                  {request[0]?.current.username}
                </h3>
                <p className="text-sm text-gray-500 truncate">{request[0]?.current.email}</p>
              </div>
            </div>

            {/* Sağ kısım - Butonlar */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                variant="success"
                onClick={() => requestHandle(request[0]?.current._id, 'accept')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-all duration-200"
              >
                <FaCheck className="w-4 h-4" />
                <span className="hidden xs:inline">Kabul Et</span>
              </Button>

              <Button
                variant="danger"
                onClick={() => deleteFriend(request[0]?.current._id)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200"
              >
                <ImCross className="w-4 h-4" />
                <span className="hidden xs:inline">Reddet</span>
              </Button>

              <Button
                variant="warning"
                onClick={() => requestHandle(request[0]?.current._id, 'block')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-orange-50 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-100 hover:border-orange-300 transition-all duration-200"
              >
                <MdBlock className="w-4 h-4" />
                <span className="hidden xs:inline">Engelle</span>
              </Button>
            </div>
          </div>

        ))
      ) : null}
    </div>
  )
}

export default Request