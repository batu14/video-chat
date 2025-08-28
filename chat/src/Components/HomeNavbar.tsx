import { CiLogin } from "react-icons/ci";
import { FaDoorOpen } from "react-icons/fa";
import { Link } from "react-router-dom";


const HomeNavbar = () => {

    const links = [
        {
            name: 'Login',
            href: '/login',
            icon: <CiLogin />
        },
        {
            name: 'Signup',
            href: '/signup',
            icon: <FaDoorOpen />
        },


    ]
    return (
        <div className='w-full flex items-center justify-between p-4  px-12 h-20'>
            <h1 className='text-5xl  uppercase font-mono'>Logo</h1>
            <div className="flex items-center gap-8">
                {links.map((link) => (
                    <Link to={link.href} key={link.name} className="text-xl font-mono flex items-center">
                        
                        {link.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default HomeNavbar