import React, { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';
import { MdEmojiEmotions } from "react-icons/md";
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { uid } from 'react-uid';


interface ChatComponentProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    socket: Socket | null;
    roomId: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ isOpen, setIsOpen, socket, roomId }) => {





    const user = useSelector((state: RootState) => state.auth.data);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState("");
    const [isEmojiOpen, setIsEmojiOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<{ message: string; sender: string; time: string }[]>([]);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        if (!socket) return;
        socket.on("receive-message", (data) => {
            setMessages((prev) => [
                ...prev,
                { message: data.message, sender: data.sender, time: data.time }
            ]);
            scrollToBottom();
        });

        return () => {
            socket.off("receive-message");
        };
    }, [socket]);


    useEffect(() => {
        if (!socket) return;

        const handleTypingStart = (data: { name: string }) => {
            setIsTyping(true);
            setTypingUser(data.name);
        };

        const handleTypingStop = (data: { name: string }) => {
            setIsTyping(false);
            setTypingUser("");
        };

        socket.on("typing-start", handleTypingStart);
        socket.on("typing-stop", handleTypingStop);

        return () => {
            socket.off("typing-start", handleTypingStart);
            socket.off("typing-stop", handleTypingStop);
        };
    }, [socket]);

    // Input event
    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        socket?.emit("typing", roomId, user.username);

        // Yazmayı durdurma için debounce
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket?.emit("stop-typing", roomId, user.username);
        }, 3000);
    };


    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        const msgData = {
            roomId,
            message,
            userName: user.username,
            time: new Date().toLocaleTimeString(),
        };


        socket?.emit("send-message", msgData);


        setMessage("");
        setIsEmojiOpen(false);

    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };




    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="absolute bottom-4 right-4 z-[9999999999999999] bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300"
            >
                💬
            </button>
        );
    }

    return (
        <div className="bg-white fixed bottom-0 max-w-2/3  right-0 h-full  z-[9999999999999999] shadow-sm border border-gray-200  flex flex-col  lg:w-auto">

            <div className="p-4 py-6 border-b border-gray-200  flex justify-between items-center">
                <h2 className="font-semibold text-gray-800 ">Chat</h2>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 "
                >
                    ❌
                </button>
            </div>

            <div

                className="flex-1 p-4 overflow-y-auto space-y-4 relative">
                {messages.map((msg, index) => (
                    <div
                        key={uid(msg)}
                        style={{
                            marginTop: isDeleting ? "2rem" : "0",
                            transition: "background-color 0.3s ease-in-out"
                        }}

                        className={`flex flex-col relative  ${msg.sender === user.username ? "items-end" : "items-start"
                            }`}
                    >

                        <span className="text-sm text-gray-500 capitalize">
                            {msg.sender === user.username ? "You" : msg.sender}
                        </span>
                        <p
                            key={uid(msg)}
                          

                            className={`p-2  rounded-lg max-w-1/2 break-words ${msg.sender === user.username
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100  text-gray-800 "
                                }`}
                        >
                            {msg.message}
                        </p>
                        <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                ))}
                {
                    isDeleting ? <div className='w-full bg-black absolute top-0 left-0 h-10'></div> : null
                }
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                {isTyping ? <span className="text-xs text-gray-400">{typingUser} is typing...</span> : null}

                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-200  rounded-lg "
                        value={message}
                        onChange={(e) => handleTyping(e)}
                        onKeyPress={handleKeyPress}
                    />
                    <div className='absolute right-0 top-0'>
                        <EmojiPicker
                            open={isEmojiOpen}
                            onEmojiClick={(emojiObject) => setMessage(message + emojiObject.emoji)}
                            width={320}
                            height={500}
                        />
                    </div>
                    <MdEmojiEmotions
                        onClick={() => setIsEmojiOpen(!isEmojiOpen)}
                        size={38} className='text-white bg-slate-400 rounded-md '></MdEmojiEmotions>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatComponent;
