import React from "react";
import { Link } from "react-router-dom";

interface ListRowProps {
    id : number;
    name : string;
    price : number;
    quantity : number;
    onDelete: (id: number) => void;
}

const ListRow: React.FC<ListRowProps> = ({ id, name, price, quantity, onDelete }) => {
    return (
        <tr className="border-b">
            <td scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap bg-neutral-400">{id}</td>
            <td className="px-6 py-4">{name}</td>
            <td className="px-6 py-4 bg-neutral-100">{price}</td>
            <td className="px-6 py-4">{quantity}</td>
            <td className="px-6 py-4 bg-neutral-100">
                <Link to={`/product/${id}`} className="underline text-blue-500">view</Link>
                <Link to={`/product/${id}/edit`} className="underline text-blue-500 ml-2">edit</Link>
                <button onClick={() => onDelete(id)} className="underline text-blue-500 ml-2">delete</button>
            </td>
        </tr>
    );
};

export default ListRow;
