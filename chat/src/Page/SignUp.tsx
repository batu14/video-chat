import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaShieldAlt } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
const SignUp = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = () => {
        fetch(import.meta.env.VITE_API_USER + "/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
            }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.status) {
                    toast.success(data.message);
                    setTimeout(() => {
                        navigate('/login');
                    }, 1500);                
                } else {
                    toast.error(data.message as string);
                    if(data.errors) {
                        data.errors.forEach((error: string) => {
                            toast.error(error);
                        });
                    }
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
                                Hesap Oluştur
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Video görüşme platformumuza katılın
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Kullanıcı Adı"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                                />
                            </div>

                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
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
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Şifre oluştur"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                                />
                            </div>

                            <div className="relative">
                                <FaShieldAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Şifreyi onayla"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                                />
                            </div>

                            <button
                                onClick={handleSignUp}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2"
                            >
                                Hesap Oluştur
                            </button>

                            <div className="text-center">
                                <p className="text-gray-600">
                                    Zaten hesabınız var mı?{' '}
                                    <a
                                        href="/login"
                                        className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                                    >
                                        Giriş Yap
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 text-center space-y-4">
                        <div className="flex items-center justify-center gap-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">Güvenli</div>
                                <p className="text-sm text-gray-600">şifreleme</p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">Hızlı</div>
                                <p className="text-sm text-gray-600">kayıt</p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">7/24</div>
                                <p className="text-sm text-gray-600">destek</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
