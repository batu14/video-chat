import { useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar'

import { FaUser, FaEnvelope, FaInfoCircle, FaLock } from 'react-icons/fa'
import { toast, Toaster } from 'react-hot-toast';

interface UserProfile {
    email: string;
    avatar?: File;
    bio: string;
    username: string;
    password?: string;
    confirmPassword?: string;

}

const Profile = () => {
    const [profile, setProfile] = useState<UserProfile>({
        username: '',
        email: '',
        bio: '',
        avatar: new File([], ''),
        password: '',
        confirmPassword: ''
    })


    const [isEditing, setIsEditing] = useState(false)
    const [showPasswordSection, setShowPasswordSection] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [image, setImage] = useState<string | null>(null)


    const fetchUser = async () => {
        const userid = JSON.parse(localStorage.getItem('authState') || '{}').data._id
        fetch(import.meta.env.VITE_API_USER + '/me', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: userid
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status) {
                    console.log(data.user)
                    setProfile({
                        username: data.user.username,
                        email: data.user.email,
                        bio: data.user.bio,
                        avatar: data.user.avatar,
                    })
                    setImage(data.user.avatar)

                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        fetchUser()
    }, [])


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        setProfile({ ...profile, avatar: file })
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = () => {
        const userid = JSON.parse(localStorage.getItem('authState') || '{}').data._id
        const formData = new FormData()
        formData.append('id', userid)
        formData.append('username', profile.username)
        formData.append('email', profile.email)
        formData.append('bio', profile.bio)
        if (profile.avatar) {
            formData.append('avatar', profile.avatar)
        }
        fetch(import.meta.env.VITE_API_USER + '/update', {
            method: 'POST',
            body: formData,

        })
            .then(res => res.json())
            .then(data => {
                if (data.status) {
                    console.log(data.message)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handlePasswordChange = () => {
        const userid = JSON.parse(localStorage.getItem('authState') || '{}').data._id
        fetch(import.meta.env.VITE_API_USER + '/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: userid,
                oldPassword: profile.password,
                newPassword: profile.confirmPassword,
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status) {
                    toast.success(data.message as string);
                } else {
                    if(data.errors){
                        data.errors.errors.forEach((error: any) => {
                            toast.error(error as string);
                        })
                    } else {
                        toast.error(data.message as string);
                    }
                }   
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-800">
            <Toaster />


            <div className="flex flex-1">
                <Sidebar username={profile.username} avatar={''} />

                <main className="flex-1 p-8 max-h-screen overflow-y-scroll">
                    <div className="max-w-4xl mx-auto shadow-lg rounded-xl">
                        {/* Profile Header */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-xl mb-8">
                            <div className="flex items-center space-x-8">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            image ?
                                                <img src={import.meta.env.VITE_API_UPLOAD + image} alt="Profile" className="w-full h-full object-cover" />
                                                :
                                                profile.username.charAt(0)
                                        )}
                                    </div>
                                    {isEditing && (
                                        <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition">
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                            <FaUser className="w-5 h-5 text-blue-600" />
                                        </label>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{profile.username}</h2>
                                    <p className="text-gray-600">{profile.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                            >
                                {isEditing ? 'İptal' : 'Profili Düzenle'}
                            </button>
                        </div>

                        {/* Profile Form */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <div className="grid gap-6">
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <FaUser className="mr-2 text-blue-600" />
                                        Kullanıcı Adı
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.username}
                                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <FaEnvelope className="mr-2 text-blue-600" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <FaInfoCircle className="mr-2 text-blue-600" />
                                        Hakkımda
                                    </label>
                                    <textarea
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        disabled={!isEditing}
                                        rows={4}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50"
                                    />
                                </div>

                                {isEditing && (
                                    <button
                                        onClick={() => setShowPasswordSection(!showPasswordSection)}
                                        className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        <FaLock className="mr-2" />
                                        Şifre Değiştir
                                    </button>
                                )}

                                {showPasswordSection && (
                                    <div className="space-y-4 border-t pt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mevcut Şifre
                                            </label>
                                            <input
                                                type="password"
                                                value={profile.password}
                                                onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Yeni Şifre
                                            </label>
                                            <input
                                                type="password"
                                                value={profile.confirmPassword}
                                                onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
                                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                        <button
                                            onClick={handlePasswordChange}
                                            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                        >
                                            Şifreyi Güncelle
                                        </button>
                                    </div>
                                )}

                                {isEditing && (
                                    <button
                                        onClick={handleSave}
                                        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                    >
                                        Değişiklikleri Kaydet
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Profile
