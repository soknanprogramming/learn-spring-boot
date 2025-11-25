import React, { useEffect } from "react";
import ListRow from "./ListRow.tsx";
import useProducts from "../stores/useProducts.ts";



const TableProduct: React.FC = () => {
    const { products, loading, error, fetchProducts } = useProducts();

    useEffect(() => {
        if(products.length === 0 || products === null){
            fetchProducts();
            console.log(`Table Product Products: ${products}`);
            console.log(`Table Product Loading: ${loading}`);
            console.log(`Table Product Error: ${error}`);
        }
    }, [fetchProducts]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <table className="w-10/12 text-sm text-left text-body mx-auto mt-5">
            <thead className="text-sm text-body border-b border-2">
                <tr>
                    <th scope="col" className="px-6 py-3 bg-neutral-100 font-medium">ID</th>
                    <th scope="col" className="px-6 py-3 font-medium">Name</th>
                    <th scope="col" className="px-6 py-3 bg-neutral-100 font-medium">Price</th>
                    <th scope="col" className="px-6 py-3 font-medium">Quantity</th>
                    <th scope="col" className="px-6 py-3 bg-neutral-100 font-medium">Features</th>
                </tr>
            </thead>
            <tbody className="border-b border-2">
                {products.map((product) => (
                    <ListRow
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        quantity={product.quantity}
                    />
                ))}
            </tbody>
        </table>
    );
};

export default TableProduct;
