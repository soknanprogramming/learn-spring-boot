import React, { useState } from "react";
import useProducts from "../stores/useProducts";

const SearchBar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const { searchProducts } = useProducts();

    const handleSearch = () => {
        searchProducts(searchTerm);
    }


    return (
        <div className="m-3">
            <input 
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text" 
                value={searchTerm} 
                placeholder="Search something" 
                className="border py-1.5 mr-5 rounded-md pl-3"
            />
            <button 
                className="bg-amber-300 py-1.5 px-3 rounded-md hover:border cursor-pointer"
                onClick={handleSearch}
            >
                Search
            </button>
        </div>
    )
}

export default SearchBar;