import { useEffect ,useState } from "react";
import PhotosUploader from "../PhotosUploader";
import axios from "axios";
import AccountNav from "../AccountNav.jsx";
import { Navigate, useParams } from "react-router-dom";

export default function PlacesFromPage(){
    const {id} = useParams();
    const [title,SetTitle] = useState('');
    const [address,setAddress] = useState('');
    const [addedPhotos,setAddedPhotos] = useState([]);
    const [description,SetDescription] = useState('');
    const [extraInfo,setExtraInfo] =useState('');
    const [price, setPrice] = useState(100);
    const [redirect, setRedirect] = useState(false);
    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/places/'+id).then(response => {
            const {data} = response;
            SetTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            SetDescription(data.description);
            setExtraInfo(data.extraInfo);
            setPrice(data.price);
        });
    }, [id]);
    
    function inputHeader(text){
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }

    function inputDescription(text){
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }

    function preInput(header, description){
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }

    async function savePlace(ev){
        ev.preventDefault();
        const placeDate = {
            title, address, addedPhotos,
            description, extraInfo, 
            price,
        };
        if(id){
            //update
            await axios.put('/places', {
                id, ...placeDate
            });
            setRedirect(true);
        } else {
            //new place
            await axios.post('/places', placeDate);
            setRedirect(true);
        }
    }

    if(redirect){
        return <Navigate to={'/account/places'}/>
    }

    return (
        <div>
        <AccountNav/>
        <form onSubmit={savePlace}>
            {preInput('Tên', 'Tên sản phẩm')}
            <input 
                value={title}  
                onChange={ev => SetTitle(ev.target.value)}
                type="text" placeholder="title, for example: My lovely apt" />
            {preInput('Địa chỉ', 'Địa chỉ shop')}
            <input
                value={address}
                onChange={ev => setAddress(ev.target.value)}
                type="text" placeholder="Address" />
            {preInput('Hình ảnh', 'thêm hình ảnh cho sản phẩm')}
            <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
            {preInput('Thông tin sản phẩm','thông tin cơ bản của sản phẩm')}
            <textarea 
                value={description}
                onChange={ev=>SetDescription(ev.target.value)}
            />
            {preInput('Thông tin hàng còn, chất lượng', 'thông tin hàng còn')}
            <textarea
                value={extraInfo}
                onChange={ev=>setExtraInfo(ev.target.value)}
            />
            {preInput('Giá sản phẩm', 'giá tiền của sản phẩm')}
            <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                <div>
                    <input
                    value={price}
                    onChange={ev => setPrice(ev.target.value)} 
                    type="number" />
                </div>

            </div>           
            <button className="primary my-4">Thêm</button>
            
        </form>
    </div>
    );
}