import React, { useState, useEffect } from "react";
import type { Product } from "../types/Product";
import axios from "axios";
import { useParams } from 'react-router-dom';


const ViewDetail: React.FC = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams<{ id: string}>();


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/products/${id}`);
                setProduct(response.data);
                setLoading(false);
            } catch(err: any) {
                setError(err.message);
                setLoading(false);
            }
        }
        fetchProduct();
    }, []);

    if (loading) {
        return <p className="text-center text-lg mt-10">Loading...</p>;
    }
    if (error) {
        return <p className="text-center text-lg mt-10 text-red-500">Error: {error}</p>;
    }
    if (!product) {
        return <p className="text-center text-lg mt-10">Product not found</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl">
                <h1 className="text-4xl font-extrabold mb-6 text-gray-900 border-b pb-4">Product Detail</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-lg">
                    <p><span className="font-semibold text-gray-700">ID:</span> <span className="text-gray-600">{product.id}</span></p>
                    <p><span className="font-semibold text-gray-700">Name:</span> <span className="text-gray-600">{product.name}</span></p>
                    <p><span className="font-semibold text-gray-700">Price:</span> <span className="text-gray-600">${product.price}</span></p>
                    <p><span className="font-semibold text-gray-700">Quantity:</span> <span className="text-gray-600">{product.quantity}</span></p>
                    <div className="md:col-span-2 mt-4">
                        <p className="font-semibold text-gray-700">Description:</p>
                        <p className="text-gray-600 mt-1">{product.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewDetail;
