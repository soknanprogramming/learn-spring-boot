import React from "react";
import { Link } from "react-router-dom";

interface ListRowProps {
    id : number;
    name : string;
    price : number;
    quantity : number;
}

const ListRow: React.FC<ListRowProps> = ({ id, name, price, quantity }) => {
    return (
        <tr className="border-b">
            <td scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap bg-neutral-400">{id}</td>
            <td className="px-6 py-4">{name}</td>
            <td className="px-6 py-4 bg-neutral-100">{price}</td>
            <td className="px-6 py-4">{quantity}</td>
            <td className="px-6 py-4 bg-neutral-100">
                <Link to={`/product/${id}`} className="underline text-blue-500">view</Link>
                <a href="" className="underline text-blue-500 ml-2">edit</a>
                <a href="" className="underline text-blue-500 ml-2">delete</a>
            </td>
        </tr>
    );
};

export default ListRow;
