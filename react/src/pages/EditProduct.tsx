import React, { useState, useEffect } from "react";
import type { Product } from "../types/Product";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';


const EditProduct: React.FC = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams<{ id: string}>();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

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

    const onSave = async () => {
        if (!product) return;
        try {
            await axios.put(`${apiUrl}/api/products/${id}`, product);
            alert("Product saved successfully!");
            navigate("/product");
        } catch (err: any) {
            alert("Error saving product: " + err.message);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>Error: {error}</p>;
    }
    if (!product) {
        return <p>Product not found</p>;
    }


    return(
        <>
            <h1 className="text-3xl">Edit Product</h1>
            <h3 className="text-2xl">ID : {id}</h3>
            <form 
                onSubmit={e => {
                    e.preventDefault();
                    onSave();
                }}
            >
                <div className="my-2">
                    <p className="inline-block">
                        Name: 
                    </p>
                    <input 
                        className="border-2 ml-3 rounded-md p-1"
                        type="text" 
                        value={product?.name} 
                        onChange={e => setProduct({ ...product, name: e.target.value })}
                    />
                </div>
                <div className="my-2">
                    <p className="inline-block">
                        Price: 

                    </p>
                    <input 
                        className="border-2 ml-3 rounded-md p-1"
                        type="number" 
                        value={product?.price} 
                        onChange={e => setProduct({ ...product, price: Number(e.target.value) })}
                    />
                </div>
                <div className="my-2">
                    <p className="inline-block">
                        Quantity: 
                    </p>
                    <input 
                        className="border-2 ml-3 rounded-md p-1"
                        type="number" 
                        value={product?.quantity} 
                        onChange={e => setProduct({ ...product, quantity: Number(e.target.value) })}
                    />
                </div>
                <div>
                    <p className="inline-block">
                        Description: 
                    </p>
                    <input 
                        className="border-2 ml-3 rounded-md p-1"
                        type="text" 
                        value={product?.description} 
                        onChange={e => setProduct({ ...product, description: e.target.value })}
                    />
                </div>
                <button 
                    className="bg-red-600 text-amber-50 rounded-2xl w-28 p-2 m-6 hover:bg-blue-500 border-2"
                    type="submit"
                >
                    Save
                </button>
            </form>
        </>
    )
}

export default EditProduct;