
import { BsCameraVideoOffFill } from "react-icons/bs";

interface User {
    id: number;
    name: string;
    isActive: boolean;
    isAdmin: boolean;
    isMute: boolean;
    isCameraOn: boolean;
}

const UserCard = ({ user }: { user: User }) => {


    if (!user.isAdmin) {

        return (
            <div className=' h-40 bg-gray-200 min-h-40 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center gap-4'>
                {
                    user.isCameraOn ? (
                        <div className='w-full h-full flex flex-col  items-center justify-center gap-4'>
                            <BsCameraVideoOffFill className='text-white text-3xl' />
                            <span className='text-white text-base'>{user.name + " is not camera on"}</span>
                        </div>
                    ) : (
                        <div className='w-full h-full flex flex-col  items-center justify-center gap-4'>
                            <BsCameraVideoOffFill className='text-white text-3xl' />
                            <span className='text-white text-base'>{user.name}</span>
                        </div>
                    ) 
                }
            </div>
        )
    }






    return (
        <div className='w-full h-full bg-blue-500 '>
            {
                !user.isCameraOn ? (
                    <div className='w-full h-full flex flex-col bg-blue-500 items-center justify-center gap-4'>
                        <BsCameraVideoOffFill className='text-white text-5xl' />
                        <span className='text-white text-2xl'>{user.name + " is not camera on"}</span>
                    </div>
                ) : (
                    <div className='w-full h-full flex flex-col bg-blue-500 items-center justify-center gap-4'>
                        <BsCameraVideoOffFill className='text-white text-5xl' />
                        <span className='text-white text-2xl'>{user.name + " is camera on"}</span>
                    </div>
                )
            }
        </div>
    )
}

export default UserCard