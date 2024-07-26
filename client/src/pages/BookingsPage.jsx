import AccountNav from "../AccountNav";
import {useEffect, useState} from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { Link } from "react-router-dom";

export default function BookingsPage() {
    const [bookings,setBookings] = useState([]);
    useEffect(() => {
        axios.get('/bookings').then(reponse => {
            setBookings(reponse.data);
        });
    }, []);
    return (
        <div>
            <AccountNav/>
            <div className="mt-4">
                {bookings?.length > 0 && bookings.map(booking => (                  
                    <Link to={`/account/bookings/${booking._id}`} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl mt-4">
                        <div className="flex w-32 h-32 bg-gray-300 grow shrink-0 rounded-2xl">
                            <PlaceImg place={booking.place}/>
                        </div>
                        <div className="py-3 pr-3 grow">
                            <h2 className="text-xl">{booking.number} {booking.place.title}</h2>
                            <div className="text-2xl">
                            Tổng tiền: ${booking.price}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}