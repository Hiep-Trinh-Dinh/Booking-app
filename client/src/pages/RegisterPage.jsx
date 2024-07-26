import { Link } from "react-router-dom";
import axios from 'axios';
import { useState } from 'react'

export default function RegisterPage(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    async function registerUser(ev){
        ev.preventDefault();
        if (!name.trim() || !email.trim() || !password.trim()) {
            alert('Vui lòng điền đầy đủ thông tin đăng kí');
            return;
        }
        try {
            await axios.post('/register', {
                name,
                email,
                password,
            });
            alert("Đăng kí thành công, hãy vào đăng nhập.");
        } catch(e) {
            alert("Đã có tài khoản tương tự!. Hãy thử đăng nhập lại.")
        }
    };

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">Đăng Kí</h1>
            <form className="max-w-2xl mx-auto" onSubmit={registerUser}>
                <input type="text" 
                    placeholder="Tên bạn" 
                    value={name} 
                    onChange={ev => setName(ev.target.value)} />
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
                <button className="primary">Đăng kí</button>
                <div className="text-center py-2 text-gray-500">
                <Link className="underline text-black" to={'/login'}>Đăng nhập</Link>
                </div>
            </form>
            </div>
        </div>
    );
}