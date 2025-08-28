import React, { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast';
import { AiOutlineLoading3Quarters, AiOutlineUserAdd } from "react-icons/ai";
import { MdBlock } from "react-icons/md";
import { io } from 'socket.io-client';

const FriendsModal = ({ onClose }: { onClose: () => void }) => {
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [users, setUsers] = useState([])
    const currentUser = JSON.parse(window.localStorage.getItem('authState') || '{}')


    const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }


    const searchFriends = async () => {
        const current = currentUser.data._id

        setIsLoading(true)
        fetch(`${import.meta.env.VITE_API_USER}/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ search, current })
        }).then(response => response.json()).then(data => {
            if (data.status) {
                setUsers(data.users)
            } else {
                toast.error(data.message)
                setUsers([])
            }
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setIsLoading(false)
        })






    }

    const addFriend = (user: any) => {
        const target = user._id
        const current = currentUser.data._id

        if (target === current) {
            toast.error('You cannot add yourself as a friend')
            return
        }


        fetch(`${import.meta.env.VITE_API_USER}/add-friend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ target, current , username: currentUser.data.username })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    toast.success(data.message)
                    const socket = io(import.meta.env.VITE_API_SOCKET)
                    socket.emit("friendRequest", {
                        from: currentUser.data,
                        requestId: data.requestId,
                        message: `${currentUser.data.username} sana arkadaşlık isteği gönderdi!`
                    })
                    
                } else {
                    toast.error(data.message)
                }
            })

    }

    return (
        <div onClick={e => closeModal(e)} className='fixed p-4 z-50 top-0 left-0 bg-black/50 w-full h-full flex justify-center items-center'>
            <Toaster />
            <div className='bg-white p-4 modal-container rounded-lg max-w-4xl w-full flex flex-col gap-4 items-start justify-start'>
                <h2 className='text-2xl font-mono'>Search Friends</h2>
                <input
                    type='text'
                    placeholder='Search'
                    className='w-full p-2 rounded-lg border border-gray-300'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} />
                <div className='w-full flex items-center justify-end'>
                    <button
                        onClick={searchFriends}
                        disabled={isLoading}
                        className='bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed' >
                        {isLoading ? <AiOutlineLoading3Quarters className='w-4 h-4 animate-spin' /> : 'Search'}
                    </button>
                </div>
                {

                    users && users.length > 0 && users.map((user: any) => (
                        
                        <div 
                        style={{
                            display: user._id === currentUser.data._id ? 'none' : 'flex'
                        }}
                        
                        key={user._id} className='w-full flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <img src={user.avatar ? import.meta.env.VITE_API_UPLOAD + user.avatar : '/assets/default-avatar.png'} alt={user.username} className='w-10 h-10 rounded-full' />
                                <div className='flex flex-col items-start justify-start'>
                                    <h3 className='text-sm font-mono'>{user.username}</h3>
                                    <p className='text-xs text-gray-500'>{user.email}</p>
                                </div>
                            </div>
                            <div className='flex flex-col md:flex-row items-center gap-2'>
                                <button onClick={() => { addFriend(user) }} className='bg-indigo-500 w-full whitespace-nowrap text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'>
                                    <AiOutlineUserAdd className='w-4 h-4' /> Add Friend
                                </button>
                                <button className='bg-red-500 w-full whitespace-nowrap text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'>
                                    <MdBlock className='w-4 h-4' /> Block
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default FriendsModal