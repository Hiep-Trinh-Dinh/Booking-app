import {useState} from "react";
export default function PlaceGallery({place}) {
    const [showAllPhotos, setShowAllPhotos] = useState(false);

    if (showAllPhotos) {
        return (
            <div className="absolute inset-0 bg-black text-white min-w-full min-h-screen">
                <div className="bg-black p-8 grid gap-4">
                    <div>
                        <h2 className="text-3xl mr-48">Photos of {place.title}</h2>
                        <button onClick={() => setShowAllPhotos(false)} className="fixed right-12 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                            Close photos
                        </button>
                    </div>
                    {place?.photos?.length > 0 && place.photos.map(photo => (
                        <div key={photo}>
                            <img src={photo} alt=""/>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
                    <div className="grid gap-1 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
                        <div>
                            {place.photos?.[0] && ( 
                                <img onClick={() => setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover" src={place.photos[0]} alt="" />
                            )}
                        </div>      
                        <div className="grid">    
                            {place.photos?.[1] && (
                                <img onClick={() => setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover" src={place.photos[1]} alt="" />
                            )}
                            <div className="overflow-hidden">
                            {place.photos?.[2] && (
                                <img onClick={() => setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover relative top-2" src={place.photos[1]} alt="" />
                            )}  
                            </div>  
                        </div>
                    </div>             
                <button onClick={() => setShowAllPhotos(true)}  className="absolute bottom-10 right-8 py-2 px-4 bg-white rounded-2xl shadow shadow-md shadow-gray-500">
                    Show more photos
                </button>
            </div>
    );
}