import React from 'react';
import { AiOutlineCheck, AiOutlineClose, AiOutlineStop } from 'react-icons/ai';
import classNames from 'classnames';

interface User {
    _id: string;
    username: string;
    email: string;
    avatar: string;
}

interface Request {
    target: User;
    status: string;
}

interface RequestCardProps {
    request: Request;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
    const { target } = request;



    return (
        <div
        style={{
           display:request.status === 'block' ? 'none' : 'flex',
        }}
        className="flex items-center justify-between p-4 rounded-lg shadow bg-white hover:shadow-md transition">
            {/* Avatar + Info */}
            <div className="flex items-center gap-4">
                {
                    target.avatar ? <img
                        src={import.meta.env.VITE_API_UPLOAD + target.avatar}
                        alt={target.username}
                        className="w-12 h-12 rounded-full object-cover border border-gray-300"
                    />
                    : <div className="w-12 h-12 rounded-full object-cover border border-gray-300 bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500 capitalize">{target.username.charAt(0)}</p>
                    </div>
                }
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">{target.username}</h2>
                    <p className="text-sm text-gray-500">{target.email}</p>
                </div>
            </div>

            {/* Action Button */}
            {request.status === 'pending' && <p>Gönderildi</p>}
            {request.status === 'accept' && <p>Kabul edildi</p>}
            {request.status === 'decline' && <p>Reddedildi</p>}
            {request.status === 'block' && <p>Engellendi</p>}
        </div>
    );
};

export default RequestCard;
