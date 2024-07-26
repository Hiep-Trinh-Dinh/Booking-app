import { Link, Navigate} from "react-router-dom";
import { useState, useContext} from 'react';
import axios from 'axios';
import { UserContext } from "../UserContext.jsx";


export default function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUser} = useContext(UserContext);

    async function handleLoginSubmit(ev){
        ev.preventDefault();
        if (!email.trim() || !password.trim()) {
            alert('Vui lòng điền đầy đủ thông tin đăng nhập');
            return;
        }
        try{
            const {data} = await axios.post('/login', {email,password});
            setUser(data);
            alert('Đăng nhập thành công');
            setRedirect(true);
        } catch (e) {
            alert("Đăng nhập thất bại!");
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">Đăng Nhập</h1>
            <form className="max-w-2xl mx-auto" onSubmit={handleLoginSubmit}>
                <input type="email" 
                    placeholder="your@gmail.com" 
                    value={email} 
                    onChange={ev => setEmail(ev.target.value)}
                />
                <input type="password" 
                    placeholder="mật khẩu" 
                    value={password} 
                    onChange={ev => setPassword(ev.target.value)}
                />
                <button className="primary">Đăng nhập</button>
                <div className="text-center py-2 text-gray-500">
                Bạn chưa có tài khoản mua hàng?
                <Link className="underline text-black" to={'/register'}>Đăng kí ở đây</Link>
                </div>
            </form>
            </div>
        </div>
    );
}