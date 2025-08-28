import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/features/authSlice'
import { FaChevronRight, FaChevronLeft, FaUser, FaSignOutAlt, FaVideo, FaUserFriends } from 'react-icons/fa'
import { Toaster, toast } from 'react-hot-toast'
import { io } from 'socket.io-client'

interface SidebarProps {
    username: string;
    avatar: string;
}

const Sidebar = ({ username, avatar }: SidebarProps) => {
    const authState = JSON.parse(window.localStorage.getItem('authState') || '{}')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isCollapsed, setIsCollapsed] = useState(true)
    useEffect(() => {
        if (!authState.data._id) {
            navigate('/')
        }

    }, [])

    useEffect(() => {
        if (!authState?.data?._id) return;

        const socket = io(import.meta.env.VITE_API_SOCKET, {
            transports: ["websocket"], // fallback sorunlarını engeller
        });

        // Kullanıcıyı kaydet
        socket.emit("register-user", authState.data._id);

        // Arkadaşlık isteği yakala
        socket.on("friendRequest", (data) => {
            toast.custom(() => (
                <div className='bg-blue-500 text-white p-3 rounded-lg shadow-md'>
                    <p className='text-sm'>⭐{data.message}</p>
                </div>
            ))

        });

        // cleanup
        return () => {
            socket.off("friendRequest");
            socket.disconnect();
        };
    }, [authState?.data?._id]);

    const handleLogout = () => {
        console.log('Logging out...')
        dispatch(logout())
        navigate('/')
    }


    const links = [
        {
            name: 'Odalar',
            icon: FaVideo,
            path: '/rooms'
        },
        {
            name: 'Profil',
            icon: FaUser,
            path: '/profile'
        },
        {
            name: 'Arkadaşlar',
            icon: FaUserFriends,
            path: '/friends'
        }
    ]

    return (
        <div className={`${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-white h-screen border-r border-gray-200 flex flex-col relative`}>
            <Toaster />
            {/* Collapse Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-6 bg-blue-600 rounded-full p-1.5 shadow-md hover:bg-blue-700 transition-all duration-200"
            >
                {isCollapsed ?
                    <FaChevronRight size={12} className="text-white" /> :
                    <FaChevronLeft size={12} className="text-white" />
                }
            </button>

            {/* User Profile Section */}
            <div className='p-4 border-b border-gray-200'>
                <div className='flex items-center space-x-3'>
                    <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold shadow-md'>
                        {avatar ? <img src={import.meta.env.VITE_API_UPLOAD + avatar} alt="avatar" className='w-full h-full object-cover rounded-full' /> : username ? username.charAt(0).toUpperCase() : 'A'}
                    </div>
                    {!isCollapsed && (
                        <div>
                            <h3 className='font-semibold text-gray-800 capitalize'>{username || 'Guest'}</h3>
                            <p className='text-xs text-blue-600'>Online</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className='flex-1 p-4'>
                <div className='space-y-2'>


                    {links.map((link) => (
                        <a
                            key={link.path}
                            href={link.path}
                            className={
                                isCollapsed ? 'flex items-center space-x-3 mb-5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-150' : 'flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-150'
                            }
                        >
                            <link.icon className={`${isCollapsed ? 'w-20 aspect-square' : 'w-6 h-6'}`} />
                            {!isCollapsed && <span className="font-medium">{link.name}</span>}
                        </a>
                    ))}
                </div>
            </nav>
            {/* Logout Button */}
            <div className='p-4 border-t border-gray-200'>
                <button
                    onClick={handleLogout}
                    className='w-full flex items-center space-x-2 p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition duration-150'
                >
                    <FaSignOutAlt className="w-5 h-5" />
                    {!isCollapsed && <span className="font-medium">Çıkış Yap</span>}
                </button>
            </div>
        </div>
    )
}

export default Sidebar
