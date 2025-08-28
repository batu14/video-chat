import React from 'react';
import { FaBan } from "react-icons/fa";
import { uid } from 'react-uid';
interface UsersProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    data: User[];
}

interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    photoURL: string;
    status: 'online' | 'offline' | 'away';
}

const Users: React.FC<UsersProps> = ({ data, isOpen, setIsOpen }) => {



    const currentUser = window.localStorage.getItem('authState');
    const currentUserObject = JSON.parse(currentUser || '{}');

    const handleBanUser = (user: User) => {
        return user
    }



    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 left-20 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </button>
        );
    }

    return (
        <div className='bg-white fixed bottom-0 left-0 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[500px] w-[300px]'>
            <div className='p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
                <h2 className='font-semibold text-gray-800 dark:text-white'>Online Users</h2>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className='flex-1 p-4 overflow-y-auto space-y-4'>
                {data.map((user) => (
                    <div
                        key={uid(user)}
                        style={{
                            backgroundColor: user.name === currentUserObject.username ? 'green' : 'white',
                            
                        }}
                        className="flex items-center space-x-4 p-3 text-black hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition duration-150"
                    >
                        <div className="relative">
                            <img
                                src={'https://picsum.photos/200'}
                                alt={user.name}
                                className="w-10 h-10 rounded-full"
                            />
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                            <h3 
                            style={{
                                color: user.name === currentUserObject.username ? 'white' : 'black'
                            }}
                            className="text-sm font-medium text-gray-900 dark:text-white">{user.name === currentUserObject.username ? 'You' : user.name}</h3>
                            {
                                user.name === currentUserObject.username ? null : (
                                    <button onClick={() => handleBanUser(user)} className='bg-red-600 text-white p-2 rounded-md'>
                                        <FaBan className='w-4 h-4' />
                                    </button>
                                )
                            }
                        </div>
                    </div>
                ))}


            </div>


        </div>
    );
};

export default Users;