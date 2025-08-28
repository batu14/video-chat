import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../store/store'
import { closeEditRoomModal } from '../../store/features/modalSlice'
import { useState, useEffect } from 'react'

interface EditRoomModalProps {
    onEditRoom: (roomData: { 
        id: string; 
        name: string; 
        password: string; 
        isPrivate: boolean;
        maxParticipants: number;
    }) => void;
}

const EditRoomModal = ({ onEditRoom }: EditRoomModalProps) => {
    const dispatch = useDispatch()
    const isOpen = useSelector((state: RootState) => state.modal.isEditRoomOpen)
    const editingRoom = useSelector((state: RootState) => state.modal.editingRoom)
    
    const [roomName, setRoomName] = useState('')
    const [password, setPassword] = useState('')
    const [isPrivate, setIsPrivate] = useState(false)
    const [maxParticipants, setMaxParticipants] = useState(4) // Yeni eklenen
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isOpen && editingRoom) {
            setRoomName(editingRoom.name)
            setPassword(editingRoom.password || '')
            setIsPrivate(editingRoom.isPrivate)
            setMaxParticipants(editingRoom.maxParticipants) // Yeni eklenen
            setIsVisible(true)
        } else {
            setTimeout(() => setIsVisible(false), 300)
        }
    }, [isOpen, editingRoom])

    const handleEditRoom = () => {
        if (roomName.trim() && editingRoom) {
            onEditRoom({
                id: editingRoom.id,
                name: roomName,
                password: password,
                isPrivate: isPrivate,
                maxParticipants: maxParticipants // Yeni eklenen
            })
            dispatch(closeEditRoomModal())
        }
    }

    if (!isVisible || !editingRoom) return null

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${
            isOpen ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}>
            <div 
                className='fixed inset-0 bg-black/50 backdrop-blur-sm'
                onClick={() => dispatch(closeEditRoomModal())}
            />
            
            <div className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl transform ${
                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            } transition-all duration-300`}>
                <div className='absolute top-4 right-4'>
                    <button 
                        onClick={() => dispatch(closeEditRoomModal())}
                        className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <h2 className='text-2xl font-bold mb-6 text-gray-800 dark:text-white'>Edit Room</h2>
                
                <div className='space-y-6'>
                    <div>
                        <label htmlFor="roomName" className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Room Name
                        </label>
                        <input
                            id="roomName"
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            placeholder="Enter room name"
                            className='w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500'
                        />
                    </div>

                    {/* Maksimum katılımcı sayısı - YENİ */}
                    <div>
                        <label htmlFor="maxParticipants" className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Maximum Participants
                        </label>
                        <div className='flex items-center gap-4'>
                            <input
                                id="maxParticipants"
                                type="range"
                                min="2"
                                max="10"
                                value={maxParticipants}
                                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                                className='flex-1'
                            />
                            <span className='text-gray-700 dark:text-gray-300 min-w-[2.5rem] text-center'>
                                {maxParticipants}
                            </span>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                            <label htmlFor="isPrivate" className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Private Room
                            </label>
                            <button
                                type="button"
                                onClick={() => setIsPrivate(!isPrivate)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
                                    isPrivate ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                                        isPrivate ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    {isPrivate && (
                        <div>
                            <label htmlFor="password" className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                Room Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter room password"
                                className='w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500'
                            />
                        </div>
                    )}

                    <div className='flex gap-4'>
                        <button
                            onClick={handleEditRoom}
                            className='flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg active:scale-[0.98] transition-all duration-200 font-medium'
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={() => dispatch(closeEditRoomModal())}
                            className='flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-[0.98] transition-all duration-200 font-medium'
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditRoomModal
