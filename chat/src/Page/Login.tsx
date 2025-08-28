import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import { setAuthState } from '../store/features/authSlice';
import { io } from 'socket.io-client';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        fetch(import.meta.env.VITE_API_USER + "/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.status) {
                    toast.success(data.message as string);
                    dispatch(setAuthState({
                        data: data.user
                    }));
                    const socket = io(import.meta.env.VITE_API_SOCKET)
                    socket.emit("register-user", data.user._id) 
                    setTimeout(() => {
                        navigate('/rooms');
                    }, 1500);
                } else {
                    toast.error(data.message as string);
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Toaster />
            {/* Navbar */}
            <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
                <h1 className="text-2xl font-bold text-blue-600">MyVideoMeet</h1>
            </header>

            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Hoş Geldiniz
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Hesabınıza giriş yapın
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    name='email'
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="E-posta adresi"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                                />
                            </div>

                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    name='password'
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Şifre"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                                />
                            </div>

                            <button
                                onClick={handleLogin}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2"
                            >
                                Giriş Yap
                            </button>

                            <div className="text-center">
                                <p className="text-gray-600">
                                    Hesabınız yok mu?{' '}
                                    <a
                                        href="/signup"
                                        className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                                    >
                                        Kayıt Ol
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 text-center space-y-4">
                        <div className="flex items-center justify-center gap-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">2-Tık</div>
                                <p className="text-sm text-gray-600">ile bağlan</p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">100%</div>
                                <p className="text-sm text-gray-600">güvenli</p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">HD</div>
                                <p className="text-sm text-gray-600">kalite</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}

        </div>
    );
};

export default Login;