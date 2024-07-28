import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "antd"; // Sử dụng thành phần Pagination từ antd

export default function IndexPage() {
    const [places, setPlaces] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(8); // Số lượng mục trên mỗi trang

    useEffect(() => {
        axios.get('/places').then(response => {
            setPlaces(response.data);
            setFilteredPlaces(response.data);
        });
    }, []);

    const handleSearch = () => {
        const results = places.filter(place =>
            place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            place.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPlaces(results);
        setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
    };

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const indexOfLastPlace = currentPage * pageSize;
    const indexOfFirstPlace = indexOfLastPlace - pageSize;
    const currentPlaces = filteredPlaces.slice(indexOfFirstPlace, indexOfLastPlace);

    return (
        <>  
            <div className="flex justify-center mt-10 mb-10">
                <div className="flex gap-2 border border-gray-300 rounded-full shadow-md shadow-gray-500 px-2 py-1 w-full max-w-lg">
                    <input 
                        className="border-none outline-none flex-grow"
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={handleInputChange}
                    />
                    <div className='border-gray-300'></div>
                    <button 
                        className="primary text-white border-2" 
                        style={{ width: '60px' }}
                        onClick={handleSearch}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 mx-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {currentPlaces.length > 0 ? (
                    currentPlaces.map(place => (
                        <Link to={'/place/' + place._id} key={place._id}>
                            <div className="bg-gray-500 mb-2 rounded-2xl flex">
                                {place.photos?.[0] && (
                                    <img className="rounded-2xl object-cover aspect-square" src={place.photos[0]} alt={place.title} />
                                )}
                            </div>
                            <h3 className="font-bold">{place.title}</h3>
                            <h2 className="text-sm text-gray-500">{place.description}</h2>
                            <div className="mt-1">
                                <span className="font-bold">${place.price}</span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center col-span-full">
                        <p className="text-lg font-semibold">Không tìm thấy sản phẩm đang tìm</p>
                    </div>
                )}
            </div>
            <div className="flex justify-center mt-10">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredPlaces.length}
                    onChange={handlePageChange}
                />
            </div>
        </>
    );
}
