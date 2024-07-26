import { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import React from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";
import emailjs from '@emailjs/browser';

export default function BookingWidget({ place }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [number, setNumber] = useState('');
    const [address, setAddress] = useState('');
    const [redirect, setRedirect] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { user } = useContext(UserContext);
    const form = useRef();

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    const sendEmail = () => {
        emailjs.sendForm('service_cpxa3mp', 'template_p8uqy5i', form.current, {
            publicKey: 'luF1AKN0vcwM5Cu9P',
        })
        .then(
            () => {
                alert('Đặt hàng thành công...');
            },
            (error) => {
                alert('Đặt hàng thất bại!')
            }
        );
        form.current.reset();
    };

    async function bookThisPlace(e) {
        e.preventDefault();
        if (!user) {
            alert('Bạn cần tài khoản mua hàng!');
            return;
        }
        if (!name.trim() || !phone.trim() || !address.trim() || number <= 0) {
            alert('Vui lòng điền đầy đủ thông tin đăng kí và đảm bảo số lượng sản phẩm hợp lệ');
            return;
        }

        try {
            const response = await axios.post('/bookings', {
                name, phone, number, address,
                place: place._id,
                nameplace: place.title,
                price: number * place.price,
            });
            const bookingId = response.data._id;
            setRedirect(`/account/bookings/${bookingId}`);
            sendEmail(); // Gọi sendEmail sau khi đặt hàng thành công
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi đặt hàng');
        }
    }

    const handleNumberChange = (e) => {
        const value = parseInt(e.target.value);
        if (value < 0) {
            setErrorMessage('Số lượng không được nhỏ hơn 0');
        } else {
            setErrorMessage('');
            setNumber(value);
        }
    };

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <>
            <form ref={form} onSubmit={bookThisPlace} className="bg-white shadow p-4 rounded-2xl">
                <div className="text-2xl text-center">
                    Price: ${place.price}
                </div>
                <div className="border rounded-2xl mt-4">
                    <div className="flex"></div>
                    <div className="py-3 px-4 border-t">
                        <label>Number:</label>
                        <input
                            type="number"
                            name="user_number"
                            value={number}
                            onChange={handleNumberChange}
                            required
                        />
                        {errorMessage && (
                            <div className="text-red-500">{errorMessage}</div>
                        )}
                    </div>
                    <div className="py-3 px-4 border-t">
                        <label>Your full name:</label>
                        <input
                            type="text"
                            name="user_name"
                            value={name}
                            onChange={ev => setName(ev.target.value)}
                            required
                        />
                        <label>Your phone:</label>
                        <input
                            type="tel"
                            name="user_tel"
                            value={phone}
                            onChange={ev => setPhone(ev.target.value)}
                            required
                        />
                        <label>Your address:</label>
                        <input
                            type="text"
                            name="user_address"
                            value={address}
                            onChange={ev => setAddress(ev.target.value)}
                            required
                        />
                    </div>
                </div>
                <button type="submit" className="primary mt-4">
                    Buy
                    {number > 0 && (
                        <span>${number * place.price}</span>
                    )}
                </button>
            </form>
        </>
    );
}
