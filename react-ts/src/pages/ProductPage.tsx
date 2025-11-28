import React from "react"
import TableProduct from "../components/TableProduct"
import SearchBar from "../components/SearchBar"

const ProductPage: React.FC = () => {
    return (
        <div className="justify-center">
            <SearchBar />
            <TableProduct />
        </div>
    )
}

export default ProductPage