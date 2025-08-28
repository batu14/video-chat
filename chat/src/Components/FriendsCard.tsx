import { AiOutlineCheck, AiOutlineMessage } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { MdBlock, MdPersonRemove } from "react-icons/md";

interface Friend {
    _id: string;
    current: {
        username: string;
        email: string;
        avatar: string;
    };
    target: {
        username: string;
        email: string;
        avatar: string;
    };
    status?: 'pending' | 'accepted' | 'declined' | 'blocked';
}

interface FriendsCardProps {
    friend: Friend[];
    onRemove?: (friendId: string) => void;
    onBlock?: (friendId: string) => void;
    onMessage?: (friendId: string) => void;
}

const FriendsCard = ({ friend, onRemove, onBlock, onMessage }: FriendsCardProps) => {


    const currentUser = JSON.parse(localStorage.getItem('authState') || '{}');


    const requestHandeler = async (target: string, status: string, data: any) => {
        console.log(data.current._id)
        //     console.table({
        //         userid: currentUser.data._id,
        //         requester: target,
        //         status: status
        //     })
           try {
            const response = await fetch(`${import.meta.env.VITE_API_USER}/request-handeler`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: currentUser.data._id,
                    target: data.current._id,
                    status: status

                })
            })
            const d = await response.json();
            console.log(d);
            } catch (error) {
                console.log(error);

           }
    }





    if (friend && friend.length > 0 && friend[0]?.status === 'pending') {
        return (
            <div className="w-full flex items-center justify-between p-6 rounded-lg shadow-lg bg-white border border-slate-200">
                {/* Kullanıcı Bilgisi */}
                <div className="flex items-center gap-4">
                    <div className="bg-slate-100 rounded-full w-10 h-10 flex items-center justify-center text-slate-600 font-bold text-sm">
                        {friend[0]?.current.username?.charAt(0).toUpperCase()}
                    </div>
                    <h1 className="text-lg font-semibold text-slate-800">
                        {friend[0]?.current.username}
                    </h1>
                </div>

                {/* Aksiyon Butonları */}
                <div className="flex gap-3">
                    <button onClick={() => { requestHandeler(friend[0]._id, 'accept', friend[0]) }} className="flex items-center justify-center w-9 h-9 rounded-full bg-green-500 hover:bg-green-600 text-white transition">
                        <AiOutlineCheck className="w-4 aspect-square " />
                    </button>
                    <button onClick={() => { requestHandeler(friend[0]._id, 'decline', friend[0]) }} className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white transition">
                        <AiOutlineClose className="w-4 aspect-square" />
                    </button>
                    <button onClick={() => { requestHandeler(friend[0]._id, 'block', friend[0]) }} className="flex items-center justify-center w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white transition">
                        <MdBlock className="w-4 aspect-square" />
                    </button>
                </div>
            </div>

        )
    }


    return (
        <>
            {
                friend.length > 0 && <div className="w-full bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img
                                    src={friend[0]?.target.avatar != null ? `${import.meta.env.VITE_API_UPLOAD}${friend[0].target.avatar}` : '/assets/default-avatar.png'}
                                    alt={friend[0]?.target.username}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                {friend[0]?.status && (
                                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                            ${friend[0].status === 'accepted' ? 'bg-green-500' : 'bg-gray-400'}`}
                                    />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-semibold text-gray-800">{friend[0]?.target.username}</h3>
                                <p className="text-sm text-gray-500">{friend[0]?.target.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => friend[0] && onMessage?.(friend[0]._id)}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                title="Send Message"
                            >
                                <AiOutlineMessage className="w-4 aspect-square" />
                            </button>
                            <button
                                onClick={() => friend[0] && onRemove?.(friend[0]._id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Remove Friend"
                            >
                                <MdPersonRemove className="w-4 aspect-square" />
                            </button>
                            <button
                                onClick={() => friend[0] && onBlock?.(friend[0]._id)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                title="Block User"
                            >
                                <MdBlock className="w-4 aspect-square" />
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default FriendsCard