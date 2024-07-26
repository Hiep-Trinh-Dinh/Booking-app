import { Link } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";
import { useContext } from "react";
import img1 from "../src/assets/Img/Logo.jpg"

export default function Header() {
  const {user} = useContext(UserContext);
    return (
        <header className="flex justify-between">
      <Link to={'/'} className="flex items-center gap-1">
        <img className="w-12 h-12 rounded-full" src={img1} alt=""/>
        <span className="font-bold text-xl">NguyenBinh</span>
      </Link>
      <div className="flex gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-500">
        <div>Nội Thất</div>
        <div className='border-l border-gray-300'></div>
        <div>Gia Dụng</div>
        <div className='border-l border-gray-300'></div>
        <div>Trang Trí</div>
      </div>
      <Link to={user?'/account':'/login'} className='flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 '>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
      <div className='bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden'>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 relative top-1">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
      </svg>
      </div>
      {!!user && (
        <div>
          {user.name}
        </div>
      )}
      </Link>
    </header>
    );
}