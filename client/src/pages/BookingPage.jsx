import { useParams } from "react-router-dom";
import {useState, useEffect} from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";


export default function BookingPage() {
    const {id} = useParams();
    const [booking,setBooking] = useState(null);
    useEffect(() => {
        if (id){
            axios.get('/bookings').then(reponse => {
                const foundBooking = reponse.data.find(({_id}) => _id === id);
                if (foundBooking) {
                    setBooking(foundBooking);
                }
            });
        }
    }, [id]);

    if(!booking){
        return '';
    }


    return (
        <div className="my-8">
            <h1 className="text-3xl">{booking.place.title}</h1>
            <AddressLink className="my-2 block">{booking.address}</AddressLink>
            <div className="bg-gray-200 p-6 my-6 rounded-2xl">
                <h2 className="text-xl">Liên hệ nếu cần hổ trợ:</h2>
                <p><b>Xưởng mộc: </b>Nam Bình</p>
                <p><b>Địa chỉ: </b>Phước Long</p>
                <p><b>Số điện thoại: </b>0000000000</p>
                <p><b>Email: </b></p>
            </div>
            <PlaceGallery place={booking.place}></PlaceGallery>
        </div>
    );
}