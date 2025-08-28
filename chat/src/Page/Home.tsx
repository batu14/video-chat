import { FaVideo, FaUsers, FaLock, FaComments } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-800">
            {/* Navbar */}
            <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
                <h1 className="text-2xl font-bold text-blue-600">MyVideoMeet</h1>

                <div className="hidden md:flex gap-3">
                    <Link to="/login" className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition">Giriş</Link>
                    <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Kayıt Ol</Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="flex flex-col md:flex-row items-center justify-between px-8 py-20 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="max-w-lg">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                        Güvenli ve Hızlı <span className="text-blue-600">Video Görüşmeler</span>
                    </h2>
                    <p className="mt-4 text-gray-600 text-lg md:text-xl">
                        Takımınızla veya müşterilerinizle zahmetsiz ve güvenli bir şekilde görüşün. Kurulum gerekmez, tek tıkla bağlanın.
                    </p>
                    <div className="mt-6 flex gap-4">
                        <Link to="/login" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2">
                            <FaVideo /> Görüşmeye Başla
                        </Link>
                        <Link to="/signup" className="px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition">
                            Daha Fazla Bilgi
                        </Link>
                    </div>
                </div>
                <div className="mt-10 md:mt-0 w-full md:w-1/2 flex justify-center">
                    <div className="w-[400px] h-[300px] bg-gray-300 rounded-xl flex items-center justify-center text-gray-600 font-medium shadow-md">
                        Video Önizleme
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="px-8 py-20 bg-white">
                <h3 className="text-3xl font-bold text-center mb-12">Öne Çıkan Özellikler</h3>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
                        <FaVideo className="text-3xl text-blue-600 mb-4" />
                        <h4 className="font-semibold mb-2">HD Video</h4>
                        <p className="text-center text-gray-600 text-sm">Yüksek kaliteli görüntü ile profesyonel toplantılar yapın.</p>
                    </div>
                    {/* <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
            <FaUsers className="text-3xl text-blue-600 mb-4" />
            <h4 className="font-semibold mb-2">Sınırsız Katılımcı</h4>
            <p className="text-center text-gray-600 text-sm">Takımınız veya müşterilerinizle sınırsız görüşme yapabilirsiniz.</p>
          </div> */}
                    <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
                        <FaLock className="text-3xl text-blue-600 mb-4" />
                        <h4 className="font-semibold mb-2">Güvenli Bağlantı</h4>
                        <p className="text-center text-gray-600 text-sm">Tüm görüşmeler uçtan uca şifrelenir.</p>
                    </div>
                    <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
                        <FaComments className="text-3xl text-blue-600 mb-4" />
                        <h4 className="font-semibold mb-2">Anlık Mesajlaşma</h4>
                        <p className="text-center text-gray-600 text-sm">Görüşmeler sırasında sohbet ve dosya paylaşabilirsiniz.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-100 px-8 py-6 flex flex-col md:flex-row justify-between text-gray-600 text-sm">
                <p>© 2025 MyVideoMeet. Tüm hakları saklıdır.</p>
                <div className="flex gap-6 mt-2 md:mt-0">
                    <a href="#" className="hover:text-blue-600">Gizlilik</a>
                    <a href="#" className="hover:text-blue-600">Şartlar</a>
                    <a href="#" className="hover:text-blue-600">İletişim</a>
                </div>
            </footer>
        </div>
    );
}
